const { StateGraph } = require("@langchain/langgraph");
const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Annotation } = require("@langchain/langgraph");
const prisma = require("../utils/prisma");

// ─── LLM Setup ───────────────────────────────────────────────────────────────
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
});

const creativeLlm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
});

// ─── Tool Functions (Prisma DB Queries) ──────────────────────────────────────
async function searchProducts(query) {
    try {
        // Extract price hints from the query
        const priceMatch = query.match(/(?:under|below|less than|within|upto|up to)\s*(?:rs\.?|₹|inr)?\s*(\d+)/i);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

        const minPriceMatch = query.match(/(?:above|over|more than|starting)\s*(?:rs\.?|₹|inr)?\s*(\d+)/i);
        const minPrice = minPriceMatch ? parseInt(minPriceMatch[1]) : null;

        // Build search words (remove common stop words & price text)
        const cleanQuery = query
            .replace(/(?:under|below|less than|within|upto|up to|above|over|more than|starting)\s*(?:rs\.?|₹|inr)?\s*\d+/gi, '')
            .replace(/(?:show|find|search|get|give|list|any|me|have|you|do|the|a|an|in|for|of|with|is|are|some|please|i want|i need|looking for)/gi, '')
            .trim();

        const searchWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

        // Build Prisma where clause
        const where = {
            AND: [
                ...(searchWords.length > 0
                    ? [{
                        OR: searchWords.flatMap(word => [
                            { name: { contains: word, mode: 'insensitive' } },
                            { description: { contains: word, mode: 'insensitive' } },
                            { category: { name: { contains: word, mode: 'insensitive' } } }
                        ])
                    }]
                    : []),
                ...(maxPrice ? [{ price: { lte: maxPrice } }] : []),
                ...(minPrice ? [{ price: { gte: minPrice } }] : [])
            ]
        };

        const products = await prisma.product.findMany({
            where: where.AND.length > 0 ? where : undefined,
            include: {
                category: { select: { name: true } },
                variants: { select: { size: true, color: true, stock: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            comparePrice: p.comparePrice,
            image: p.images?.[0] || null,
            category: p.category?.name || 'Uncategorized',
            inStock: p.variants.some(v => v.stock > 0),
            variants: p.variants.map(v => `${v.color} / ${v.size} (${v.stock} in stock)`).slice(0, 5)
        }));
    } catch (error) {
        console.error("[Tool] searchProducts error:", error.message);
        return [];
    }
}

async function lookupOrder(orderIdentifier) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { contains: orderIdentifier, mode: 'insensitive' } },
                    { id: orderIdentifier }
                ]
            },
            include: {
                items: {
                    include: {
                        product: { select: { name: true } },
                        variant: { select: { size: true, color: true } }
                    }
                },
                address: { select: { city: true, state: true } }
            }
        });

        if (!order) return null;

        return {
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            total: order.total,
            date: order.createdAt.toISOString().split('T')[0],
            deliveryCity: order.address?.city || 'N/A',
            items: order.items.map(i => ({
                product: i.product.name,
                variant: `${i.variant.color} / ${i.variant.size}`,
                qty: i.quantity,
                price: i.price
            }))
        };
    } catch (error) {
        console.error("[Tool] lookupOrder error:", error.message);
        return null;
    }
}

async function checkStock(productName) {
    try {
        const products = await prisma.product.findMany({
            where: {
                name: { contains: productName, mode: 'insensitive' }
            },
            include: {
                variants: { select: { size: true, color: true, stock: true } }
            },
            take: 3
        });

        return products.map(p => ({
            name: p.name,
            variants: p.variants.map(v => ({
                size: v.size,
                color: v.color,
                stock: v.stock,
                available: v.stock > 0
            }))
        }));
    } catch (error) {
        console.error("[Tool] checkStock error:", error.message);
        return [];
    }
}

// ─── State Schema ────────────────────────────────────────────────────────────
const StateAnnotation = Annotation.Root({
    query: Annotation({ reducer: (_, b) => b, default: () => "" }),
    history: Annotation({ reducer: (_, b) => b, default: () => [] }),
    category: Annotation({ reducer: (_, b) => b, default: () => "" }),
    sentiment: Annotation({ reducer: (_, b) => b, default: () => "" }),
    toolResults: Annotation({ reducer: (_, b) => b, default: () => null }),
    products: Annotation({ reducer: (_, b) => b, default: () => [] }),
    response: Annotation({ reducer: (_, b) => b, default: () => "" }),
});

// ─── Helper: Format conversation history ─────────────────────────────────────
function formatHistory(history) {
    if (!history || history.length === 0) return "No previous messages.";
    const recent = history.slice(-6); // Last 6 messages (3 exchanges)
    return recent.map(m => `${m.role === 'user' ? 'Customer' : 'Agent'}: ${m.text}`).join('\n');
}

// ─── Node: Categorize Query ──────────────────────────────────────────────────
async function categorize(state) {
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a query classifier for Raymond, a premium Indian fashion e-commerce store.

Previous conversation:
{history}

Categorize the customer's latest query into ONE of these categories:
- "product_search" — asking about products, wanting to see/find items, asking for recommendations, pricing
- "order_tracking" — asking about order status, delivery, shipment tracking
- "stock_check" — asking about availability, sizes, stock of a specific product
- "technical" — website issues, account problems, login, payment gateway errors
- "billing" — refund status, charges, invoice, payment problems
- "general" — everything else (returns policy, store locations, fabric care, etc.)

Respond with EXACTLY one word from the list above. No explanation.
Query: {query}`
    );
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history)
    });
    const raw = result.content.trim().toLowerCase();

    let category = "general";
    if (raw.includes("product_search")) category = "product_search";
    else if (raw.includes("order_tracking")) category = "order_tracking";
    else if (raw.includes("stock_check")) category = "stock_check";
    else if (raw.includes("technical")) category = "technical";
    else if (raw.includes("billing")) category = "billing";

    console.log(`[LangGraph] category: ${category}`);
    return { category };
}

// ─── Node: Analyze Sentiment ─────────────────────────────────────────────────
async function analyzeSentiment(state) {
    const prompt = ChatPromptTemplate.fromTemplate(
        `Analyze the sentiment of this customer query. Respond with EXACTLY one word: 'positive', 'negative', or 'neutral'. No explanation.
Query: {query}`
    );
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({ query: state.query });
    const raw = result.content.trim().toLowerCase();

    let sentiment = "neutral";
    if (raw.includes("negative")) sentiment = "negative";
    else if (raw.includes("positive")) sentiment = "positive";

    console.log(`[LangGraph] sentiment: ${sentiment}`);
    return { sentiment };
}

// ─── Node: RAG — Search Products from DB ─────────────────────────────────────
async function ragSearchProducts(state) {
    console.log("[LangGraph] RAG: searching products in database...");
    const products = await searchProducts(state.query);
    console.log(`[LangGraph] RAG: found ${products.length} products`);
    return { products, toolResults: products };
}

// ─── Node: Tool — Lookup Order ───────────────────────────────────────────────
async function toolLookupOrder(state) {
    console.log("[LangGraph] Tool: looking up order...");
    // Extract order number from query
    const orderMatch = state.query.match(/(?:ORD[-\s]?\w+|\b[A-Z0-9]{8,}\b)/i);
    const orderNumber = orderMatch ? orderMatch[0].trim() : state.query;
    const order = await lookupOrder(orderNumber);
    console.log(`[LangGraph] Tool: order found: ${!!order}`);
    return { toolResults: order };
}

// ─── Node: Tool — Check Stock ────────────────────────────────────────────────
async function toolCheckStock(state) {
    console.log("[LangGraph] Tool: checking stock...");
    const stock = await checkStock(state.query);
    console.log(`[LangGraph] Tool: found ${stock.length} products`);
    return { toolResults: stock };
}

// ─── Node: Handle Product Search (with RAG context) ──────────────────────────
async function handleProductSearch(state) {
    console.log("[LangGraph] handling product search with RAG data");
    const productContext = state.products?.length > 0
        ? `\n\nHere are the matching products from our store:\n${state.products.map((p, i) =>
            `${i + 1}. ${p.name} — ₹${p.price}${p.comparePrice ? ` (was ₹${p.comparePrice})` : ''} | Category: ${p.category} | ${p.inStock ? 'In Stock' : 'Out of Stock'}`
        ).join('\n')}`
        : "\n\nNo matching products were found in our current inventory.";

    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a friendly shopping assistant for Raymond, a premium Indian fashion brand.

Previous conversation:
{history}

The customer asked: {query}
{productContext}

Based on the product data above, help the customer. If products were found, briefly describe the best matches and mention prices. If no products matched, suggest they browse our website or try different search terms. Keep it concise (2-3 sentences). Be warm and professional.`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history),
        productContext
    });
    return { response: result.content };
}

// ─── Node: Handle Order Tracking (with real order data) ──────────────────────
async function handleOrderTracking(state) {
    console.log("[LangGraph] handling order tracking");
    const orderData = state.toolResults;
    const orderContext = orderData
        ? `\nOrder found:\n- Order #${orderData.orderNumber}\n- Status: ${orderData.status}\n- Payment: ${orderData.paymentStatus} (${orderData.paymentMethod})\n- Total: ₹${orderData.total}\n- Date: ${orderData.date}\n- Delivery to: ${orderData.deliveryCity}\n- Items: ${orderData.items.map(i => `${i.product} (${i.variant}) x${i.qty}`).join(', ')}`
        : "\nNo order was found matching the provided details.";

    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a customer support agent for Raymond, a premium Indian fashion brand.

Previous conversation:
{history}

The customer asked about their order: {query}
{orderContext}

If the order was found, summarize the status clearly and professionally. If not found, ask them to verify the order number. Keep it concise.`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history),
        orderContext
    });
    return { response: result.content };
}

// ─── Node: Handle Stock Check (with real stock data) ─────────────────────────
async function handleStockCheck(state) {
    console.log("[LangGraph] handling stock check");
    const stockData = state.toolResults;
    const stockContext = Array.isArray(stockData) && stockData.length > 0
        ? `\nStock information:\n${stockData.map(p =>
            `${p.name}:\n${p.variants.map(v => `  - ${v.color} / ${v.size}: ${v.available ? `${v.stock} available` : 'Out of stock'}`).join('\n')}`
        ).join('\n')}`
        : "\nNo matching products found in our inventory.";

    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a helpful assistant for Raymond, a premium Indian fashion brand.

Previous conversation:
{history}

The customer asked about stock availability: {query}
{stockContext}

Share the availability details clearly. If items are out of stock, suggest checking back later or exploring similar products. Keep it concise.`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history),
        stockContext
    });
    return { response: result.content };
}

// ─── Node: Handle Technical ──────────────────────────────────────────────────
async function handleTechnical(state) {
    console.log("[LangGraph] handling technical query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a technical support agent for Raymond, a premium Indian fashion brand.

Previous conversation:
{history}

Help the customer with their technical issue. Provide clear, step-by-step solutions. Keep it concise (2-3 paragraphs max). Use bullet points for steps.
Query: {query}`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history)
    });
    return { response: result.content };
}

// ─── Node: Handle Billing ────────────────────────────────────────────────────
async function handleBilling(state) {
    console.log("[LangGraph] handling billing query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a billing support agent for Raymond, a premium Indian fashion brand.

Previous conversation:
{history}

Help the customer with their billing/payment issue. Be professional and reassuring. Keep it concise (2-3 paragraphs max).
Query: {query}`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history)
    });
    return { response: result.content };
}

// ─── Node: Handle General ────────────────────────────────────────────────────
async function handleGeneral(state) {
    console.log("[LangGraph] handling general query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a friendly customer support agent for Raymond, a premium Indian fashion brand established in 1925.

Previous conversation:
{history}

Help the customer with their query about products, returns, stores, fabric care, or styling. Reflect Raymond's heritage of quality. Keep it concise (2-3 paragraphs max).
Query: {query}`
    );
    const chain = prompt.pipe(creativeLlm);
    const result = await chain.invoke({
        query: state.query,
        history: formatHistory(state.history)
    });
    return { response: result.content };
}

// ─── Node: Escalate ──────────────────────────────────────────────────────────
async function escalate(state) {
    console.log("[LangGraph] escalating due to negative sentiment");
    return {
        response:
            "We sincerely apologize for the inconvenience. Your concern has been escalated to a senior support specialist who will reach out within 24 hours. You can also reach us at support@raymonds.me or call our helpline for immediate assistance.",
    };
}

// ─── Conditional Edge: Route Query ───────────────────────────────────────────
function routeQuery(state) {
    if (state.sentiment === "negative") {
        return "escalate";
    }
    const routes = {
        product_search: "rag_search_products",
        order_tracking: "tool_lookup_order",
        stock_check: "tool_check_stock",
        technical: "handle_technical",
        billing: "handle_billing",
    };
    return routes[state.category] || "handle_general";
}

// ─── Build the StateGraph ────────────────────────────────────────────────────
const workflow = new StateGraph(StateAnnotation)
    // Entry nodes
    .addNode("categorize", categorize)
    .addNode("analyze_sentiment", analyzeSentiment)

    // Tool/RAG nodes
    .addNode("rag_search_products", ragSearchProducts)
    .addNode("tool_lookup_order", toolLookupOrder)
    .addNode("tool_check_stock", toolCheckStock)

    // Handler nodes
    .addNode("handle_product_search", handleProductSearch)
    .addNode("handle_order_tracking", handleOrderTracking)
    .addNode("handle_stock_check", handleStockCheck)
    .addNode("handle_technical", handleTechnical)
    .addNode("handle_billing", handleBilling)
    .addNode("handle_general", handleGeneral)
    .addNode("escalate", escalate)

    // Edges: entry flow
    .addEdge("__start__", "categorize")
    .addEdge("categorize", "analyze_sentiment")

    // Conditional routing from sentiment analysis
    .addConditionalEdges("analyze_sentiment", routeQuery)

    // Tool/RAG → Handler edges
    .addEdge("rag_search_products", "handle_product_search")
    .addEdge("tool_lookup_order", "handle_order_tracking")
    .addEdge("tool_check_stock", "handle_stock_check")

    // All handlers → END
    .addEdge("handle_product_search", "__end__")
    .addEdge("handle_order_tracking", "__end__")
    .addEdge("handle_stock_check", "__end__")
    .addEdge("handle_technical", "__end__")
    .addEdge("handle_billing", "__end__")
    .addEdge("handle_general", "__end__")
    .addEdge("escalate", "__end__");

// Compile the graph
const app = workflow.compile();

// ─── Entry Point ─────────────────────────────────────────────────────────────
async function runCustomerSupport(query, history = []) {
    console.log(`[LangGraph] Running customer support for: "${query}" (${history.length} history msgs)`);

    const result = await app.invoke({ query, history });

    console.log(`[LangGraph] Done — category: ${result.category}, sentiment: ${result.sentiment}, products: ${result.products?.length || 0}`);

    return {
        category: result.category,
        sentiment: result.sentiment,
        response: result.response,
        escalated: result.sentiment === "negative",
        products: result.products || [],
    };
}

module.exports = { runCustomerSupport };

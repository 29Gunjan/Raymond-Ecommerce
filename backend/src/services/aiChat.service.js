const { StateGraph, END } = require("@langchain/langgraph");
const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Annotation } = require("@langchain/langgraph");

// ─── LLM Setup ───────────────────────────────────────────────────────────────
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
});

// ─── State Schema (mirrors Python TypedDict from Project.ipynb) ──────────────
const StateAnnotation = Annotation.Root({
    query: Annotation({ reducer: (_, b) => b, default: () => "" }),
    category: Annotation({ reducer: (_, b) => b, default: () => "" }),
    sentiment: Annotation({ reducer: (_, b) => b, default: () => "" }),
    response: Annotation({ reducer: (_, b) => b, default: () => "" }),
});

// ─── Node: Categorize Query ──────────────────────────────────────────────────
async function categorize(state) {
    const prompt = ChatPromptTemplate.fromTemplate(
        `Categorize the following query into one of the following categories: Technical, Billing, General. 
Respond with EXACTLY one word: "technical", "billing", or "general". No explanation.
Query={query}`
    );
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({ query: state.query });
    const raw = result.content.trim().toLowerCase();

    let category = "general";
    if (raw.includes("technical")) category = "technical";
    else if (raw.includes("billing")) category = "billing";

    console.log(`[LangGraph] category: ${category}`);
    return { category };
}

// ─── Node: Analyze Sentiment ─────────────────────────────────────────────────
async function analyzeSentiment(state) {
    const prompt = ChatPromptTemplate.fromTemplate(
        `Analyze the following query sentiment and respond with either 'positive', 'negative' or 'neutral'. 
Respond with EXACTLY one word. No explanation.
Query={query}`
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

// ─── Node: Handle Technical Query ────────────────────────────────────────────
async function handleTechnical(state) {
    console.log("[LangGraph] handling technical query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a friendly and knowledgeable technical support agent for Raymond, a premium Indian fashion and textile brand.
Help customers with website issues, account problems, sizing tools, and order tracking technical difficulties.
Keep responses concise (2-3 paragraphs max), professional yet warm. Use bullet points for steps.
Provide technical support response to the following query: {query}`
    );
    const chain = prompt.pipe(
        new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.3-70b-versatile", temperature: 0.7 })
    );
    const result = await chain.invoke({ query: state.query });
    return { response: result.content };
}

// ─── Node: Handle Billing Query ──────────────────────────────────────────────
async function handleBilling(state) {
    console.log("[LangGraph] handling billing query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a helpful billing support agent for Raymond, a premium Indian fashion and textile brand.
Help customers with payment issues, refunds, charges, invoices, and pricing questions.
Keep responses concise (2-3 paragraphs max), professional and reassuring. Reference Raymond's customer-first policies.
Provide billing support response to the following query: {query}`
    );
    const chain = prompt.pipe(
        new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.3-70b-versatile", temperature: 0.7 })
    );
    const result = await chain.invoke({ query: state.query });
    return { response: result.content };
}

// ─── Node: Handle General Query ──────────────────────────────────────────────
async function handleGeneral(state) {
    console.log("[LangGraph] handling general query");
    const prompt = ChatPromptTemplate.fromTemplate(
        `You are a friendly customer support agent for Raymond, a premium Indian fashion and textile brand established in 1925.
Help customers with general queries about products, orders, returns, store locations, fabric care, and styling advice.
Keep responses concise (2-3 paragraphs max), warm and premium-feeling. Reflect Raymond's heritage of quality.
Provide general support response to the following query: {query}`
    );
    const chain = prompt.pipe(
        new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.3-70b-versatile", temperature: 0.7 })
    );
    const result = await chain.invoke({ query: state.query });
    return { response: result.content };
}

// ─── Node: Escalate (negative sentiment) ─────────────────────────────────────
async function escalate(state) {
    console.log("[LangGraph] escalating query due to negative sentiment");
    return {
        response:
            "We sincerely apologize for the inconvenience. Your concern is very important to us, and we've escalated this to a senior support specialist who will reach out to you within 24 hours. In the meantime, you can also reach us at support@raymonds.me or call our helpline.",
    };
}

// ─── Conditional Edge: Route Query (mirrors route_query from notebook) ───────
function routeQuery(state) {
    // Prioritize negative sentiment → escalate
    if (state.sentiment === "negative") {
        return "escalate";
    }
    // Route based on category
    const routes = {
        technical: "handle_technical",
        billing: "handle_billing",
    };
    return routes[state.category] || "handle_general";
}

// ─── Build the StateGraph (mirrors exact structure from Project.ipynb) ────────
const workflow = new StateGraph(StateAnnotation)
    // Add all nodes
    .addNode("categorize", categorize)
    .addNode("analyze_sentiment", analyzeSentiment)
    .addNode("handle_technical", handleTechnical)
    .addNode("handle_billing", handleBilling)
    .addNode("handle_general", handleGeneral)
    .addNode("escalate", escalate)

    // Set entry point
    .addEdge("__start__", "categorize")

    // categorize → analyze_sentiment
    .addEdge("categorize", "analyze_sentiment")

    // analyze_sentiment → conditional routing
    .addConditionalEdges("analyze_sentiment", routeQuery)

    // All handler nodes → END
    .addEdge("handle_technical", "__end__")
    .addEdge("handle_billing", "__end__")
    .addEdge("handle_general", "__end__")
    .addEdge("escalate", "__end__");

// Compile the graph (same as notebook: app = workflow.compile())
const app = workflow.compile();

// ─── Entry point (same API as before → no frontend changes needed) ───────────
async function runCustomerSupport(query) {
    console.log(`[LangGraph] Running customer support graph for: "${query}"`);

    // Invoke the compiled LangGraph StateGraph
    const result = await app.invoke({ query });

    console.log(`[LangGraph] Result — category: ${result.category}, sentiment: ${result.sentiment}`);

    return {
        category: result.category,
        sentiment: result.sentiment,
        response: result.response,
        escalated: result.sentiment === "negative",
    };
}

module.exports = { runCustomerSupport };

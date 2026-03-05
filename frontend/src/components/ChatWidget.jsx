import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './ChatWidget.css';

const WELCOME_MSG = {
    role: 'bot',
    text: "Welcome to Raymond Support! I'm your AI assistant. Ask me about products, orders, billing, or any technical issues.",
    category: null,
    sentiment: null,
    products: [],
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Build conversation history for memory
    const getHistory = () => {
        return messages
            .filter(m => m.role === 'user' || m.role === 'bot')
            .slice(-8) // Last 8 messages (4 exchanges)
            .map(m => ({ role: m.role, text: m.text }));
    };

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
        setLoading(true);

        try {
            const history = getHistory();
            const { data } = await api.post('/chat', { message: trimmed, history });
            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'bot',
                        text: data.data.response,
                        category: data.data.category,
                        sentiment: data.data.sentiment,
                        escalated: data.data.escalated,
                        products: data.data.products || [],
                    },
                ]);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text: err?.response?.data?.error || 'Sorry, something went wrong. Please try again later.',
                    category: null,
                    sentiment: null,
                    products: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([WELCOME_MSG]);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="chat-panel">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header__info">
                            <div className="chat-header__avatar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8V4H8" />
                                    <rect width="16" height="12" x="4" y="8" rx="2" />
                                    <path d="M2 14h2" />
                                    <path d="M20 14h2" />
                                    <path d="M15 13v2" />
                                    <path d="M9 13v2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="chat-header__title">Raymond AI Support</h3>
                                <span className="chat-header__status">
                                    <span className="chat-header__dot"></span>
                                    Online · RAG Enabled
                                </span>
                            </div>
                        </div>
                        <button className="chat-header__clear" onClick={clearChat} title="Clear chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                                {msg.role === 'bot' && (
                                    <div className="chat-msg__avatar">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 8V4H8" />
                                            <rect width="16" height="12" x="4" y="8" rx="2" />
                                            <path d="M2 14h2" />
                                            <path d="M20 14h2" />
                                            <path d="M15 13v2" />
                                            <path d="M9 13v2" />
                                        </svg>
                                    </div>
                                )}
                                <div className="chat-msg__content">
                                    <p className="chat-msg__text">{msg.text}</p>

                                    {/* Product Cards from RAG */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="chat-products">
                                            {msg.products.map((product, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`/product/${product.slug}`}
                                                    className="chat-product-card"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <div className="chat-product-card__image">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} />
                                                        ) : (
                                                            <div className="chat-product-card__placeholder">
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="chat-product-card__info">
                                                        <p className="chat-product-card__name">{product.name}</p>
                                                        <div className="chat-product-card__pricing">
                                                            <span className="chat-product-card__price">{formatPrice(product.price)}</span>
                                                            {product.comparePrice && product.comparePrice > product.price && (
                                                                <span className="chat-product-card__compare">{formatPrice(product.comparePrice)}</span>
                                                            )}
                                                        </div>
                                                        <span className={`chat-product-card__stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Meta Badges */}
                                    {msg.category && (
                                        <div className="chat-msg__meta">
                                            <span className={`chat-badge chat-badge--${msg.category}`}>
                                                {msg.category.replace('_', ' ')}
                                            </span>
                                            <span className={`chat-badge chat-badge--${msg.sentiment}`}>
                                                {msg.sentiment}
                                            </span>
                                            {msg.escalated && (
                                                <span className="chat-badge chat-badge--escalated">
                                                    Escalated
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-msg chat-msg--bot">
                                <div className="chat-msg__avatar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 8V4H8" />
                                        <rect width="16" height="12" x="4" y="8" rx="2" />
                                        <path d="M2 14h2" />
                                        <path d="M20 14h2" />
                                        <path d="M15 13v2" />
                                        <path d="M9 13v2" />
                                    </svg>
                                </div>
                                <div className="chat-msg__content">
                                    <div className="chat-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about products, orders, stock..."
                            disabled={loading}
                        />
                        <button
                            className="chat-input__send"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';

function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Orders & Shipping',
            questions: [
                {
                    q: 'How can I track my order?',
                    a: 'You can track your order using the "Track Order" page. Enter your order number and email to get real-time updates on your shipment.'
                },
                {
                    q: 'What are the delivery charges?',
                    a: 'Standard delivery is ₹199, free on orders above ₹2,999. Express delivery is ₹399, free on orders above ₹5,999. Same-day delivery is available at ₹599 in select cities.'
                },
                {
                    q: 'How long does delivery take?',
                    a: 'Standard delivery takes 5-7 business days, Express delivery takes 2-3 business days, and Same-day delivery is available in select metro cities.'
                },
                {
                    q: 'Do you ship internationally?',
                    a: 'Currently, we only ship within India. International shipping will be available soon.'
                }
            ]
        },
        {
            category: 'Returns & Refunds',
            questions: [
                {
                    q: 'What is your return policy?',
                    a: 'We offer a 30-day return policy on all unworn items with original tags attached. Returns are free for all domestic orders.'
                },
                {
                    q: 'How do I return an item?',
                    a: 'Log into your account, go to "My Orders", select the item you want to return, and follow the return process. You can schedule a free pickup or drop at our store.'
                },
                {
                    q: 'When will I receive my refund?',
                    a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.'
                }
            ]
        },
        {
            category: 'Products & Sizing',
            questions: [
                {
                    q: 'How do I find my size?',
                    a: 'Each product page has a detailed size guide. We recommend measuring yourself and comparing with our size chart for the best fit.'
                },
                {
                    q: 'Are your products genuine Raymond?',
                    a: 'Yes, all products on our website are 100% authentic Raymond products with original tags and packaging.'
                },
                {
                    q: 'Can I get custom tailoring?',
                    a: 'Yes, we offer custom tailoring services at our physical stores. You can also add alteration notes during checkout for basic adjustments.'
                }
            ]
        },
        {
            category: 'Payment & Security',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept Credit/Debit Cards, Net Banking, UPI, and Cash on Delivery. All payments are 100% secure and encrypted.'
                },
                {
                    q: 'Is Cash on Delivery available?',
                    a: 'Yes, COD is available on orders up to ₹25,000. A nominal fee of ₹50 applies for COD orders.'
                },
                {
                    q: 'Is my payment information secure?',
                    a: 'Absolutely. We use industry-standard SSL encryption and do not store your card details on our servers.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">FAQ</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-slate-600">Find answers to common questions about shopping with Raymond</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="space-y-10">
                    {faqs.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-2xl font-heading font-bold text-[#DA2439] mb-5">{category.category}</h2>
                            <div className="space-y-3">
                                {category.questions.map((faq, faqIndex) => {
                                    const index = `${catIndex}-${faqIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div key={faqIndex} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="text-slate-900 font-medium pr-4">{faq.q}</span>
                                                <span className={`text-[#DA2439] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 pt-4 bg-slate-50">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-md">
                    <div className="w-16 h-16 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">Still have questions?</h3>
                    <p className="text-slate-600 mb-6">Our support team is here to help you</p>
                    <Link
                        to="/contact"
                        className="inline-block px-8 py-4 bg-[#DA2439] text-white font-semibold rounded-full hover:bg-[#b91d30] transition-all shadow-lg hover:shadow-xl"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FAQPage;

import { useState } from 'react';

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
        <div className="min-h-screen py-12">
            <div className="container max-w-3xl">
                <h1 className="text-3xl font-heading text-white mb-2">Frequently Asked Questions</h1>
                <p className="text-gray-400 mb-8">Find answers to common questions about shopping with Raymond</p>

                <div className="space-y-8">
                    {faqs.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-xl font-heading text-amber-500 mb-4">{category.category}</h2>
                            <div className="space-y-2">
                                {category.questions.map((faq, faqIndex) => {
                                    const index = `${catIndex}-${faqIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div key={faqIndex} className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-900/50 transition-colors"
                                            >
                                                <span className="text-white font-medium pr-4">{faq.q}</span>
                                                <span className={`text-amber-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4 text-gray-400 border-t border-gray-800 pt-4">
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

                <div className="mt-12 text-center bg-[#12121a] border border-gray-800 rounded-xl p-8">
                    <h3 className="text-xl text-white mb-2">Still have questions?</h3>
                    <p className="text-gray-400 mb-4">Our support team is here to help</p>
                    <a href="/contact" className="inline-block px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
}

export default FAQPage;

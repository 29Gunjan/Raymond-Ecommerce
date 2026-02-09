import { Link } from 'react-router-dom';

function ReturnsPage() {
    const policies = [
        {
            title: '30-Day Return Policy',
            description: 'Return any unworn item within 30 days of delivery for a full refund.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            title: 'Free Returns',
            description: 'We offer free return shipping on all domestic orders.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            )
        },
        {
            title: 'Easy Exchange',
            description: 'Exchange for a different size or color at no extra cost.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            title: 'Quick Refunds',
            description: 'Refunds are processed within 5-7 business days.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
    ];

    const steps = [
        { step: 1, title: 'Initiate Return', description: 'Log into your account and select the item to return' },
        { step: 2, title: 'Pack the Item', description: 'Pack the item in its original packaging with tags attached' },
        { step: 3, title: 'Schedule Pickup', description: 'Schedule a free pickup or drop at nearest store' },
        { step: 4, title: 'Get Refund', description: 'Receive refund within 5-7 business days after inspection' },
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
                        <span className="text-slate-900 font-medium">Returns & Exchange</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Returns & Exchange</h1>
                    <p className="text-lg text-slate-600">Hassle-free returns and exchanges on all orders</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Policy Cards */}
                <div className="grid md:grid-cols-2 gap-5 mb-12">
                    {policies.map((policy, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4">{policy.icon}</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{policy.title}</h3>
                            <p className="text-slate-600 text-sm">{policy.description}</p>
                        </div>
                    ))}
                </div>

                {/* How It Works */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">How It Works</h2>
                <div className="bg-white border border-slate-200 rounded-xl p-8 mb-12 shadow-sm">
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div key={step.step} className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-[#DA2439] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg shadow-lg">
                                    {step.step}
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-slate-900 font-semibold text-lg">{step.title}</h3>
                                    <p className="text-slate-600 text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Non-Returnable Items */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Non-Returnable Items</h2>
                <div className="bg-white border border-slate-200 rounded-xl p-8 mb-12 shadow-sm">
                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#DA2439] rounded-full"></span>
                            Customized or personalized items
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#DA2439] rounded-full"></span>
                            Items marked as "Final Sale"
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#DA2439] rounded-full"></span>
                            Undergarments and innerwear
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#DA2439] rounded-full"></span>
                            Items damaged due to misuse
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#DA2439] rounded-full"></span>
                            Items without original tags and packaging
                        </li>
                    </ul>
                </div>

                <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-md">
                    <div className="w-16 h-16 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Have questions about returns?</h3>
                    <p className="text-slate-600 mb-6">Our support team is here to help</p>
                    <Link
                        to="/contact"
                        className="inline-block px-8 py-4 bg-[#DA2439] text-white font-semibold rounded-full hover:bg-[#b91d30] transition-all shadow-lg hover:shadow-xl"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReturnsPage;

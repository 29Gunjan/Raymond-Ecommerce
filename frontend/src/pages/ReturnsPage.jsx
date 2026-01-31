import { Link } from 'react-router-dom';

function ReturnsPage() {
    const policies = [
        {
            title: '30-Day Return Policy',
            description: 'Return any unworn item within 30 days of delivery for a full refund.',
            icon: '📦'
        },
        {
            title: 'Free Returns',
            description: 'We offer free return shipping on all domestic orders.',
            icon: '🚚'
        },
        {
            title: 'Easy Exchange',
            description: 'Exchange for a different size or color at no extra cost.',
            icon: '🔄'
        },
        {
            title: 'Quick Refunds',
            description: 'Refunds are processed within 5-7 business days.',
            icon: '💳'
        }
    ];

    const steps = [
        { step: 1, title: 'Initiate Return', description: 'Log into your account and select the item to return' },
        { step: 2, title: 'Pack the Item', description: 'Pack the item in its original packaging with tags attached' },
        { step: 3, title: 'Schedule Pickup', description: 'Schedule a free pickup or drop at nearest store' },
        { step: 4, title: 'Get Refund', description: 'Receive refund within 5-7 business days after inspection' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-4xl">
                <h1 className="text-3xl font-heading text-white mb-2">Returns & Exchange</h1>
                <p className="text-gray-400 mb-8">Hassle-free returns and exchanges on all orders</p>

                {/* Policy Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                    {policies.map((policy, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                            <span className="text-3xl mb-3 block">{policy.icon}</span>
                            <h3 className="text-lg font-medium text-white mb-2">{policy.title}</h3>
                            <p className="text-gray-400 text-sm">{policy.description}</p>
                        </div>
                    ))}
                </div>

                {/* How It Works */}
                <h2 className="text-2xl font-heading text-white mb-6">How It Works</h2>
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-12">
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div key={step.step} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {step.step}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Non-Returnable Items */}
                <h2 className="text-2xl font-heading text-white mb-4">Non-Returnable Items</h2>
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-8">
                    <ul className="space-y-2 text-gray-400">
                        <li>• Customized or personalized items</li>
                        <li>• Items marked as "Final Sale"</li>
                        <li>• Undergarments and innerwear</li>
                        <li>• Items damaged due to misuse</li>
                        <li>• Items without original tags and packaging</li>
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 mb-4">Have questions about returns?</p>
                    <Link to="/contact" className="inline-block px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReturnsPage;

function ShippingPage() {
    const shippingOptions = [
        {
            name: 'Standard Delivery',
            time: '5-7 Business Days',
            price: '₹199',
            freeAbove: '₹2,999',
            description: 'Regular delivery for all orders'
        },
        {
            name: 'Express Delivery',
            time: '2-3 Business Days',
            price: '₹399',
            freeAbove: '₹5,999',
            description: 'Faster delivery for urgent orders'
        },
        {
            name: 'Same Day Delivery',
            time: 'Within 24 Hours',
            price: '₹599',
            freeAbove: null,
            description: 'Available in select cities only'
        }
    ];

    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-4xl">
                <h1 className="text-3xl font-heading text-white mb-2">Shipping Information</h1>
                <p className="text-gray-400 mb-8">Everything you need to know about our delivery services</p>

                {/* Shipping Options */}
                <h2 className="text-2xl font-heading text-white mb-4">Delivery Options</h2>
                <div className="space-y-4 mb-12">
                    {shippingOptions.map((option, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{option.name}</h3>
                                    <p className="text-gray-400 text-sm">{option.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-500 font-bold">{option.price}</p>
                                    <p className="text-sm text-gray-400">{option.time}</p>
                                    {option.freeAbove && (
                                        <p className="text-sm text-green-400">Free above {option.freeAbove}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Same Day Delivery Cities */}
                <h2 className="text-2xl font-heading text-white mb-4">Same Day Delivery Cities</h2>
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-12">
                    <div className="flex flex-wrap gap-3">
                        {cities.map((city) => (
                            <span key={city} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Important Information */}
                <h2 className="text-2xl font-heading text-white mb-4">Important Information</h2>
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex gap-3">
                            <span className="text-amber-500">📍</span>
                            We deliver across India to all serviceable pin codes
                        </li>
                        <li className="flex gap-3">
                            <span className="text-amber-500">📦</span>
                            All orders are packed securely with premium packaging
                        </li>
                        <li className="flex gap-3">
                            <span className="text-amber-500">📧</span>
                            You'll receive tracking updates via email and SMS
                        </li>
                        <li className="flex gap-3">
                            <span className="text-amber-500">🚫</span>
                            We currently don't ship internationally
                        </li>
                        <li className="flex gap-3">
                            <span className="text-amber-500">⏰</span>
                            Orders placed before 2 PM are processed same day
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ShippingPage;

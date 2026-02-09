import { Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Shipping Info</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Shipping Information</h1>
                    <p className="text-lg text-slate-600">Everything you need to know about our delivery services</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Shipping Options */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Delivery Options</h2>
                <div className="space-y-4 mb-12">
                    {shippingOptions.map((option, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{option.name}</h3>
                                    <p className="text-slate-500 text-sm">{option.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#DA2439] font-bold text-xl">{option.price}</p>
                                    <p className="text-sm text-slate-500">{option.time}</p>
                                    {option.freeAbove && (
                                        <p className="text-sm text-emerald-600 font-medium">Free above {option.freeAbove}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Same Day Delivery Cities */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Same Day Delivery Cities</h2>
                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-12 shadow-sm">
                    <div className="flex flex-wrap gap-3">
                        {cities.map((city) => (
                            <span key={city} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Important Information */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Important Information</h2>
                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                    <ul className="space-y-4 text-slate-600">
                        <li className="flex gap-4 items-start">
                            <span className="w-8 h-8 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            <span>We deliver across India to all serviceable pin codes</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="w-8 h-8 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </span>
                            <span>All orders are packed securely with premium packaging</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="w-8 h-8 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <span>You'll receive tracking updates via email and SMS</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="w-8 h-8 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </span>
                            <span>We currently don't ship internationally</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="w-8 h-8 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span>Orders placed before 2 PM are processed same day</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ShippingPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';

function StoreLocatorPage() {
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const stores = [
        {
            name: 'Raymond - Linking Road',
            address: '45, Linking Road, Bandra West',
            city: 'Mumbai',
            phone: '+91 22 2640 1234',
            hours: '10:00 AM - 9:00 PM',
            features: ['Tailoring', 'Alteration', 'Made to Measure']
        },
        {
            name: 'Raymond - Phoenix Mall',
            address: 'Shop 215, Phoenix Marketcity',
            city: 'Mumbai',
            phone: '+91 22 4567 8901',
            hours: '11:00 AM - 10:00 PM',
            features: ['Tailoring', 'Express Delivery']
        },
        {
            name: 'Raymond - Connaught Place',
            address: 'N-12, Connaught Place',
            city: 'Delhi',
            phone: '+91 11 2341 5678',
            hours: '10:30 AM - 8:30 PM',
            features: ['Made to Measure', 'Tailoring']
        },
        {
            name: 'Raymond - Select Citywalk',
            address: 'A-3, Select Citywalk, Saket',
            city: 'Delhi',
            phone: '+91 11 4012 3456',
            hours: '11:00 AM - 9:30 PM',
            features: ['Tailoring', 'Alteration']
        },
        {
            name: 'Raymond - Brigade Road',
            address: '156, Brigade Road',
            city: 'Bangalore',
            phone: '+91 80 2558 7890',
            hours: '10:00 AM - 9:00 PM',
            features: ['Tailoring', 'Made to Measure']
        },
        {
            name: 'Raymond - Phoenix Mall',
            address: 'Shop 108, Phoenix Marketcity',
            city: 'Chennai',
            phone: '+91 44 4567 1234',
            hours: '11:00 AM - 10:00 PM',
            features: ['Tailoring']
        },
        {
            name: 'Raymond - Jubilee Hills',
            address: 'Road No. 36, Jubilee Hills',
            city: 'Hyderabad',
            phone: '+91 40 2355 6789',
            hours: '10:30 AM - 9:00 PM',
            features: ['Made to Measure', 'Tailoring']
        },
        {
            name: 'Raymond - FC Road',
            address: '89, Fergusson College Road',
            city: 'Pune',
            phone: '+91 20 2567 8901',
            hours: '10:00 AM - 9:00 PM',
            features: ['Tailoring', 'Alteration']
        }
    ];

    const cities = ['all', ...new Set(stores.map(s => s.city))];

    const filteredStores = stores.filter(store => {
        const matchesCity = selectedCity === 'all' || store.city === selectedCity;
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Store Locator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Store Locator</h1>
                    <p className="text-lg text-slate-600">Find a Raymond store near you</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex-1 min-w-[200px] relative">
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3.5 pl-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#DA2439] focus:ring-2 focus:ring-[#DA2439]/20 focus:outline-none transition-all shadow-sm"
                        />
                    </div>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-[#DA2439] focus:ring-2 focus:ring-[#DA2439]/20 focus:outline-none transition-all shadow-sm min-w-[150px]"
                    >
                        {cities.map(city => (
                            <option key={city} value={city}>
                                {city === 'all' ? 'All Cities' : city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Results */}
                <p className="text-slate-500 mb-6 font-medium">{filteredStores.length} stores found</p>

                <div className="grid md:grid-cols-2 gap-5">
                    {filteredStores.map((store, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#DA2439]/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">{store.name}</h3>
                                <span className="px-3 py-1 bg-red-100 text-[#DA2439] text-xs font-semibold rounded-full">{store.city}</span>
                            </div>
                            <p className="text-slate-600 text-sm mb-4">{store.address}</p>
                            <div className="space-y-2 text-sm mb-5">
                                <p className="flex items-center gap-3 text-slate-600">
                                    <svg className="w-4 h-4 text-[#DA2439]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {store.phone}
                                </p>
                                <p className="flex items-center gap-3 text-slate-600">
                                    <svg className="w-4 h-4 text-[#DA2439]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {store.hours}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {store.features.map((feature, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <button className="w-full py-3 border-2 border-[#DA2439] text-[#DA2439] rounded-xl hover:bg-[#DA2439] hover:text-white transition-all text-sm font-semibold">
                                Get Directions
                            </button>
                        </div>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
                        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-slate-500 text-lg">No stores found matching your criteria</p>
                        <p className="text-slate-400 mt-2">Try adjusting your search or selecting a different city</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StoreLocatorPage;

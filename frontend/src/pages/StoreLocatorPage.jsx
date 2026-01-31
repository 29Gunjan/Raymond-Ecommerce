import { useState } from 'react';

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
        <div className="min-h-screen py-12">
            <div className="container max-w-5xl">
                <h1 className="text-3xl font-heading text-white mb-2">Store Locator</h1>
                <p className="text-gray-400 mb-8">Find a Raymond store near you</p>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-3 bg-[#12121a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                    />
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="px-4 py-3 bg-[#12121a] border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                        {cities.map(city => (
                            <option key={city} value={city}>
                                {city === 'all' ? 'All Cities' : city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Results */}
                <p className="text-gray-400 mb-4">{filteredStores.length} stores found</p>

                <div className="grid md:grid-cols-2 gap-4">
                    {filteredStores.map((store, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-medium text-white">{store.name}</h3>
                                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded">{store.city}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{store.address}</p>
                            <div className="space-y-2 text-sm mb-4">
                                <p className="flex items-center gap-2 text-gray-400">
                                    <span>📞</span> {store.phone}
                                </p>
                                <p className="flex items-center gap-2 text-gray-400">
                                    <span>🕐</span> {store.hours}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {store.features.map((feature, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-2 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white transition-colors text-sm font-medium">
                                Get Directions
                            </button>
                        </div>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No stores found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StoreLocatorPage;

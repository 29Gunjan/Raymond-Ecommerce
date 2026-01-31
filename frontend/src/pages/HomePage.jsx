import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, newRes, catRes] = await Promise.all([
                    productsAPI.getAll({ featured: true, limit: 4 }),
                    productsAPI.getAll({ isNew: true, limit: 4 }),
                    categoriesAPI.getAll()
                ]);
                setFeaturedProducts(featuredRes.data?.products || []);
                setNewArrivals(newRes.data?.products || []);
                setCategories(catRes.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { value: '50,000+', label: 'Happy Customers' },
        { value: '150+', label: 'Premium Products' },
        { value: '25+', label: 'Years of Excellence' },
        { value: '100%', label: 'Authentic Fabrics' },
    ];

    const testimonials = [
        {
            name: 'Rahul Sharma',
            role: 'Business Executive',
            content: 'The quality of Raymond suits is unmatched. I have been a loyal customer for over 10 years.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
            name: 'Priya Patel',
            role: 'Fashion Designer',
            content: 'Raymond fabrics inspire my designs. The texture and finish are simply premium.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
            name: 'Amit Kumar',
            role: 'Entrepreneur',
            content: 'For important meetings, Raymond is my go-to brand. It speaks professionalism.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
    ];

    const brandValues = [
        {
            title: 'Premium Quality',
            desc: 'Finest fabrics and craftsmanship',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            title: 'Free Shipping',
            desc: 'On orders above ₹2,999',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        },
        {
            title: 'Easy Returns',
            desc: '30-day hassle-free returns',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            title: 'Secure Payment',
            desc: '100% secure transactions',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
    ];

    return (
        <div className="bg-gray-900">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

                {/* Content */}
                <div className="container relative z-10 text-center text-white py-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/10">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-sm text-gray-300">Premium Menswear Since 1925</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-white mb-4">
                        The Complete
                    </h1>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-amber-500 mb-6">
                        Man
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Experience the finest in menswear with our curated collection of
                        <span className="text-amber-400"> premium suits</span>,
                        <span className="text-amber-400"> shirts</span>, and
                        <span className="text-amber-400"> accessories</span>.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-amber-500/25"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            to="/products?category=suits-blazers"
                            className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                        >
                            View Suits
                        </Link>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-800 border-y border-gray-700">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <p className="text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-900">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-heading text-white mb-4">
                            Shop by <span className="text-amber-500">Category</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Explore our curated collections designed for the modern gentleman
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products/${category.slug}`}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white text-lg font-semibold mb-1 group-hover:text-amber-400 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/70 text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Shop Now
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-gray-800">
                <div className="container">
                    <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading text-white mb-2">
                                Featured <span className="text-amber-500">Collection</span>
                            </h2>
                            <p className="text-gray-400">Handpicked excellence for the discerning gentleman</p>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="text-amber-500 font-medium flex items-center gap-2 hover:gap-3 transition-all group"
                        >
                            View All
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="relative py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-gray-700">
                <div className="container relative z-10 text-center text-white">
                    <span className="text-amber-500 font-medium uppercase tracking-wider mb-4 block text-sm">
                        Limited Time Offer
                    </span>
                    <h2 className="text-4xl md:text-6xl font-heading text-white mb-6">
                        Get <span className="text-amber-500">20% Off</span> Your First Order
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                        Sign up for our newsletter and receive an exclusive discount on your first purchase.
                        Plus, get early access to new collections and special promotions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-20 bg-gray-900">
                <div className="container">
                    <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading text-white mb-2">
                                New <span className="text-amber-500">Arrivals</span>
                            </h2>
                            <p className="text-gray-400">Fresh styles just landed in our stores</p>
                        </div>
                        <Link
                            to="/products?isNew=true"
                            className="text-amber-500 font-medium flex items-center gap-2 hover:gap-3 transition-all group"
                        >
                            View All
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {newArrivals.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-800">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-heading text-white mb-4">
                            What Our <span className="text-amber-500">Customers</span> Say
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Trusted by thousands of gentlemen across India
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Values Section */}
            <section className="py-20 bg-gray-900 border-t border-gray-700">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-heading text-white mb-4">
                            The Raymond <span className="text-amber-500">Promise</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {brandValues.map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;

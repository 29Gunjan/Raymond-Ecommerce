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
        {
            value: '50,000+', label: 'Happy Customers', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            value: '150+', label: 'Premium Products', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        },
        {
            value: '25+', label: 'Years of Excellence', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            value: '100%', label: 'Authentic Fabrics', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
    ];

    const testimonials = [
        {
            name: 'Rahul Sharma',
            role: 'Business Executive',
            content: 'The quality of Raymond suits is unmatched. I have been a loyal customer for over 10 years. The craftsmanship is truly superior.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
            name: 'Priya Patel',
            role: 'Fashion Designer',
            content: 'Raymond fabrics inspire my designs. The texture and finish are simply premium. Best quality in the Indian market.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
            name: 'Amit Kumar',
            role: 'Entrepreneur',
            content: 'For important meetings, Raymond is my go-to brand. It speaks professionalism and sophistication.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
    ];

    const brandValues = [
        {
            title: 'Premium Quality',
            desc: 'Finest fabrics and craftsmanship from the best mills',
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            title: 'Free Shipping',
            desc: 'Complimentary delivery on orders above ₹2,999',
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        },
        {
            title: 'Easy Returns',
            desc: '30-day hassle-free return policy',
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            title: 'Secure Payment',
            desc: '100% secure and encrypted transactions',
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section - Premium White */}
            <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-red-50/30 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-red-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl" />

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-6">
                                <span className="w-2 h-2 bg-[#DA2439] rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-[#DA2439]">Premium Menswear Since 1925</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-slate-900 mb-4 leading-tight">
                                The Complete
                            </h1>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-[#DA2439] to-[#e8475a] bg-clip-text text-transparent">Man</span>
                            </h1>

                            <p className="text-xl text-slate-600 max-w-lg mb-10 leading-relaxed">
                                Experience the finest in menswear with our curated collection of
                                <span className="text-[#DA2439] font-medium"> premium suits</span>,
                                <span className="text-[#DA2439] font-medium"> shirts</span>, and
                                <span className="text-[#DA2439] font-medium"> accessories</span>.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="px-8 py-4 bg-[#DA2439] text-white font-semibold rounded-xl hover:bg-[#b91d30] transition-all duration-300 shadow-xl shadow-red-200 hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    Shop Collection
                                </Link>
                                <Link
                                    to="/products/suits-blazers"
                                    className="px-8 py-4 border-2 border-slate-300 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                                >
                                    Explore Suits
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image Grid */}
                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                                            alt="Raymond Suit"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-6 shadow-lg">
                                        <div className="text-[#DA2439]">
                                            <p className="text-4xl font-bold mb-1">25+</p>
                                            <p className="text-sm font-medium">Years of Excellence</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="aspect-square rounded-2xl bg-slate-900 p-6 shadow-2xl text-white">
                                        <p className="text-3xl font-bold mb-2">50K+</p>
                                        <p className="text-sm text-slate-300">Happy Customers</p>
                                    </div>
                                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop"
                                            alt="Raymond Shirt"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Clean White */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-3xl mb-3">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-heading">
                                    {stat.value}
                                </div>
                                <p className="text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-heading text-slate-900 mb-4">
                            Shop by <span className="text-[#DA2439]">Category</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Explore our curated collections designed for the modern gentleman
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products/${category.slug}`}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white text-lg font-semibold mb-1 group-hover:text-[#DA2439] transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/80 text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading text-slate-900 mb-3">
                                Featured <span className="text-[#DA2439]">Collection</span>
                            </h2>
                            <p className="text-slate-600 text-lg">Handpicked excellence for the discerning gentleman</p>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="text-[#DA2439] font-semibold flex items-center gap-2 hover:gap-3 transition-all group text-lg"
                        >
                            View All
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#DA2439] rounded-full animate-spin" />
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
            <section className="relative py-24 bg-slate-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-[#DA2439] font-semibold uppercase tracking-wider mb-4 block text-sm">
                        Limited Time Offer
                    </span>
                    <h2 className="text-4xl md:text-6xl font-heading text-white mb-6">
                        Get <span className="text-[#DA2439]">20% Off</span> Your First Order
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
                        Sign up for our newsletter and receive an exclusive discount on your first purchase.
                        Plus, get early access to new collections and special promotions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                        />
                        <button className="px-8 py-4 bg-gradient-to-r from-[#DA2439] to-[#e8475a] text-white font-semibold rounded-xl hover:from-[#b91d30] hover:to-[#DA2439] transition-all duration-300 whitespace-nowrap shadow-lg shadow-red-500/25">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading text-slate-900 mb-3">
                                New <span className="text-[#DA2439]">Arrivals</span>
                            </h2>
                            <p className="text-slate-600 text-lg">Fresh styles just landed in our stores</p>
                        </div>
                        <Link
                            to="/products?isNew=true"
                            className="text-[#DA2439] font-semibold flex items-center gap-2 hover:gap-3 transition-all group text-lg"
                        >
                            View All
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#DA2439] rounded-full animate-spin" />
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-heading text-slate-900 mb-4">
                            What Our <span className="text-[#DA2439]">Customers</span> Say
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Trusted by thousands of gentlemen across India
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Values Section */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-heading text-slate-900 mb-4">
                            The Raymond <span className="text-[#DA2439]">Promise</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {brandValues.map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#DA2439] group-hover:bg-red-50 group-hover:border-red-200 transition-all duration-300 shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;

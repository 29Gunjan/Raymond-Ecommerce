import { Link } from 'react-router-dom';

function StyleBlogPage() {
    const featuredPost = {
        title: 'The Art of Suit Layering: A Complete Guide',
        excerpt: 'Master the art of layering suits for any occasion, from business meetings to formal events.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        date: 'Jan 30, 2026',
        category: 'Style Guide',
        readTime: '8 min read'
    };

    const posts = [
        {
            title: '5 Essential Shirts Every Man Should Own',
            excerpt: 'Build a versatile wardrobe with these must-have shirt styles.',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
            date: 'Jan 28, 2026',
            category: 'Wardrobe Essentials',
            readTime: '5 min read'
        },
        {
            title: 'How to Choose the Perfect Wedding Attire',
            excerpt: 'A comprehensive guide to dressing for Indian weddings.',
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
            date: 'Jan 25, 2026',
            category: 'Occasions',
            readTime: '6 min read'
        },
        {
            title: 'Fabric Guide: Understanding Wool Types',
            excerpt: 'Know your merino from your cashmere with this detailed guide.',
            image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
            date: 'Jan 22, 2026',
            category: 'Fabric Education',
            readTime: '7 min read'
        },
        {
            title: 'Office Style: Smart Casual Decoded',
            excerpt: 'Navigate the smart casual dress code with confidence.',
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
            date: 'Jan 20, 2026',
            category: 'Work Style',
            readTime: '4 min read'
        },
        {
            title: 'Summer Suits: Stay Cool in Style',
            excerpt: 'Lightweight suits that keep you comfortable in Indian summers.',
            image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
            date: 'Jan 18, 2026',
            category: 'Seasonal',
            readTime: '5 min read'
        },
        {
            title: 'Accessorizing Your Suit: The Ultimate Guide',
            excerpt: 'From ties to pocket squares, master the art of suit accessories.',
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
            date: 'Jan 15, 2026',
            category: 'Accessories',
            readTime: '6 min read'
        }
    ];

    const categories = ['All', 'Style Guide', 'Wardrobe Essentials', 'Occasions', 'Fabric Education', 'Work Style', 'Seasonal'];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Style Blog</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Style Blog</h1>
                        <p className="text-lg text-slate-600">Expert tips, trends, and guides for the modern gentleman</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Categories */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${index === 0
                                    ? 'bg-[#DA2439] text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#DA2439] hover:text-[#DA2439]'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-12 shadow-md hover:shadow-xl transition-shadow">
                    <div className="grid md:grid-cols-2">
                        <div className="aspect-video md:aspect-auto">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Featured+Article'}
                            />
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                            <span className="text-[#DA2439] text-sm font-semibold mb-3">{featuredPost.category}</span>
                            <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-4">{featuredPost.title}</h2>
                            <p className="text-slate-600 mb-5">{featuredPost.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                <span>{featuredPost.date}</span>
                                <span>•</span>
                                <span>{featuredPost.readTime}</span>
                            </div>
                            <button className="self-start px-8 py-4 bg-[#DA2439] text-white font-semibold rounded-full hover:bg-[#b91d30] transition-all shadow-lg hover:shadow-xl">
                                Read Article
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <article key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#DA2439]/30 transition-all group cursor-pointer">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x225?text=Article'}
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-[#DA2439] text-xs font-semibold">{post.category}</span>
                                <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-3 group-hover:text-[#DA2439] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                    <button className="px-8 py-4 border-2 border-slate-300 text-slate-600 rounded-full hover:border-[#DA2439] hover:text-[#DA2439] transition-all font-semibold">
                        Load More Articles
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StyleBlogPage;

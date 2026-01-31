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
        <div className="min-h-screen py-12">
            <div className="container max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading text-white mb-2">Style Blog</h1>
                    <p className="text-gray-400">Expert tips, trends, and guides for the modern gentleman</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 bg-[#12121a] border border-gray-700 text-gray-400 rounded-full hover:border-amber-500 hover:text-amber-500 transition-colors text-sm"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                <div className="bg-[#12121a] border border-gray-800 rounded-2xl overflow-hidden mb-12">
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
                            <span className="text-amber-500 text-sm font-medium mb-2">{featuredPost.category}</span>
                            <h2 className="text-2xl font-heading text-white mb-3">{featuredPost.title}</h2>
                            <p className="text-gray-400 mb-4">{featuredPost.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <span>{featuredPost.date}</span>
                                <span>•</span>
                                <span>{featuredPost.readTime}</span>
                            </div>
                            <button className="self-start px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
                                Read Article
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <h2 className="text-2xl font-heading text-white mb-6">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <article key={index} className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors group cursor-pointer">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x225?text=Article'}
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-amber-500 text-xs font-medium">{post.category}</span>
                                <h3 className="text-lg font-medium text-white mt-1 mb-2 group-hover:text-amber-500 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
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
                    <button className="px-8 py-3 border border-gray-700 text-gray-400 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors">
                        Load More Articles
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StyleBlogPage;

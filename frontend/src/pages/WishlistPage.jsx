import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';

function WishlistPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await wishlistAPI.get();
            setItems(res.data?.products || []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            setItems(items.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">My Wishlist</h1>
                    <p className="text-gray-400 mt-1">{items.length} items saved</p>
                </div>
            </div>

            <div className="container py-8">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="empty-state-title">Your wishlist is empty</h2>
                        <p className="empty-state-text">Save items you love to your wishlist and find them later.</p>
                        <Link to="/products" className="btn btn-primary">Explore Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {items.map(product => (
                            <div key={product.id} className="group bg-[#12121a] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                                <Link to={`/products/${product.slug}`} className="block">
                                    <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/products/${product.slug}`}>
                                        <h3 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-amber-500">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.comparePrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.comparePrice)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        className="w-full py-2 text-sm text-red-400 border border-red-500/30 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors"
                                    >
                                        Remove from Wishlist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WishlistPage;

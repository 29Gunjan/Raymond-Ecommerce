import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
    const [showQuickView, setShowQuickView] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const discount = product.comparePrice
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    const handleAddToCart = async () => {
        if (!selectedVariant && product.variants?.length > 0) {
            alert('Please select a size');
            return;
        }

        try {
            await addToCart(product.id, quantity, selectedVariant?.id);
            setShowQuickView(false);
            setQuantity(1);
            setSelectedVariant(null);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    return (
        <>
            <Link
                to={`/products/${product.slug}`}
                className="group block bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                    {/* Loading placeholder */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-800" />
                    )}

                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'
                            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                            setImageLoaded(true);
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`} />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.isNew && (
                            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                                NEW
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className={`absolute top-3 right-3 z-10 w-9 h-9 bg-gray-800/80 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                            } hover:bg-red-500 hover:text-white text-gray-300`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to wishlist logic
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Quick View Button */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                        <button
                            onClick={handleQuickView}
                            className="w-full py-3 bg-white text-gray-900 font-semibold text-sm rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Quick View
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">
                        {product.category?.name}
                    </p>
                    <h3 className="font-medium text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300 text-lg">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                    </div>

                    {/* Rating Stars */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-600'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Quick View Modal */}
            {showQuickView && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setShowQuickView(false)}
                >
                    <div
                        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowQuickView(false)}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid md:grid-cols-2">
                            {/* Image */}
                            <div className="aspect-square bg-gray-900 relative overflow-hidden">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                                    }}
                                />
                                {discount > 0 && (
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                                        {discount}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-8 md:p-10 overflow-y-auto max-h-[600px]">
                                <p className="text-sm text-amber-500 font-semibold uppercase tracking-wider mb-2">
                                    {product.category?.name}
                                </p>
                                <h2 className="text-3xl font-bold text-white mb-4 font-heading">
                                    {product.name}
                                </h2>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.comparePrice && (
                                        <span className="text-xl text-gray-500 line-through">
                                            {formatPrice(product.comparePrice)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-gray-400 mb-8 line-clamp-3">
                                        {product.description}
                                    </p>
                                )}

                                {/* Size Selection */}
                                {product.variants?.length > 0 && (
                                    <div className="mb-8">
                                        <label className="block text-sm font-semibold text-white mb-3">
                                            Select Size
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.variants.map(variant => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    disabled={variant.stock === 0}
                                                    className={`px-5 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedVariant?.id === variant.id
                                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                        : variant.stock === 0
                                                            ? 'border-gray-700 text-gray-600 cursor-not-allowed bg-gray-800'
                                                            : 'border-gray-600 text-gray-300 hover:border-amber-500/50'
                                                        }`}
                                                >
                                                    {variant.size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-white mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-1 bg-gray-700 rounded-xl p-1 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-all text-lg font-medium text-white"
                                        >
                                            −
                                        </button>
                                        <span className="w-16 text-center font-semibold text-lg text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-all text-lg font-medium text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Add to Cart
                                    </button>
                                    <Link
                                        to={`/products/${product.slug}`}
                                        onClick={() => setShowQuickView(false)}
                                        className="px-6 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-500 hover:bg-gray-700 transition-all duration-300"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductCard;

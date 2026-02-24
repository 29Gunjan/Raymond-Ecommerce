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
            await addToCart(product.id, selectedVariant?.id, quantity);
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
                className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                    {/* Loading placeholder */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse" />
                    )}

                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                            setImageLoaded(true);
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`} />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.isNew && (
                            <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg">
                                NEW
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className={`absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                            } hover:bg-red-50 hover:text-red-500 text-slate-600`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to wishlist logic
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Quick View Button */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                        <button
                            onClick={handleQuickView}
                            className="w-full py-3.5 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
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
                    <p className="text-xs text-[#DA2439] font-semibold uppercase tracking-wider mb-2">
                        {product.category?.name}
                    </p>
                    <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-[#DA2439] transition-colors duration-300 text-lg leading-snug">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-slate-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                            <span className="text-sm text-slate-400 line-through">
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
                                        className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-500' : 'text-slate-200'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-slate-500">({product.reviewCount || 0})</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Quick View Modal */}
            {showQuickView && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setShowQuickView(false)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowQuickView(false)}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid md:grid-cols-2">
                            {/* Image */}
                            <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                                    }}
                                />
                                {discount > 0 && (
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full shadow-lg">
                                        {discount}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-8 md:p-10 overflow-y-auto max-h-[600px]">
                                <p className="text-sm text-[#DA2439] font-semibold uppercase tracking-wider mb-2">
                                    {product.category?.name}
                                </p>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
                                    {product.name}
                                </h2>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-slate-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.comparePrice && (
                                        <span className="text-xl text-slate-400 line-through">
                                            {formatPrice(product.comparePrice)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}

                                {/* Size Selection */}
                                {product.variants?.length > 0 && (
                                    <div className="mb-8">
                                        <label className="block text-sm font-semibold text-slate-900 mb-3">
                                            Select Size
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.variants.map(variant => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    disabled={variant.stock === 0}
                                                    className={`px-5 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedVariant?.id === variant.id
                                                        ? 'border-[#DA2439] bg-red-50 text-[#DA2439]'
                                                        : variant.stock === 0
                                                            ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                                                            : 'border-slate-200 text-slate-700 hover:border-[#DA2439]'
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
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-slate-50 transition-all text-lg font-medium text-slate-700 shadow-sm"
                                        >
                                            −
                                        </button>
                                        <span className="w-16 text-center font-semibold text-lg text-slate-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-slate-50 transition-all text-lg font-medium text-slate-700 shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Add to Cart
                                    </button>
                                    <Link
                                        to={`/products/${product.slug}`}
                                        onClick={() => setShowQuickView(false)}
                                        className="px-6 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
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

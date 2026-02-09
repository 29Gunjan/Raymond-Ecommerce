import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI, wishlistAPI, reviewsAPI } from '../services/api';
import ImageZoom from '../components/ImageZoom';
import { ProductDetailSkeleton } from '../components/Skeleton';

function ProductDetailPage() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const toast = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productsAPI.getBySlug(slug);
                setProduct(res.data);

                // Set default selections
                if (res.data.variants?.length > 0) {
                    const sizes = [...new Set(res.data.variants.map(v => v.size))];
                    const colors = [...new Set(res.data.variants.map(v => v.color))];
                    setSelectedSize(sizes[0] || '');
                    setSelectedColor(colors[0] || '');
                }

                // Fetch reviews - backend returns { reviews, stats }
                try {
                    const reviewsRes = await reviewsAPI.getByProduct(res.data.id);
                    setReviews(reviewsRes.data?.reviews || []);
                } catch (reviewError) {
                    console.error('Failed to fetch reviews:', reviewError);
                    setReviews([]);
                }

                // Check wishlist
                if (isAuthenticated) {
                    try {
                        const wishlistRes = await wishlistAPI.check(res.data.id);
                        setInWishlist(wishlistRes.data?.inWishlist || false);
                    } catch (wishlistError) {
                        console.error('Failed to check wishlist:', wishlistError);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug, isAuthenticated]);

    const sizes = product ? [...new Set(product.variants?.map(v => v.size))] : [];
    const colors = product ? [...new Set(product.variants?.map(v => v.color))] : [];
    const selectedVariant = product?.variants?.find(v => v.size === selectedSize && v.color === selectedColor);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        setAddingToCart(true);
        try {
            await addToCart(product.id, selectedVariant.id, quantity);
            toast.success('Added to cart successfully!');
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleWishlist = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            return;
        }

        try {
            if (inWishlist) {
                await wishlistAPI.remove(product.id);
                toast.success('Removed from wishlist');
            } else {
                await wishlistAPI.add(product.id);
                toast.success('Added to wishlist');
            }
            setInWishlist(!inWishlist);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="container mx-auto px-4">
                    <ProductDetailSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
                    <Link to="/products" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">Browse Products</Link>
                </div>
            </div>
        );
    }

    const discount = product.comparePrice
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 py-10 pb-24 lg:pb-10">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8" data-aos="fade-up">
                    <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <Link to="/products" className="text-slate-500 hover:text-[#DA2439] transition-colors">Products</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images */}
                    <div className="space-y-4" data-aos="fade-right">
                        <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
                            <ImageZoom
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x800?text=No+Image'}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full"
                            />
                            {discount > 0 && (
                                <span className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full shadow-lg z-10">
                                    -{discount}% OFF
                                </span>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#DA2439] shadow-lg' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100x120?text=Image';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="lg:sticky lg:top-28 lg:self-start bg-white rounded-2xl p-8 border border-slate-100 shadow-sm" data-aos="fade-left">
                        <p className="text-[#DA2439] font-semibold uppercase tracking-wide mb-2 text-sm">
                            {product.category?.name}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-slate-900">
                                {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && (
                                <>
                                    <span className="text-xl text-slate-400 line-through">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        Save {formatPrice(product.comparePrice - product.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="font-semibold text-slate-900">Size</label>
                                    <Link to="/size-guide" className="text-sm text-[#DA2439] hover:text-[#b91d30] font-medium">Size Guide</Link>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[48px] px-5 py-3 border-2 rounded-xl font-semibold transition-all ${selectedSize === size
                                                ? 'border-slate-900 bg-slate-900 text-white'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="mb-6">
                                <label className="block font-semibold text-slate-900 mb-3">Color: <span className="text-[#DA2439]">{selectedColor}</span></label>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-5 py-3 border-2 rounded-xl text-sm font-medium transition-all ${selectedColor === color
                                                ? 'border-[#DA2439] bg-red-50 text-[#DA2439]'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Info */}
                        {selectedVariant && (
                            <p className={`text-sm mb-6 flex items-center gap-2 ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {selectedVariant.stock > 0 ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        In Stock ({selectedVariant.stock} available)
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Out of Stock
                                    </>
                                )}
                            </p>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="block font-semibold text-slate-900 mb-3">Quantity</label>
                            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm font-medium text-lg"
                                >
                                    −
                                </button>
                                <span className="w-14 text-center font-semibold text-lg text-slate-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                                    className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm font-medium text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                                className="flex-1 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                            >
                                {addingToCart ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-red-400'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex justify-around text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Easy Returns
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-[#DA2439]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Authentic
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-16" data-aos="fade-up">
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 text-slate-300">
                                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-slate-500 text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-500' : 'text-slate-200'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-4 leading-relaxed">"{review.comment}"</p>
                                    <p className="text-sm text-slate-500 font-medium">— {review.user?.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                        {product.comparePrice && (
                            <p className="text-sm text-slate-400 line-through">{formatPrice(product.comparePrice)}</p>
                        )}
                    </div>
                    <button
                        onClick={toggleWishlist}
                        className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-slate-200 text-slate-400'}`}
                    >
                        <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                        className="flex-1 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {addingToCart ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;

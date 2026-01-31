import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI, wishlistAPI, reviewsAPI } from '../services/api';

function ProductDetailPage() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

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
            alert('Added to cart!');
        } catch (error) {
            alert('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleWishlist = async () => {
        if (!isAuthenticated) {
            alert('Please login to add to wishlist');
            return;
        }

        try {
            if (inWishlist) {
                await wishlistAPI.remove(product.id);
            } else {
                await wishlistAPI.add(product.id);
            }
            setInWishlist(!inWishlist);
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="empty-state">
                <h2 className="empty-state-title">Product not found</h2>
                <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </div>
        );
    }

    const discount = product.comparePrice
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">Home</Link>
                    <span className="text-gray-600">/</span>
                    <Link to="/products" className="text-gray-400 hover:text-amber-500 transition-colors">Products</Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-white">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x800?text=No+Image'}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
                                }}
                            />
                            {discount > 0 && (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded">
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
                                        className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-amber-500' : 'border-gray-700 hover:border-gray-600'}`}
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
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <p className="text-amber-500 font-medium uppercase tracking-wide mb-2">
                            {product.category?.name}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-heading text-white mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-amber-500">
                                {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded border border-green-500/30">
                                        Save {formatPrice(product.comparePrice - product.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <label className="block font-medium text-white mb-3">Size</label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[48px] px-4 py-2 border-2 rounded-lg font-medium transition-colors ${selectedSize === size
                                                ? 'border-amber-500 bg-amber-500 text-white'
                                                : 'border-gray-700 text-gray-300 hover:border-amber-500'
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
                                <label className="block font-medium text-white mb-3">Color: <span className="text-amber-500">{selectedColor}</span></label>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border-2 rounded-lg text-sm transition-colors ${selectedColor === color
                                                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                : 'border-gray-700 text-gray-300 hover:border-gray-600'
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
                            <p className={`text-sm mb-6 ${selectedVariant.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {selectedVariant.stock > 0
                                    ? `In Stock (${selectedVariant.stock} available)`
                                    : 'Out of Stock'}
                            </p>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <label className="block font-medium text-white mb-3">Quantity</label>
                            <div className="flex items-center gap-2 w-fit border border-gray-700 rounded-lg bg-gray-900">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-l-lg transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-r-lg transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                                className="flex-1 btn btn-primary btn-lg disabled:opacity-50"
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center transition-colors ${inWishlist ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-16">
                    <h2 className="text-2xl font-heading text-white mb-8">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 bg-[#12121a] border border-gray-800 rounded-xl p-8 text-center">
                            No reviews yet. Be the first to review this product!
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-[#12121a] p-6 rounded-xl border border-gray-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= review.rating ? 'text-amber-500' : 'text-gray-700'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-2">{review.comment}</p>
                                    <p className="text-sm text-gray-500">- {review.user?.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ProductDetailPage;

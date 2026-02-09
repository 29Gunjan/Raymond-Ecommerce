import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItemSkeleton } from '../components/Skeleton';

function CartPage() {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();
    const toast = useToast();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleRemove = async (itemId) => {
        await removeFromCart(itemId);
        toast.success('Item removed from cart');
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const shipping = subtotal > 2999 ? 0 : 199;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="container mx-auto px-4">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {[...Array(3)].map((_, i) => <CartItemSkeleton key={i} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 mx-auto mb-6 text-slate-300">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-3">Your cart is empty</h2>
                    <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-heading font-bold text-slate-900" data-aos="fade-up">Shopping Cart</h1>
                    <p className="text-slate-500 mt-2" data-aos="fade-up" data-aos-delay="100">{cart.items.length} items in your cart</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, index) => (
                            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay={index * 50}>
                                <div className="flex gap-5">
                                    {/* Image */}
                                    <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                                        <div className="w-28 h-36 md:w-32 md:h-40 bg-slate-100 rounded-xl overflow-hidden">
                                            <img
                                                src={item.product.images?.[0] || 'https://via.placeholder.com/128x160?text=No+Image'}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover object-center"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/128x160?text=No+Image';
                                                }}
                                            />
                                        </div>
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item.product.slug}`}>
                                            <h3 className="font-semibold text-slate-900 hover:text-[#DA2439] transition-colors line-clamp-2 text-lg">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {item.variant?.size && `Size: ${item.variant.size}`}
                                            {item.variant?.size && item.variant?.color && ' | '}
                                            {item.variant?.color && `Color: ${item.variant.color}`}
                                        </p>
                                        <p className="text-xl font-bold text-slate-900 mt-3">
                                            {formatPrice(item.product.price)}
                                        </p>

                                        {/* Quantity & Remove */}
                                        <div className="flex items-center justify-between mt-5">
                                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center font-semibold text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total - Desktop */}
                                    <div className="hidden md:block text-right">
                                        <p className="text-xl font-bold text-slate-900">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md sticky top-28">
                            <h2 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Shipping</span>
                                    <span className="font-semibold text-slate-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(shipping)
                                        )}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                                        💡 Add {formatPrice(2999 - subtotal)} more for free shipping
                                    </p>
                                )}
                                <hr className="border-slate-100" />
                                <div className="flex justify-between text-base pt-2">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-2xl text-slate-900">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="block w-full py-4 text-center bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors mt-6 shadow-lg">
                                Proceed to Checkout
                            </Link>

                            <Link to="/products" className="block w-full py-4 text-center border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all mt-3">
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-center gap-4 text-slate-400 text-xs">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;

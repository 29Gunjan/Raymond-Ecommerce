import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const shipping = subtotal > 2999 ? 0 : 199;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!cart?.items?.length) {
        return (
            <div className="container py-16">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="empty-state-title">Your cart is empty</h2>
                    <p className="empty-state-text">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">Shopping Cart</h1>
                    <p className="text-gray-400 mt-1">{cart.items.length} items</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-[#12121a] rounded-xl p-4 border border-gray-800">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                                        <div className="w-24 h-32 md:w-32 md:h-40 bg-gray-900 rounded-lg overflow-hidden">
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
                                            <h3 className="font-medium text-white hover:text-amber-500 transition-colors line-clamp-2">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.variant?.size && `Size: ${item.variant.size}`}
                                            {item.variant?.size && item.variant?.color && ' | '}
                                            {item.variant?.color && `Color: ${item.variant.color}`}
                                        </p>
                                        <p className="text-lg font-bold text-amber-500 mt-2">
                                            {formatPrice(item.product.price)}
                                        </p>

                                        {/* Quantity & Remove */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center bg-gray-800 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-lg transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-medium text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 text-sm hover:text-red-300 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total - Desktop */}
                                    <div className="hidden md:block text-right">
                                        <p className="text-lg font-bold text-white">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="font-medium text-white">
                                        {shipping === 0 ? (
                                            <span className="text-green-400">FREE</span>
                                        ) : (
                                            formatPrice(shipping)
                                        )}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-gray-500">
                                        Add {formatPrice(2999 - subtotal)} more for free shipping
                                    </p>
                                )}
                                <hr className="border-gray-800" />
                                <div className="flex justify-between text-base">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="font-bold text-xl text-amber-500">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn btn-primary btn-full btn-lg mt-6">
                                Proceed to Checkout
                            </Link>

                            <Link to="/products" className="btn btn-secondary btn-full mt-3">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;

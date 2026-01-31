import { useState } from 'react';
import { Link } from 'react-router-dom';

function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        if (!dateString) return 'Pending';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'text-yellow-500',
            'CONFIRMED': 'text-blue-500',
            'PROCESSING': 'text-blue-500',
            'SHIPPED': 'text-purple-500',
            'DELIVERED': 'text-green-500',
            'CANCELLED': 'text-red-500'
        };
        return colors[status] || 'text-gray-500';
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrderStatus(null);

        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber.trim(),
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to track order');
            }

            setOrderStatus(data);
        } catch (err) {
            setError(err.message || 'Failed to track order. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-2xl">
                <h1 className="text-3xl font-heading text-white mb-2">Track Your Order</h1>
                <p className="text-gray-400 mb-8">Enter your order details to track shipment status</p>

                <form onSubmit={handleTrack} className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Order Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                placeholder="e.g., RMD-XXXXXX-XXXX"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </div>
                </form>

                {orderStatus && (
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Order #{orderStatus.orderNumber}</h3>
                                    <p className="text-sm text-gray-400">Placed on {formatDate(orderStatus.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${getStatusColor(orderStatus.status)}`}>
                                        {orderStatus.status}
                                    </span>
                                    <p className="text-sm text-gray-400">{formatPrice(orderStatus.total)}</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                {orderStatus.timeline.map((step, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${step.isCancelled
                                                ? 'bg-red-500'
                                                : step.completed
                                                    ? 'bg-amber-500'
                                                    : 'bg-gray-700'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${step.isCancelled
                                                    ? 'text-red-400'
                                                    : step.completed
                                                        ? 'text-white'
                                                        : 'text-gray-500'
                                                }`}>
                                                {step.status}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {step.date ? formatDate(step.date) : 'Pending'}
                                            </p>
                                        </div>
                                        {step.completed && !step.isCancelled && (
                                            <span className="text-green-400 text-sm">✓</span>
                                        )}
                                        {step.isCancelled && (
                                            <span className="text-red-400 text-sm">✕</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        {orderStatus.items && orderStatus.items.length > 0 && (
                            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-medium text-white mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {orderStatus.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                                                alt={item.product?.name}
                                                className="w-16 h-20 object-cover rounded-lg bg-gray-800"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.product?.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {item.variant?.size} / {item.variant?.color} × {item.quantity}
                                                </p>
                                                <p className="text-amber-500 font-medium">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Address */}
                        {orderStatus.address && (
                            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-medium text-white mb-3">Delivery Address</h3>
                                <p className="text-gray-400">
                                    {orderStatus.address.name}<br />
                                    {orderStatus.address.street}<br />
                                    {orderStatus.address.city}, {orderStatus.address.state} - {orderStatus.address.pincode}<br />
                                    Phone: {orderStatus.address.phone}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-gray-400">Need help? <Link to="/contact" className="text-amber-500 hover:text-amber-400">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
}

export default TrackOrderPage;

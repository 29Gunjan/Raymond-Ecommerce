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
            'PENDING': 'text-yellow-600',
            'CONFIRMED': 'text-blue-600',
            'PROCESSING': 'text-blue-600',
            'SHIPPED': 'text-purple-600',
            'DELIVERED': 'text-green-600',
            'CANCELLED': 'text-red-600'
        };
        return colors[status] || 'text-slate-600';
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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4" data-aos="fade-up">Track Your Order</h1>
                    <p className="text-xl text-slate-500" data-aos="fade-up" data-aos-delay="100">Enter your order details to track shipment status</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Track Order</span>
                </nav>

                <form onSubmit={handleTrack} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm mb-8" data-aos="fade-up">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Order Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                placeholder="e.g., RMD-XXXXXX-XXXX"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Track Order
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {orderStatus && (
                    <div className="space-y-6" data-aos="fade-up">
                        {/* Order Info */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Order #{orderStatus.orderNumber}</h3>
                                    <p className="text-sm text-slate-500">Placed on {formatDate(orderStatus.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${getStatusColor(orderStatus.status)}`}>
                                        {orderStatus.status}
                                    </span>
                                    <p className="text-sm text-slate-500">{formatPrice(orderStatus.total)}</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                {orderStatus.timeline.map((step, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${step.isCancelled
                                            ? 'bg-red-500'
                                            : step.completed
                                                ? 'bg-[#DA2439]'
                                                : 'bg-slate-200'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${step.isCancelled
                                                ? 'text-red-500'
                                                : step.completed
                                                    ? 'text-slate-900'
                                                    : 'text-slate-400'
                                                }`}>
                                                {step.status}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {step.date ? formatDate(step.date) : 'Pending'}
                                            </p>
                                        </div>
                                        {step.completed && !step.isCancelled && (
                                            <span className="text-green-500 text-sm">✓</span>
                                        )}
                                        {step.isCancelled && (
                                            <span className="text-red-500 text-sm">✕</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        {orderStatus.items && orderStatus.items.length > 0 && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {orderStatus.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                                                alt={item.product?.name}
                                                className="w-16 h-20 object-cover rounded-lg bg-slate-100"
                                            />
                                            <div className="flex-1">
                                                <p className="text-slate-900 font-medium">{item.product?.name}</p>
                                                <p className="text-sm text-slate-500">
                                                    {item.variant?.size} / {item.variant?.color} × {item.quantity}
                                                </p>
                                                <p className="text-[#DA2439] font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Address */}
                        {orderStatus.address && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Delivery Address</h3>
                                <p className="text-slate-600">
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
                    <p className="text-slate-500">Need help? <Link to="/contact" className="text-[#DA2439] hover:text-[#b91d30] font-semibold">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
}

export default TrackOrderPage;

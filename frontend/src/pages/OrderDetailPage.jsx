import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await ordersAPI.getById(id);
                setOrder(res.data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            await ordersAPI.cancel(id);
            setOrder({ ...order, status: 'CANCELLED' });
        } catch (error) {
            alert('Failed to cancel order');
        }
    };

    const getStatusClass = (status) => {
        const classes = {
            'PENDING': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
            'CONFIRMED': 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
            'PROCESSING': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
            'SHIPPED': 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
            'DELIVERED': 'bg-green-500/10 text-green-400 border border-green-500/30',
            'CANCELLED': 'bg-red-500/10 text-red-400 border border-red-500/30'
        };
        return classes[status] || 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="empty-state">
                <h2 className="empty-state-title">Order not found</h2>
                <Link to="/orders" className="btn btn-primary">View Orders</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <Link to="/orders" className="text-gray-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-heading text-white">Order #{order.orderNumber}</h1>
                    <p className="text-gray-400 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2 text-white">Order Status</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                {['PENDING', 'CONFIRMED'].includes(order.status) && (
                                    <button onClick={handleCancel} className="btn bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <h2 className="text-lg font-semibold mb-4 text-white">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-800 last:border-b-0">
                                        <div className="w-20 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/80x96'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover object-center"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x96'; }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white">{item.product?.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.variant?.size && `Size: ${item.variant.size}`}
                                                {item.variant?.size && item.variant?.color && ' | '}
                                                {item.variant?.color && `Color: ${item.variant.color}`}
                                            </p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                                            <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <h2 className="text-lg font-semibold mb-4 text-white">Delivery Address</h2>
                            {order.address && (
                                <div className="text-gray-400">
                                    <p className="font-medium text-white">{order.address.name}</p>
                                    <p>{order.address.street}</p>
                                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                    <p className="mt-2">Phone: {order.address.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4 text-white">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-white">{order.shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(order.shipping)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount</span>
                                        <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                <hr className="border-gray-800" />
                                <div className="flex justify-between text-base">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="font-bold text-xl text-amber-500">{formatPrice(order.total)}</span>
                                </div>
                            </div>

                            <hr className="border-gray-800 my-4" />

                            <div className="text-sm">
                                <p className="text-gray-500 mb-1">Payment Method</p>
                                <p className="font-medium text-white">{order.paymentMethod}</p>
                            </div>

                            <div className="text-sm mt-4">
                                <p className="text-gray-500 mb-1">Payment Status</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage;

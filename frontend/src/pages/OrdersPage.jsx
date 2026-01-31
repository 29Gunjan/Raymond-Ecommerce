import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await ordersAPI.getAll();
                setOrders(res.data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

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
            month: 'short',
            year: 'numeric'
        });
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

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">My Orders</h1>
                    <p className="text-gray-400 mt-1">{orders.length} orders</p>
                </div>
            </div>

            <div className="container py-8">
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="empty-state-title">No orders yet</h2>
                        <p className="empty-state-text">Start shopping to see your orders here.</p>
                        <Link to="/products" className="btn btn-primary">Shop Now</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="block bg-[#12121a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <p className="font-medium text-lg text-white">Order #{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {order.items?.slice(0, 3).map(item => (
                                        <div key={item.id} className="w-16 h-20 bg-gray-900 rounded overflow-hidden">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/64x80'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                                            />
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <div className="w-16 h-20 bg-gray-900 rounded flex items-center justify-center text-sm text-gray-500">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-800">
                                    <p className="text-sm text-gray-500">{order.items?.length} items</p>
                                    <p className="text-lg font-bold text-amber-500">{formatPrice(order.total)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;

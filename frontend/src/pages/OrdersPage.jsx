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
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'CONFIRMED': 'bg-blue-100 text-blue-700',
            'PROCESSING': 'bg-indigo-100 text-indigo-700',
            'SHIPPED': 'bg-purple-100 text-purple-700',
            'DELIVERED': 'bg-green-100 text-green-700',
            'CANCELLED': 'bg-red-100 text-red-700'
        };
        return classes[status] || 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#DA2439] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-heading font-bold text-slate-900">My Orders</h1>
                    <p className="text-slate-500 mt-2">{orders.length} orders placed</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-6 text-slate-300">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-8">Start shopping to see your orders here.</p>
                        <Link to="/products" className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="block bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <p className="font-bold text-lg text-slate-900">Order #{order.orderNumber}</p>
                                        <p className="text-sm text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    {order.items?.slice(0, 4).map(item => (
                                        <div key={item.id} className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/64x80'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                                            />
                                        </div>
                                    ))}
                                    {order.items?.length > 4 && (
                                        <div className="w-16 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-sm text-slate-500 font-medium">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 flex justify-between items-center pt-5 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">{order.items?.length} items</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-xl font-bold text-slate-900">{formatPrice(order.total)}</p>
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
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

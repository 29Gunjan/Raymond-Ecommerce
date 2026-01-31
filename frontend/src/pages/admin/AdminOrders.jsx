import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const res = await adminAPI.getOrders({ ...params, limit: 100 });
            setOrders(res.data?.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await adminAPI.updateOrderStatus(orderId, status);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

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
                    <h1 className="text-3xl font-heading text-white">Orders</h1>
                    <p className="text-gray-400 mt-1">{orders.length} orders</p>
                </div>
            </div>

            <div className="container py-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        All
                    </button>
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">Order</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Items</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">#{order.orderNumber}</p>
                                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{order.items?.length} items</td>
                                        <td className="px-6 py-4 font-medium text-amber-500">{formatPrice(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#12121a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Order #{selectedOrder.orderNumber}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div className="flex items-center gap-4">
                                <label className="font-medium text-white">Update Status:</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                    className="form-select max-w-xs"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2 text-white">Customer</h3>
                                    <p className="text-gray-300">{selectedOrder.user?.name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.user?.phone}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2 text-white">Shipping Address</h3>
                                    {selectedOrder.address && (
                                        <div className="text-sm text-gray-400">
                                            <p>{selectedOrder.address.name}</p>
                                            <p>{selectedOrder.address.street}</p>
                                            <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                                            <p>{selectedOrder.address.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-medium mb-3 text-white">Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map(item => (
                                        <div key={item.id} className="flex gap-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
                                            <div className="w-16 h-20 bg-gray-800 rounded overflow-hidden">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/64x80'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{item.product?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.variant?.size && `Size: ${item.variant.size}`}
                                                    {item.variant?.color && ` | Color: ${item.variant.color}`}
                                                </p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                            </div>
                                            <div className="text-right font-medium text-amber-500">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="border-t border-gray-800 pt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-white">{selectedOrder.shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(selectedOrder.shipping)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span className="text-white">Total</span>
                                    <span className="text-amber-500">{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;

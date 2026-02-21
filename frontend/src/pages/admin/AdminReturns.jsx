import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminReturns.css';

const RETURN_STATUSES = ['REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'REFUNDED'];

function AdminReturns() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchReturns();
    }, [filter]);

    const fetchReturns = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const res = await adminAPI.getReturns({ ...params, limit: 100 });
            setReturns(res.data?.returns || []);
        } catch (error) {
            console.error('Failed to fetch returns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (returnId, status) => {
        setUpdating(true);
        try {
            const res = await adminAPI.updateReturnStatus(returnId, { status, adminNotes: adminNotes || undefined });
            const updated = res.data;
            setReturns(returns.map(r => r.id === returnId ? { ...r, status, adminNotes: adminNotes || r.adminNotes } : r));
            if (selectedReturn?.id === returnId) {
                setSelectedReturn({ ...selectedReturn, status, adminNotes: adminNotes || selectedReturn.adminNotes });
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const openDetail = (ret) => {
        setSelectedReturn(ret);
        setAdminNotes(ret.adminNotes || '');
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
            'REQUESTED': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
            'APPROVED': 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
            'REJECTED': 'bg-red-500/10 text-red-400 border border-red-500/30',
            'PICKED_UP': 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
            'RECEIVED': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
            'REFUNDED': 'bg-green-500/10 text-green-400 border border-green-500/30'
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
                    <h1 className="text-3xl font-heading text-white">Returns Management</h1>
                    <p className="text-gray-400 mt-1">{returns.length} return request{returns.length !== 1 ? 's' : ''}</p>
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
                    {RETURN_STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {status.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                {/* Returns Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">Return #</th>
                                    <th className="px-6 py-4 font-medium">Order #</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Reason</th>
                                    <th className="px-6 py-4 font-medium">Refund</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {returns.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            No return requests found
                                        </td>
                                    </tr>
                                ) : (
                                    returns.map(ret => (
                                        <tr key={ret.id} className="hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-white text-sm">{ret.returnNumber}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-300 text-sm">#{ret.order?.orderNumber}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-white text-sm">{ret.user?.name}</p>
                                                <p className="text-xs text-gray-500">{ret.user?.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-300 text-sm truncate max-w-[150px]" title={ret.reason}>{ret.reason}</p>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-amber-500 text-sm">{formatPrice(ret.refundAmount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(ret.status)}`}>
                                                    {ret.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-gray-500">{formatDate(ret.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => openDetail(ret)}
                                                        className="px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Return Detail Modal */}
            {selectedReturn && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#12121a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Return {selectedReturn.returnNumber}</h2>
                                <p className="text-sm text-gray-500 mt-1">Order #{selectedReturn.order?.orderNumber}</p>
                            </div>
                            <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <label className="font-medium text-white">Update Status:</label>
                                <select
                                    value={selectedReturn.status}
                                    onChange={(e) => handleStatusUpdate(selectedReturn.id, e.target.value)}
                                    disabled={updating}
                                    className="form-select max-w-xs"
                                >
                                    {RETURN_STATUSES.map(status => (
                                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                                {updating && (
                                    <svg className="animate-spin w-5 h-5 text-amber-500" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <label className="font-medium text-white block mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this return..."
                                    className="admin-returns-notes"
                                />
                            </div>

                            {/* Customer & Reason */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2 text-white">Customer</h3>
                                    <p className="text-gray-300">{selectedReturn.user?.name}</p>
                                    <p className="text-sm text-gray-500">{selectedReturn.user?.email}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2 text-white">Return Reason</h3>
                                    <p className="text-gray-300">{selectedReturn.reason}</p>
                                    {selectedReturn.description && (
                                        <p className="text-sm text-gray-500 mt-1">{selectedReturn.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Returned Items */}
                            <div>
                                <h3 className="font-medium mb-3 text-white">Returned Items</h3>
                                <div className="space-y-3">
                                    {selectedReturn.items?.map(item => (
                                        <div key={item.id} className="flex gap-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
                                            <div className="w-16 h-20 bg-gray-800 rounded overflow-hidden">
                                                <img
                                                    src={item.orderItem?.product?.images?.[0] || 'https://via.placeholder.com/64x80'}
                                                    alt={item.orderItem?.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{item.orderItem?.product?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.orderItem?.variant?.size && `Size: ${item.orderItem.variant.size}`}
                                                    {item.orderItem?.variant?.color && ` | Color: ${item.orderItem.variant.color}`}
                                                </p>
                                                <p className="text-sm text-gray-400">Return Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right font-medium text-amber-500">
                                                {formatPrice(item.orderItem?.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Refund Summary */}
                            <div className="border-t border-gray-800 pt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Payment Method</span>
                                    <span className="text-white">{selectedReturn.order?.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Payment Status</span>
                                    <span className={selectedReturn.order?.paymentStatus === 'REFUNDED' ? 'text-green-400' : 'text-white'}>
                                        {selectedReturn.order?.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span className="text-white">Refund Amount</span>
                                    <span className="text-amber-500">{formatPrice(selectedReturn.refundAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminReturns;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { returnsAPI } from '../services/api';
import './MyReturnsPage.css';

const RETURN_STEPS = ['REQUESTED', 'APPROVED', 'PICKED_UP', 'RECEIVED', 'REFUNDED'];

function MyReturnsPage() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const res = await returnsAPI.getAll();
                setReturns(res.data || []);
            } catch (error) {
                console.error('Failed to fetch returns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
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
            'REQUESTED': 'bg-yellow-100 text-yellow-700',
            'APPROVED': 'bg-blue-100 text-blue-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'PICKED_UP': 'bg-purple-100 text-purple-700',
            'RECEIVED': 'bg-indigo-100 text-indigo-700',
            'REFUNDED': 'bg-green-100 text-green-700'
        };
        return classes[status] || 'bg-slate-100 text-slate-700';
    };

    const getStepState = (status, stepIndex) => {
        if (status === 'REJECTED') {
            if (stepIndex === 0) return 'completed';
            if (stepIndex === 1) return 'rejected';
            return '';
        }
        const currentIndex = RETURN_STEPS.indexOf(status);
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return '';
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
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <Link to="/orders" className="text-slate-500 hover:text-[#DA2439] transition-colors">My Orders</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">My Returns</span>
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-slate-900">My Returns</h1>
                    <p className="text-slate-500 mt-2">{returns.length} return request{returns.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                {returns.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-6 text-slate-300">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No return requests</h2>
                        <p className="text-slate-500 mb-8">You haven't made any return requests yet.</p>
                        <Link to="/orders" className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                            View Orders
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {returns.map(ret => (
                            <Link
                                key={ret.id}
                                to={`/my-returns/${ret.id}`}
                                className="block bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <p className="font-bold text-lg text-slate-900">Return #{ret.returnNumber}</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Order #{ret.order?.orderNumber} &middot; {formatDate(ret.createdAt)}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(ret.status)}`}>
                                        {ret.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Mini Status Timeline */}
                                <div className="returns-status-timeline mt-4">
                                    {(ret.status === 'REJECTED' ? ['REQUESTED', 'REJECTED'] : RETURN_STEPS).map((step, i, arr) => (
                                        <div key={step} style={{ display: 'contents' }}>
                                            <div className={`timeline-step ${getStepState(ret.status, i)}`}>
                                                <div className="step-dot">
                                                    {getStepState(ret.status, i) === 'completed' ? '✓' :
                                                        getStepState(ret.status, i) === 'rejected' ? '✕' : (i + 1)}
                                                </div>
                                                <span className="step-label">{step.replace(/_/g, ' ')}</span>
                                            </div>
                                            {i < arr.length - 1 && (
                                                <div className={`timeline-connector ${getStepState(ret.status, i) === 'completed' ? 'completed' : ''}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Product thumbnails */}
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {ret.items?.slice(0, 4).map(item => (
                                        <div key={item.id} className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden">
                                            <img
                                                src={item.orderItem?.product?.images?.[0] || 'https://via.placeholder.com/64x80'}
                                                alt={item.orderItem?.product?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                                            />
                                        </div>
                                    ))}
                                    {ret.items?.length > 4 && (
                                        <div className="w-16 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-sm text-slate-500 font-medium">
                                            +{ret.items.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 flex justify-between items-center pt-5 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">{ret.items?.length} item{ret.items?.length !== 1 ? 's' : ''}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Refund Amount</p>
                                            <p className="text-xl font-bold text-slate-900">{formatPrice(ret.refundAmount)}</p>
                                        </div>
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

export default MyReturnsPage;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { returnsAPI } from '../services/api';
import './MyReturnsPage.css';

const RETURN_STEPS = ['REQUESTED', 'APPROVED', 'PICKED_UP', 'RECEIVED', 'REFUNDED'];

function ReturnDetailPage() {
    const { id } = useParams();
    const [returnData, setReturnData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReturn = async () => {
            try {
                const res = await returnsAPI.getById(id);
                setReturnData(res.data);
            } catch (error) {
                console.error('Failed to fetch return:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReturn();
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
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!returnData) {
        return (
            <div className="empty-state">
                <h2 className="empty-state-title">Return request not found</h2>
                <Link to="/my-returns" className="btn btn-primary">View Returns</Link>
            </div>
        );
    }

    const timelineSteps = returnData.status === 'REJECTED' ? ['REQUESTED', 'REJECTED'] : RETURN_STEPS;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <Link to="/my-returns" className="text-gray-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Returns
                    </Link>
                    <h1 className="text-3xl font-heading text-white">Return #{returnData.returnNumber}</h1>
                    <p className="text-gray-400 mt-1">Requested on {formatDate(returnData.createdAt)}</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Return Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status & Timeline */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white">Return Status</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(returnData.status)}`}>
                                    {returnData.status.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {/* Timeline */}
                            <div className="return-detail-timeline">
                                {timelineSteps.map((step, i) => (
                                    <div key={step} style={{ display: 'contents' }}>
                                        <div className={`timeline-step ${getStepState(returnData.status, i)}`}>
                                            <div className="step-dot">
                                                {getStepState(returnData.status, i) === 'completed' ? '✓' :
                                                    getStepState(returnData.status, i) === 'rejected' ? '✕' : (i + 1)}
                                            </div>
                                            <span className="step-label">{step.replace(/_/g, ' ')}</span>
                                        </div>
                                        {i < timelineSteps.length - 1 && (
                                            <div className={`timeline-connector ${getStepState(returnData.status, i) === 'completed' ? 'completed' : ''}`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {returnData.adminNotes && (
                                <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Admin Note</p>
                                    <p className="text-sm text-gray-300">{returnData.adminNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <h2 className="text-lg font-semibold mb-3 text-white">Reason for Return</h2>
                            <p className="text-gray-300 font-medium">{returnData.reason}</p>
                            {returnData.description && (
                                <p className="text-gray-400 text-sm mt-2">{returnData.description}</p>
                            )}
                        </div>

                        {/* Returned Items */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <h2 className="text-lg font-semibold mb-4 text-white">Returned Items</h2>
                            <div className="space-y-4">
                                {returnData.items?.map(item => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-800 last:border-b-0">
                                        <div className="w-20 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.orderItem?.product?.images?.[0] || 'https://via.placeholder.com/80x96'}
                                                alt={item.orderItem?.product?.name}
                                                className="w-full h-full object-cover object-center"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x96'; }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white">{item.orderItem?.product?.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.orderItem?.variant?.size && `Size: ${item.orderItem.variant.size}`}
                                                {item.orderItem?.variant?.size && item.orderItem?.variant?.color && ' | '}
                                                {item.orderItem?.variant?.color && `Color: ${item.orderItem.variant.color}`}
                                            </p>
                                            <p className="text-sm text-gray-500">Return Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">{formatPrice(item.orderItem?.price * item.quantity)}</p>
                                            <p className="text-sm text-gray-500">{formatPrice(item.orderItem?.price)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24 space-y-6">
                            {/* Refund Info */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-white">Refund Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Refund Amount</span>
                                        <span className="font-bold text-xl text-[#DA2439]">{formatPrice(returnData.refundAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Refund Method</span>
                                        <span className="text-white">{returnData.refundMethod === 'ORIGINAL' ? 'Original Payment' : returnData.refundMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Refund Status</span>
                                        <span className={returnData.status === 'REFUNDED' ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>
                                            {returnData.status === 'REFUNDED' ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Order Info */}
                            <div>
                                <h3 className="font-semibold mb-3 text-white">Linked Order</h3>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Number</span>
                                        <Link to={`/orders/${returnData.order?.id}`} className="text-[#DA2439] hover:underline font-medium">
                                            #{returnData.order?.orderNumber}
                                        </Link>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Total</span>
                                        <span className="text-white">{formatPrice(returnData.order?.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Payment Method</span>
                                        <span className="text-white">{returnData.order?.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Dates */}
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Requested</span>
                                    <span className="text-white">{formatDate(returnData.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated</span>
                                    <span className="text-white">{formatDate(returnData.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReturnDetailPage;

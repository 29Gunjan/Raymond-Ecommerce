import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

// Cancellation reasons like Flipkart
const CANCEL_REASONS = [
    { id: 'changed_mind', label: 'Changed my mind', description: 'I no longer want this product' },
    { id: 'found_cheaper', label: 'Found a better price elsewhere', description: 'I found a cheaper alternative' },
    { id: 'wrong_product', label: 'Ordered wrong product/size', description: 'I made a mistake while ordering' },
    { id: 'delivery_delay', label: 'Expected delivery time is too long', description: 'The delivery is taking too long' },
    { id: 'duplicate_order', label: 'Duplicate order', description: 'I accidentally placed multiple orders' },
    { id: 'payment_issues', label: 'Payment issues', description: 'I want to use a different payment method' },
    { id: 'other', label: 'Other reason', description: 'My reason is not listed above' }
];

function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Cancellation modal state
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelStep, setCancelStep] = useState(1); // 1: Select reason, 2: Enter OTP
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [otp, setOtp] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState('');
    const [otpSent, setOtpSent] = useState(false);

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

    // Open cancel modal
    const openCancelModal = () => {
        setShowCancelModal(true);
        setCancelStep(1);
        setSelectedReason('');
        setOtherReason('');
        setOtp('');
        setCancelError('');
        setOtpSent(false);
    };

    // Close cancel modal
    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelStep(1);
        setSelectedReason('');
        setOtherReason('');
        setOtp('');
        setCancelError('');
        setOtpSent(false);
    };

    // Request OTP
    const handleRequestOtp = async () => {
        if (!selectedReason) {
            setCancelError('Please select a reason for cancellation');
            return;
        }
        if (selectedReason === 'other' && !otherReason.trim()) {
            setCancelError('Please specify your reason');
            return;
        }

        setCancelLoading(true);
        setCancelError('');

        try {
            const res = await ordersAPI.requestCancelOtp(id);
            setMaskedEmail(res.data.email);
            setOtpSent(true);
            setCancelStep(2);
        } catch (error) {
            setCancelError(error.response?.data?.error || 'Failed to send OTP');
        } finally {
            setCancelLoading(false);
        }
    };

    // Verify OTP and cancel order
    const handleConfirmCancel = async () => {
        if (!otp || otp.length !== 6) {
            setCancelError('Please enter a valid 6-digit OTP');
            return;
        }

        setCancelLoading(true);
        setCancelError('');

        const reason = selectedReason === 'other' 
            ? otherReason 
            : CANCEL_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;

        try {
            await ordersAPI.cancel(id, { otp, reason });
            setOrder({ ...order, status: 'CANCELLED', cancelReason: reason });
            closeCancelModal();
        } catch (error) {
            setCancelError(error.response?.data?.error || 'Failed to cancel order');
        } finally {
            setCancelLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setCancelLoading(true);
        setCancelError('');

        try {
            const res = await ordersAPI.requestCancelOtp(id);
            setMaskedEmail(res.data.email);
            setCancelError('');
            alert('OTP has been resent to your email');
        } catch (error) {
            setCancelError(error.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setCancelLoading(false);
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
                                    {order.cancelReason && (
                                        <p className="text-sm text-gray-400 mt-2">
                                            <span className="text-gray-500">Cancellation Reason:</span> {order.cancelReason}
                                        </p>
                                    )}
                                </div>
                                {['PENDING', 'CONFIRMED'].includes(order.status) && (
                                    <button onClick={openCancelModal} className="btn bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20">
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
                                    <span className="font-bold text-xl text-[#DA2439]">{formatPrice(order.total)}</span>
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

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121a] rounded-xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">
                                {cancelStep === 1 ? 'Cancel Order' : 'Verify OTP'}
                            </h2>
                            <button 
                                onClick={closeCancelModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {cancelStep === 1 ? (
                                <>
                                    {/* Reason Selection */}
                                    <p className="text-gray-400 mb-4">
                                        Please tell us why you want to cancel this order:
                                    </p>
                                    <div className="space-y-3">
                                        {CANCEL_REASONS.map(reason => (
                                            <label 
                                                key={reason.id}
                                                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                                                    selectedReason === reason.id 
                                                        ? 'border-[#DA2439] bg-[#DA2439]/10' 
                                                        : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="cancelReason"
                                                    value={reason.id}
                                                    checked={selectedReason === reason.id}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="mt-1 accent-[#DA2439]"
                                                />
                                                <div>
                                                    <p className="text-white font-medium">{reason.label}</p>
                                                    <p className="text-gray-500 text-sm">{reason.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Other Reason Text Area */}
                                    {selectedReason === 'other' && (
                                        <div className="mt-4">
                                            <textarea
                                                value={otherReason}
                                                onChange={(e) => setOtherReason(e.target.value)}
                                                placeholder="Please specify your reason..."
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-[#DA2439] focus:outline-none resize-none"
                                                rows={3}
                                            />
                                        </div>
                                    )}

                                    {cancelError && (
                                        <p className="text-red-400 text-sm mt-4">{cancelError}</p>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={closeCancelModal}
                                            className="flex-1 btn bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                                        >
                                            Keep Order
                                        </button>
                                        <button
                                            onClick={handleRequestOtp}
                                            disabled={cancelLoading || !selectedReason}
                                            className="flex-1 btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {cancelLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Sending OTP...
                                                </span>
                                            ) : 'Continue'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* OTP Verification */}
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-[#DA2439]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-[#DA2439]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-white font-medium">OTP Sent!</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            We've sent a 6-digit verification code to<br />
                                            <span className="text-white">{maskedEmail}</span>
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-400 text-sm mb-2">Enter OTP</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:border-[#DA2439] focus:outline-none"
                                            maxLength={6}
                                        />
                                    </div>

                                    <p className="text-center text-sm text-gray-400 mb-4">
                                        Didn't receive the code?{' '}
                                        <button 
                                            onClick={handleResendOtp}
                                            disabled={cancelLoading}
                                            className="text-[#DA2439] hover:underline disabled:opacity-50"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>

                                    {cancelError && (
                                        <p className="text-red-400 text-sm text-center mb-4">{cancelError}</p>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setCancelStep(1)}
                                            className="flex-1 btn bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleConfirmCancel}
                                            disabled={cancelLoading || otp.length !== 6}
                                            className="flex-1 btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {cancelLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Cancelling...
                                                </span>
                                            ) : 'Confirm Cancellation'}
                                        </button>
                                    </div>

                                    <p className="text-gray-500 text-xs text-center mt-4">
                                        OTP is valid for 10 minutes
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDetailPage;

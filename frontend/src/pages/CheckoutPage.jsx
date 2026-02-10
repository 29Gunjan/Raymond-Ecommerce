import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressesAPI, ordersAPI, paymentAPI } from '../services/api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await addressesAPI.getAll();
            setAddresses(res.data || []);
            const defaultAddr = res.data?.find(a => a.isDefault) || res.data?.[0];
            if (defaultAddr) setSelectedAddress(defaultAddr.id);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await addressesAPI.add(newAddress);
            setAddresses([...addresses, res.data]);
            setSelectedAddress(res.data.id);
            setShowAddressForm(false);
            setNewAddress({
                name: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                isDefault: false
            });
        } catch (error) {
            console.error('Failed to add address:', error);
            alert('Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        setPlacing(true);
        
        try {
            if (paymentMethod === 'RAZORPAY') {
                // Get Razorpay key
                const keyRes = await paymentAPI.getKey();
                const razorpayKey = keyRes.data.key;

                // Create Razorpay order
                const orderRes = await paymentAPI.createOrder({
                    addressId: selectedAddress
                });

                const { orderId, amount, currency } = orderRes.data;

                // Get selected address details
                const selectedAddr = addresses.find(a => a.id === selectedAddress);

                // Initialize Razorpay checkout
                const options = {
                    key: razorpayKey,
                    amount: amount,
                    currency: currency,
                    name: 'Raymond Store',
                    description: 'Premium Fashion Purchase',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Raymond_logo.svg/200px-Raymond_logo.svg.png',
                    order_id: orderId,
                    handler: async function (response) {
                        try {
                            // Verify payment on backend
                            const verifyRes = await paymentAPI.verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                addressId: selectedAddress
                            });

                            if (verifyRes.data.success) {
                                await clearCart();
                                navigate(`/orders/${verifyRes.data.order.id}`, { 
                                    state: { orderPlaced: true } 
                                });
                            }
                        } catch (error) {
                            console.error('Payment verification failed:', error);
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: user?.name || selectedAddr?.name || '',
                        email: user?.email || '',
                        contact: user?.phone || selectedAddr?.phone || ''
                    },
                    notes: {
                        address: selectedAddr ? 
                            `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}` : ''
                    },
                    theme: {
                        color: '#1e293b'
                    },
                    modal: {
                        ondismiss: function() {
                            setPlacing(false);
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                
                razorpay.on('payment.failed', async function (response) {
                    await paymentAPI.handleFailure({
                        razorpay_order_id: response.error.metadata.order_id,
                        error_code: response.error.code,
                        error_description: response.error.description
                    });
                    alert(`Payment failed: ${response.error.description}`);
                    setPlacing(false);
                });

                razorpay.open();
            } else {
                // Cash on Delivery
                const res = await ordersAPI.create({
                    addressId: selectedAddress,
                    paymentMethod: 'COD'
                });
                await clearCart();
                navigate(`/orders/${res.data.id}`, { state: { orderPlaced: true } });
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order: ' + (error.response?.data?.error || 'Unknown error'));
            setPlacing(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const shipping = subtotal > 2999 ? 0 : 199;
    const total = subtotal + shipping;

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
                    <h1 className="text-4xl font-heading font-bold text-slate-900">Checkout</h1>
                    <p className="text-slate-500 mt-2">Complete your order</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Addresses & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-[#DA2439] text-sm font-semibold hover:text-[#b91d30] transition-colors"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {/* Add Address Form */}
                            {showAddressForm && (
                                <form onSubmit={handleAddAddress} className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.name}
                                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                placeholder="Street address, apartment, suite, etc."
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.state}
                                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">PIN Code</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.pincode}
                                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                                value={newAddress.country}
                                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">Save Address</button>
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <label
                                        key={addr.id}
                                        className={`block p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#DA2439] bg-red-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress === addr.id}
                                            onChange={() => setSelectedAddress(addr.id)}
                                            className="sr-only"
                                        />
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-slate-900">{addr.name}</span>
                                            {addr.isDefault && <span className="text-xs px-2 py-1 bg-red-100 text-[#DA2439] rounded-full font-medium">Default</span>}
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {addr.street}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-2">{addr.phone}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-slate-900">Payment Method</h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        id: 'RAZORPAY', label: 'Pay Online', desc: 'UPI, Cards, Net Banking, Wallets', icon: (
                                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        ),
                                        recommended: true
                                    },
                                    {
                                        id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive (+₹49 handling)', icon: (
                                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        )
                                    }
                                ].map(method => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#DA2439] bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === method.id}
                                            onChange={() => setPaymentMethod(method.id)}
                                            className="w-5 h-5 text-[#DA2439] bg-white border-slate-300 focus:ring-[#DA2439]"
                                        />
                                        <span className="flex-shrink-0">{method.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900">{method.label}</p>
                                                {method.recommended && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Recommended</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md sticky top-28">
                            <h2 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cart?.items?.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.images?.[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate text-slate-900">{item.product.name}</p>
                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-slate-900 mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-slate-100 my-4" />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Shipping</span>
                                    <span className="font-semibold text-slate-900">{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex justify-between text-base pt-2">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-2xl text-slate-900">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || !selectedAddress}
                                className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                            >
                                {placing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {paymentMethod === 'RAZORPAY' ? 'Processing...' : 'Placing Order...'}
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === 'RAZORPAY' ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Pay {formatPrice(total)}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Place Order (COD)
                                            </>
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Security Note */}
                            <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Your payment is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;

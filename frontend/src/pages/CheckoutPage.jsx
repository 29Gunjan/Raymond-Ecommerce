import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { addressesAPI, ordersAPI } from '../services/api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
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
            const res = await ordersAPI.create({
                addressId: selectedAddress,
                paymentMethod
            });
            await clearCart();
            navigate(`/orders/${res.data.id}`, { state: { orderPlaced: true } });
        } catch (error) {
            alert('Failed to place order: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
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
                                        id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: (
                                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        id: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: (
                                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        id: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: (
                                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
                                        <div>
                                            <p className="font-semibold text-slate-900">{method.label}</p>
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
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Place Order
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

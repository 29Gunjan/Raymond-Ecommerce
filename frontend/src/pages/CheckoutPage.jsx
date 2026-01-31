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
                    <h1 className="text-3xl font-heading text-white">Checkout</h1>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Addresses & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {/* Add Address Form */}
                            {showAddressForm && (
                                <form onSubmit={handleAddAddress} className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={newAddress.name}
                                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group md:col-span-2">
                                            <label className="form-label">Street Address</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Street address, apartment, suite, etc."
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={newAddress.state}
                                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">PIN Code</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={newAddress.pincode}
                                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={newAddress.country}
                                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button type="submit" className="btn btn-primary">Save Address</button>
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <label
                                        key={addr.id}
                                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-amber-500 bg-amber-500/5' : 'border-gray-700 hover:border-gray-600'
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
                                            <span className="font-medium text-white">{addr.name}</span>
                                            {addr.isDefault && <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded">Default</span>}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {addr.street}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-semibold mb-6 text-white">Payment Method</h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                                    { id: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                                    { id: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' }
                                ].map(method => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-amber-500 bg-amber-500/5' : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === method.id}
                                            onChange={() => setPaymentMethod(method.id)}
                                            className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 focus:ring-amber-500"
                                        />
                                        <div>
                                            <p className="font-medium text-white">{method.label}</p>
                                            <p className="text-sm text-gray-500">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cart?.items?.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.images?.[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-white">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-amber-500">{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-800 my-4" />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-white">{shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(shipping)}</span>
                                </div>
                                <hr className="border-gray-800" />
                                <div className="flex justify-between text-base">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="font-bold text-xl text-amber-500">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || !selectedAddress}
                                className="btn btn-primary btn-full btn-lg mt-6 disabled:opacity-50"
                            >
                                {placing ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;

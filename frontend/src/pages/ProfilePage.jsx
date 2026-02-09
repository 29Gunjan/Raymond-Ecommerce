import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, addressesAPI } from '../services/api';

function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        if (activeTab === 'addresses') {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchAddresses = async () => {
        try {
            const res = await addressesAPI.getAll();
            setAddresses(res.data || []);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.updateProfile(profile);
            updateUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await authAPI.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await addressesAPI.delete(id);
            setAddresses(addresses.filter(a => a.id !== id));
        } catch (error) {
            alert('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await addressesAPI.setDefault(id);
            setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
        } catch (error) {
            alert('Failed to set default address');
        }
    };

    const tabs = [
        {
            id: 'profile', label: 'Profile', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'addresses', label: 'Addresses', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'password', label: 'Password', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-heading font-bold text-slate-900">My Account</h1>
                    <p className="text-slate-500 mt-2">Manage your account settings and preferences</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#DA2439] to-[#b91d30] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{user?.name}</p>
                                    <p className="text-sm text-slate-500">{user?.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-slate-900 text-white font-semibold shadow-lg'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {message && (
                            <div className={`mb-6 px-5 py-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {message.text}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-slate-900">Profile Information</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                            value={profile.email}
                                            disabled
                                        />
                                        <p className="text-xs text-slate-400 mt-2">Email cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-slate-900">Saved Addresses</h2>
                                {addresses.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 mx-auto mb-4 text-slate-300">
                                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500">No addresses saved yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className="border border-slate-100 rounded-xl p-5 relative bg-slate-50 hover:bg-white transition-colors">
                                                {addr.isDefault && (
                                                    <span className="absolute top-3 right-3 px-3 py-1 bg-red-100 text-[#DA2439] text-xs font-medium rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                                <p className="font-semibold text-slate-900">{addr.name}</p>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {addr.street}
                                                </p>
                                                <p className="text-sm text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p className="text-sm text-slate-500 mt-2">{addr.phone}</p>
                                                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                                                    {!addr.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(addr.id)}
                                                            className="text-sm text-[#DA2439] hover:text-[#b91d30] font-medium transition-colors"
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-slate-900">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Changing...
                                            </>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;

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
        { id: 'profile', label: 'Profile' },
        { id: 'addresses', label: 'Addresses' },
        { id: 'password', label: 'Password' }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">My Account</h1>
                    <p className="text-gray-400 mt-1">Manage your account settings</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-4 border border-gray-800">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-800 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-amber-500/10 text-amber-500 font-medium'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {message && (
                            <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 text-white">Profile Information</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-md">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input bg-gray-900 cursor-not-allowed"
                                            value={profile.email}
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 text-white">Saved Addresses</h2>
                                {addresses.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No addresses saved yet.</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className="border border-gray-800 rounded-lg p-4 relative bg-gray-900/50">
                                                {addr.isDefault && (
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded">
                                                        Default
                                                    </span>
                                                )}
                                                <p className="font-medium text-white">{addr.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {addr.street}
                                                </p>
                                                <p className="text-sm text-gray-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                                                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800">
                                                    {!addr.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(addr.id)}
                                                            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
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
                            <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 text-white">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
                                        {loading ? 'Changing...' : 'Change Password'}
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

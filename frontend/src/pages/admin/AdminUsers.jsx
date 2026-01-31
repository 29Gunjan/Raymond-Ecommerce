import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getUsers();
            setUsers(res.data.users || res.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdating(userId);
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update user role');
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const userCount = users.filter(u => u.role === 'USER').length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">Manage Users</h1>
                    <p className="text-gray-400 mt-1">{users.length} registered users</p>
                </div>
            </div>

            <div className="container py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">{users.length}</p>
                    </div>
                    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Customers</p>
                        <p className="text-2xl font-bold text-green-400">{userCount}</p>
                    </div>
                    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Admins</p>
                        <p className="text-2xl font-bold text-purple-400">{adminCount}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-[250px] px-4 py-3 bg-[#12121a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                    />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-3 bg-[#12121a] border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="USER">Customers</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>

                {/* Users Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Phone</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium">Orders</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold">
                                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{user.name || 'No Name'}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{user.phone || '-'}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={updating === user.id}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer ${user.role === 'ADMIN'
                                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                                            : 'bg-gray-700 text-gray-300 border-gray-600'
                                                        } ${updating === user.id ? 'opacity-50' : ''}`}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{formatDate(user.createdAt)}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-sm font-medium">
                                                    {user._count?.orders || 0} orders
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/20 transition-colors"
                                                        onClick={() => alert(`View orders for ${user.name}`)}
                                                    >
                                                        View Orders
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
        </div>
    );
}

export default AdminUsers;

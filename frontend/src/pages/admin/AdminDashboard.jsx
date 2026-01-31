import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    adminAPI.getStats(),
                    adminAPI.getOrders({ limit: 5 })
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data?.orders || []);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
            month: 'short'
        });
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

    const ProductsIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );

    const OrdersIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    );

    const UsersIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const RevenueIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CategoriesIcon = () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: <ProductsIcon />, link: '/admin/products', color: 'blue' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <OrdersIcon />, link: '/admin/orders', color: 'green' },
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <UsersIcon />, link: '/admin/users', color: 'orange' },
        { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <RevenueIcon />, link: '/admin/orders', color: 'purple' }
    ];

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 text-white py-8 border-b border-gray-700">
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
                </div>
            </div>

            <div className="container py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {statCards.map((stat, i) => (
                        <Link
                            key={i}
                            to={stat.link}
                            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                                    {stat.icon}
                                </span>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <ProductsIcon />
                                </span>
                                <span className="text-gray-200">Manage Products</span>
                            </Link>
                            <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <OrdersIcon />
                                </span>
                                <span className="text-gray-200">Manage Orders</span>
                            </Link>
                            <Link to="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                    <CategoriesIcon />
                                </span>
                                <span className="text-gray-200">Manage Categories</span>
                            </Link>
                            <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                    <UsersIcon />
                                </span>
                                <span className="text-gray-200">Manage Users</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                            <Link to="/admin/orders" className="text-sm text-amber-500 hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                                        <th className="pb-3 font-medium">Order</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-700 last:border-b-0">
                                            <td className="py-3">
                                                <p className="font-medium text-white">#{order.orderNumber}</p>
                                                <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                                            </td>
                                            <td className="py-3 text-gray-300">{order.user?.name}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right font-medium text-white">{formatPrice(order.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

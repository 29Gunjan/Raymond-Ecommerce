import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    const navLinks = [
        { to: '/', label: 'Ghar' },
        { to: '/products', label: 'Shop All' },
        { to: '/products/suits-blazers', label: 'Suits' },
        { to: '/products/shirts', label: 'Shirts' },
        { to: '/products/trousers', label: 'Trousers' },
    ];

    return (
        <>
            {/* Top Banner */}
            <div className="bg-gray-900 text-white py-2.5 text-center text-sm font-medium tracking-wide">
                <span>Free Shipping on Orders Above ₹2,999 | </span>
                <span className="text-[#DA2439]">Use Code: RAYMOND20 for 20% Off</span>
            </div>

            <header
                className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100'
                    : 'bg-white/95 backdrop-blur-md'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 bg-[#DA2439] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                                    Raymond
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] -mt-1">
                                    The Complete Man
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    className={({ isActive }) => `
                                        relative px-5 py-2 rounded-full font-medium transition-all duration-300
                                        ${isActive
                                            ? 'text-white bg-[#DA2439]'
                                            : 'text-gray-700 hover:text-[#DA2439] hover:bg-red-50'
                                        }
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="p-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 hidden sm:flex"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#DA2439] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative group">
                                    <button
                                        className="flex items-center gap-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <div className="w-9 h-9 bg-[#DA2439] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
                                        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                My Orders
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                Wishlist
                                            </Link>
                                            {user.role === 'ADMIN' && (
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-[#DA2439] hover:bg-red-50 rounded-xl transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Admin Panel
                                                </Link>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-slate-100">
                                            <button
                                                onClick={logout}
                                                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 rounded-full font-semibold bg-[#DA2439] text-white hover:bg-[#b91d30] transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Sign In
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Expandable */}
                <div className={`overflow-hidden transition-all duration-500 border-t border-slate-100 ${searchOpen ? 'max-h-24' : 'max-h-0'}`}>
                    <div className="container mx-auto px-4 py-4">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for suits, shirts, trousers..."
                                className="flex-1 px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                autoFocus={searchOpen}
                            />
                            <button
                                type="submit"
                                className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xl font-heading font-bold text-slate-900">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="space-y-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        block px-4 py-3.5 rounded-xl font-medium transition-all duration-300
                                        ${isActive ? 'bg-red-50 text-[#DA2439]' : 'text-slate-700 hover:bg-slate-50'}
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        {!user && (
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full py-3.5 bg-slate-900 text-white text-center rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full py-3.5 mt-3 border-2 border-slate-200 text-slate-700 text-center rounded-xl font-semibold hover:border-slate-300 transition-colors"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-28" />
        </>
    );
}

export default Header;

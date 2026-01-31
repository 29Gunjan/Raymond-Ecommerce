import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { to: '/products', label: 'All Products' },
            { to: '/category/suits-blazers', label: 'Suits & Blazers' },
            { to: '/category/shirts', label: 'Shirts' },
            { to: '/category/trousers', label: 'Trousers' },
            { to: '/category/accessories', label: 'Accessories' },
        ],
        support: [
            { to: '/track-order', label: 'Track Order' },
            { to: '/returns', label: 'Returns & Exchange' },
            { to: '/shipping', label: 'Shipping Info' },
            { to: '/faq', label: 'FAQ' },
            { to: '/contact', label: 'Contact Us' },
        ],
        company: [
            { to: '/about', label: 'About Raymond' },
            { to: '/careers', label: 'Careers' },
            { to: '/stores', label: 'Store Locator' },
            { to: '/blog', label: 'Style Blog' },
        ],
    };

    const socialLinks = [
        { icon: 'facebook', url: '#', label: 'Facebook' },
        { icon: 'instagram', url: '#', label: 'Instagram' },
        { icon: 'twitter', url: '#', label: 'Twitter' },
        { icon: 'linkedin', url: '#', label: 'LinkedIn' },
    ];

    const getSocialIcon = (name) => {
        const icons = {
            facebook: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            instagram: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            twitter: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            linkedin: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        };
        return icons[name];
    };

    return (
        <footer className="bg-[#06060a] text-white relative overflow-hidden border-t border-gray-800">
            {/* Newsletter Section */}
            <div className="border-b border-gray-800">
                <div className="container py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h3 className="text-2xl font-heading mb-2 text-white">Stay Updated</h3>
                            <p className="text-gray-400">Subscribe for exclusive offers and style tips</p>
                        </div>
                        <form className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-72 px-5 py-3 bg-[#12121a] border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container py-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="text-3xl font-heading font-bold inline-block mb-4 text-white">
                            Raymond
                        </Link>
                        <p className="text-gray-400 mb-6">
                            The Complete Man. Crafting premium menswear since 1925.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.url}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-[#12121a] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all duration-300"
                                >
                                    {getSocialIcon(social.icon)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Shop</h4>
                        <div className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-gray-400 hover:text-amber-500 transition-colors py-1.5"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
                        <div className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-gray-400 hover:text-amber-500 transition-colors py-1.5"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
                        <div className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-gray-400 hover:text-amber-500 transition-colors py-1.5"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>&copy; {currentYear} Raymond. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link>
                            <Link to="/cookies" className="hover:text-amber-500 transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

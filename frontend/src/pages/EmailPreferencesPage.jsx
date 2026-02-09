import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function EmailPreferencesPage() {
    const { isAuthenticated, user } = useAuth();
    const toast = useToast();

    const [preferences, setPreferences] = useState({
        newsletter: true,
        promotions: true,
        orderUpdates: true,
        newArrivals: false,
        styleGuides: true,
        surveys: false,
        smsAlerts: false,
    });

    const [frequency, setFrequency] = useState('weekly');
    const [saving, setSaving] = useState(false);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Email preferences saved successfully!');
        setSaving(false);
    };

    const handleUnsubscribeAll = () => {
        setPreferences({
            newsletter: false,
            promotions: false,
            orderUpdates: false,
            newArrivals: false,
            styleGuides: false,
            surveys: false,
            smsAlerts: false,
        });
        toast.success('Unsubscribed from all marketing emails');
    };

    const preferenceItems = [
        {
            key: 'newsletter',
            title: 'Weekly Newsletter',
            description: 'Curated content including fashion trends, styling tips, and brand news',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            key: 'promotions',
            title: 'Sales & Promotions',
            description: 'Be the first to know about exclusive offers, discounts, and flash sales',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            key: 'orderUpdates',
            title: 'Order Updates',
            description: 'Receive shipping notifications and delivery updates for your orders',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            key: 'newArrivals',
            title: 'New Arrivals',
            description: 'Get notified when we launch new collections and products',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
        },
        {
            key: 'styleGuides',
            title: 'Style Guides & Tips',
            description: 'Fashion advice, outfit inspiration, and wardrobe building tips',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
        },
        {
            key: 'surveys',
            title: 'Surveys & Feedback',
            description: 'Occasional surveys to help us improve your shopping experience',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        {
            key: 'smsAlerts',
            title: 'SMS Alerts',
            description: 'Receive text messages for time-sensitive offers and order updates',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4" data-aos="fade-up">Email Preferences</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        Manage how you receive communications from Raymond
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Email Preferences</span>
                </nav>

                {!isAuthenticated ? (
                    <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center" data-aos="fade-up">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign in to manage preferences</h2>
                        <p className="text-slate-500 mb-8">You need to be logged in to manage your email preferences.</p>
                        <Link to="/login" className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Email Address */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6" data-aos="fade-up">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email Address</p>
                                    <p className="font-semibold text-slate-900">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6" data-aos="fade-up">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Email Frequency</h2>
                            <div className="flex flex-wrap gap-3">
                                {['daily', 'weekly', 'monthly'].map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setFrequency(freq)}
                                        className={`px-5 py-3 rounded-xl font-medium transition-all capitalize ${frequency === freq
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6" data-aos="fade-up">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Communication Preferences</h2>
                            <div className="space-y-4">
                                {preferenceItems.map((item) => (
                                    <div key={item.key} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0 shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                            <p className="text-sm text-slate-500">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors flex-shrink-0 ${preferences[item.key] ? 'bg-green-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${preferences[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Preferences'
                                )}
                            </button>
                            <button
                                onClick={handleUnsubscribeAll}
                                className="py-4 px-6 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-red-500 hover:text-red-500 transition-colors"
                            >
                                Unsubscribe All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmailPreferencesPage;

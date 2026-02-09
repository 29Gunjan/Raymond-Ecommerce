import { useState } from 'react';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Us',
            details: 'support@raymond.com',
            subtext: 'We reply within 24 hours'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Call Us',
            details: '1800-123-7296',
            subtext: 'Mon-Sat, 9AM-6PM'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Visit Us',
            details: 'Raymond House, Mumbai',
            subtext: 'Corporate Headquarters'
        }
    ];

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-lg">
                        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">Message Sent!</h1>
                        <p className="text-slate-500 mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                            }}
                            className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-heading font-bold text-slate-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-500">We'd love to hear from you. Get in touch with our team.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-6 mb-12">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-[#DA2439] rounded-full flex items-center justify-center">
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{info.title}</h3>
                            <p className="text-[#DA2439] font-semibold">{info.details}</p>
                            <p className="text-sm text-slate-400">{info.subtext}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8">Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="order">Order Inquiry</option>
                                    <option value="return">Return/Exchange</option>
                                    <option value="product">Product Question</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={5}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent focus:bg-white transition-all resize-none"
                                placeholder="How can we help you?"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#DA2439] text-white font-semibold rounded-xl hover:bg-[#b91d30] transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;

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
            icon: '📧',
            title: 'Email Us',
            details: 'support@raymond.com',
            subtext: 'We reply within 24 hours'
        },
        {
            icon: '📞',
            title: 'Call Us',
            details: '1800-123-7296',
            subtext: 'Mon-Sat, 9AM-6PM'
        },
        {
            icon: '📍',
            title: 'Visit Us',
            details: 'Raymond House, Mumbai',
            subtext: 'Corporate Headquarters'
        }
    ];

    if (submitted) {
        return (
            <div className="min-h-screen py-12">
                <div className="container max-w-2xl text-center">
                    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-12">
                        <span className="text-6xl mb-6 block">✅</span>
                        <h1 className="text-3xl font-heading text-white mb-4">Message Sent!</h1>
                        <p className="text-gray-400 mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                            }}
                            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-heading text-white mb-2">Contact Us</h1>
                    <p className="text-gray-400">We'd love to hear from you. Get in touch with our team.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6 text-center">
                            <span className="text-4xl mb-4 block">{info.icon}</span>
                            <h3 className="text-lg font-medium text-white mb-1">{info.title}</h3>
                            <p className="text-amber-500 font-medium">{info.details}</p>
                            <p className="text-sm text-gray-500">{info.subtext}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-2xl font-heading text-white mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none resize-none"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;

import { Link } from 'react-router-dom';

function CareersPage() {
    const openings = [
        {
            title: 'Senior Frontend Developer',
            department: 'Technology',
            location: 'Mumbai',
            type: 'Full-time',
            experience: '5+ years'
        },
        {
            title: 'Fashion Designer',
            department: 'Design',
            location: 'Mumbai',
            type: 'Full-time',
            experience: '3+ years'
        },
        {
            title: 'Store Manager',
            department: 'Retail',
            location: 'Multiple Cities',
            type: 'Full-time',
            experience: '4+ years'
        },
        {
            title: 'Digital Marketing Manager',
            department: 'Marketing',
            location: 'Mumbai',
            type: 'Full-time',
            experience: '5+ years'
        },
        {
            title: 'Supply Chain Analyst',
            department: 'Operations',
            location: 'Thane',
            type: 'Full-time',
            experience: '2+ years'
        }
    ];

    const benefits = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ), title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ), title: 'Learning & Development', description: 'Continuous learning opportunities and certifications'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ), title: 'Flexible Leave', description: 'Generous vacation policy and work-life balance'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ), title: 'Employee Discount', description: 'Exclusive discounts on Raymond products'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ), title: 'Performance Bonus', description: 'Annual bonuses based on performance'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ), title: 'Career Growth', description: 'Clear career paths and promotion opportunities'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Careers</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">Join the Raymond Family</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Build your career with India's most trusted fashion brand.
                            We're always looking for passionate individuals to join our team.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Why Join Us */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">Why Join Us?</h2>
                <div className="grid md:grid-cols-3 gap-5 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4">{benefit.icon}</span>
                            <h3 className="text-slate-900 font-bold mb-2">{benefit.title}</h3>
                            <p className="text-sm text-slate-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">Open Positions</h2>
                <div className="space-y-4 mb-12">
                    {openings.map((job, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#DA2439]/30 transition-all">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            {job.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {job.experience}
                                        </span>
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-[#DA2439] text-white text-sm font-semibold rounded-full hover:bg-[#b91d30] transition-all shadow-md hover:shadow-lg">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Don't see a fit */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center shadow-sm">
                    <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">Don't See a Perfect Fit?</h3>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        Send us your resume anyway! We're always looking for talented people to join the Raymond family.
                    </p>
                    <a
                        href="mailto:careers@raymond.com"
                        className="inline-block px-8 py-4 bg-[#DA2439] text-white font-semibold rounded-full hover:bg-[#b91d30] transition-all shadow-lg hover:shadow-xl"
                    >
                        Send Your Resume
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CareersPage;

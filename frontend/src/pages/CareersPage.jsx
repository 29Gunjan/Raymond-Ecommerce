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
        { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family' },
        { icon: '📚', title: 'Learning & Development', description: 'Continuous learning opportunities and certifications' },
        { icon: '🏖️', title: 'Flexible Leave', description: 'Generous vacation policy and work-life balance' },
        { icon: '👔', title: 'Employee Discount', description: 'Exclusive discounts on Raymond products' },
        { icon: '💰', title: 'Performance Bonus', description: 'Annual bonuses based on performance' },
        { icon: '🚀', title: 'Career Growth', description: 'Clear career paths and promotion opportunities' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-5xl">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-heading text-white mb-4">Join the Raymond Family</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Build your career with India's most trusted fashion brand.
                        We're always looking for passionate individuals to join our team.
                    </p>
                </div>

                {/* Why Join Us */}
                <h2 className="text-2xl font-heading text-white mb-6">Why Join Us?</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
                            <span className="text-3xl mb-3 block">{benefit.icon}</span>
                            <h3 className="text-white font-medium mb-1">{benefit.title}</h3>
                            <p className="text-sm text-gray-400">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-heading text-white mb-6">Open Positions</h2>
                <div className="space-y-4 mb-12">
                    {openings.map((job, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                        <span>{job.department}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                        <span>•</span>
                                        <span>{job.experience}</span>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Don't see a fit */}
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-heading text-white mb-2">Don't See a Perfect Fit?</h3>
                    <p className="text-gray-400 mb-4">
                        Send us your resume anyway! We're always looking for talented people.
                    </p>
                    <a href="mailto:careers@raymond.com" className="inline-block px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
                        Send Your Resume
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CareersPage;

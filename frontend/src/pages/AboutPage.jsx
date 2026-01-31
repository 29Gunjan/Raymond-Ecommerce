function AboutPage() {
    const milestones = [
        { year: '1925', title: 'Founded', description: 'Raymond was founded in Mumbai, India' },
        { year: '1958', title: 'First Mill', description: 'Opened our first manufacturing mill in Thane' },
        { year: '1980', title: 'Export Leader', description: 'Became India\'s largest exporter of worsted suiting' },
        { year: '2000', title: 'Retail Expansion', description: 'Launched The Raymond Shop retail chain' },
        { year: '2020', title: 'Digital Era', description: 'Launched e-commerce platform' },
    ];

    const values = [
        { icon: '✨', title: 'Quality', description: 'Uncompromising quality in every thread' },
        { icon: '🎨', title: 'Craftsmanship', description: 'Meticulous attention to detail' },
        { icon: '🌱', title: 'Sustainability', description: 'Committed to eco-friendly practices' },
        { icon: '💼', title: 'Innovation', description: 'Blending tradition with modern design' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-5xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">About Raymond</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Since 1925, Raymond has been synonymous with trust, quality, and style.
                        We are India's leading integrated worsted suiting manufacturer.
                    </p>
                </div>

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-heading text-white mb-4">Our Story</h2>
                        <p className="text-gray-400 mb-4">
                            What started as a small woolen mill in 1925 has today become India's largest
                            integrated manufacturer of worsted suiting fabric. Our journey of nearly a
                            century has been marked by innovation, quality, and an unwavering commitment
                            to excellence.
                        </p>
                        <p className="text-gray-400">
                            Raymond is not just a brand; it's a legacy that has dressed generations of
                            Indians. From classic suits to contemporary styles, we continue to define
                            what it means to be "The Complete Man."
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-8 border border-amber-500/30">
                        <div className="text-center">
                            <span className="text-6xl mb-4 block">🏆</span>
                            <h3 className="text-2xl font-heading text-white mb-2">99 Years</h3>
                            <p className="text-gray-400">of Trusted Excellence</p>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <h2 className="text-3xl font-heading text-white mb-8 text-center">Our Values</h2>
                <div className="grid md:grid-cols-4 gap-4 mb-16">
                    {values.map((value, index) => (
                        <div key={index} className="bg-[#12121a] border border-gray-800 rounded-xl p-6 text-center">
                            <span className="text-4xl mb-4 block">{value.icon}</span>
                            <h3 className="text-lg font-medium text-white mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-400">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <h2 className="text-3xl font-heading text-white mb-8 text-center">Our Journey</h2>
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-8">
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-6">
                                <div className="text-amber-500 font-bold text-xl w-20 flex-shrink-0">{milestone.year}</div>
                                <div>
                                    <h3 className="text-white font-medium">{milestone.title}</h3>
                                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                    <div className="text-center p-6">
                        <p className="text-3xl font-bold text-amber-500">1500+</p>
                        <p className="text-gray-400">Retail Stores</p>
                    </div>
                    <div className="text-center p-6">
                        <p className="text-3xl font-bold text-amber-500">50+</p>
                        <p className="text-gray-400">Countries</p>
                    </div>
                    <div className="text-center p-6">
                        <p className="text-3xl font-bold text-amber-500">10M+</p>
                        <p className="text-gray-400">Happy Customers</p>
                    </div>
                    <div className="text-center p-6">
                        <p className="text-3xl font-bold text-amber-500">99</p>
                        <p className="text-gray-400">Years of Legacy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;

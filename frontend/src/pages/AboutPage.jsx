function AboutPage() {
    const milestones = [
        { year: '1925', title: 'Founded', description: 'Raymond was founded in Mumbai, India' },
        { year: '1958', title: 'First Mill', description: 'Opened our first manufacturing mill in Thane' },
        { year: '1980', title: 'Export Leader', description: 'Became India\'s largest exporter of worsted suiting' },
        { year: '2000', title: 'Retail Expansion', description: 'Launched The Raymond Shop retail chain' },
        { year: '2020', title: 'Digital Era', description: 'Launched e-commerce platform' },
    ];

    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ), title: 'Quality', description: 'Uncompromising quality in every thread'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ), title: 'Craftsmanship', description: 'Meticulous attention to detail'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ), title: 'Sustainability', description: 'Committed to eco-friendly practices'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ), title: 'Innovation', description: 'Blending tradition with modern design'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-16">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h1 className="text-5xl md:text-6xl font-heading font-bold text-slate-900 mb-6">About Raymond</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Since 1925, Raymond has been synonymous with trust, quality, and style.
                        We are India's leading integrated worsted suiting manufacturer.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-4xl font-heading font-bold text-slate-900 mb-6">Our Story</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            What started as a small woolen mill in 1925 has today become India's largest
                            integrated manufacturer of worsted suiting fabric. Our journey of nearly a
                            century has been marked by innovation, quality, and an unwavering commitment
                            to excellence.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Raymond is not just a brand; it's a legacy that has dressed generations of
                            Indians. From classic suits to contemporary styles, we continue to define
                            what it means to be "The Complete Man."
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-10 border border-red-200 shadow-lg">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-[#DA2439] shadow-lg">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-4xl font-heading font-bold text-slate-900 mb-2">99 Years</h3>
                            <p className="text-slate-600 text-lg">of Trusted Excellence</p>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <h2 className="text-4xl font-heading font-bold text-slate-900 mb-10 text-center">Our Values</h2>
                <div className="grid md:grid-cols-4 gap-6 mb-20">
                    {values.map((value, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center text-slate-600">{value.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                            <p className="text-sm text-slate-500">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <h2 className="text-4xl font-heading font-bold text-slate-900 mb-10 text-center">Our Journey</h2>
                <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm mb-20">
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-8 items-start">
                                <div className="text-[#DA2439] font-bold text-2xl w-24 flex-shrink-0">{milestone.year}</div>
                                <div className="flex-1 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                                    <h3 className="text-slate-900 font-bold text-lg">{milestone.title}</h3>
                                    <p className="text-slate-500">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-900 rounded-3xl p-10 shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#DA2439]">1500+</p>
                            <p className="text-slate-400 mt-1">Retail Stores</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#DA2439]">50+</p>
                            <p className="text-slate-400 mt-1">Countries</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#DA2439]">10M+</p>
                            <p className="text-slate-400 mt-1">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#DA2439]">99</p>
                            <p className="text-slate-400 mt-1">Years of Legacy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;

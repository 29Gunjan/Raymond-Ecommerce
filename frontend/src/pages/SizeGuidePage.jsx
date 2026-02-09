import { Link } from 'react-router-dom';

function SizeGuidePage() {
    const mensSizes = [
        { size: 'XS', chest: '34-36', waist: '28-30', hip: '34-36' },
        { size: 'S', chest: '36-38', waist: '30-32', hip: '36-38' },
        { size: 'M', chest: '38-40', waist: '32-34', hip: '38-40' },
        { size: 'L', chest: '40-42', waist: '34-36', hip: '40-42' },
        { size: 'XL', chest: '42-44', waist: '36-38', hip: '42-44' },
        { size: 'XXL', chest: '44-46', waist: '38-40', hip: '44-46' },
    ];

    const shirtSizes = [
        { size: '38', neck: '14.5', chest: '38', sleeve: '32' },
        { size: '39', neck: '15', chest: '39', sleeve: '32.5' },
        { size: '40', neck: '15.5', chest: '40', sleeve: '33' },
        { size: '41', neck: '16', chest: '41', sleeve: '33.5' },
        { size: '42', neck: '16.5', chest: '42', sleeve: '34' },
        { size: '44', neck: '17', chest: '44', sleeve: '34.5' },
    ];

    const trouserSizes = [
        { size: '28', waist: '28', hip: '36', inseam: '30' },
        { size: '30', waist: '30', hip: '38', inseam: '30' },
        { size: '32', waist: '32', hip: '40', inseam: '32' },
        { size: '34', waist: '34', hip: '42', inseam: '32' },
        { size: '36', waist: '36', hip: '44', inseam: '32' },
        { size: '38', waist: '38', hip: '46', inseam: '32' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4" data-aos="fade-up">Size Guide</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        Find your perfect fit with our comprehensive size guide
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-slate-500 hover:text-[#DA2439] transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Size Guide</span>
                </nav>

                {/* How to Measure */}
                <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Measure</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Chest</h3>
                            <p className="text-sm text-slate-500">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Waist</h3>
                            <p className="text-sm text-slate-500">Measure around your natural waistline, keeping the tape comfortably loose.</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 bg-red-100 text-[#DA2439] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Hip</h3>
                            <p className="text-sm text-slate-500">Measure around the fullest part of your hips, about 8 inches below waist.</p>
                        </div>
                    </div>
                </section>

                {/* General Sizes */}
                <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Men's General Sizes (inches)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Size</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Chest</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Waist</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Hip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mensSizes.map((row, i) => (
                                    <tr key={row.size} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="py-4 px-4 font-semibold text-slate-900">{row.size}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.chest}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.waist}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.hip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Shirt Sizes */}
                <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Formal Shirt Sizes (inches)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Size</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Neck</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Chest</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Sleeve</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shirtSizes.map((row, i) => (
                                    <tr key={row.size} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="py-4 px-4 font-semibold text-slate-900">{row.size}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.neck}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.chest}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.sleeve}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Trouser Sizes */}
                <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Trouser Sizes (inches)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Size</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Waist</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Hip</th>
                                    <th className="py-4 px-4 font-bold text-slate-900 bg-slate-50">Inseam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trouserSizes.map((row, i) => (
                                    <tr key={row.size} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="py-4 px-4 font-semibold text-slate-900">{row.size}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.waist}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.hip}</td>
                                        <td className="py-4 px-4 text-slate-600">{row.inseam}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tips */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white" data-aos="fade-up">
                    <h2 className="text-2xl font-bold mb-6">Fit Tips</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-[#DA2439] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-300">If you're between sizes, we recommend sizing up for a more comfortable fit.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-[#DA2439] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-300">Our suits come in Slim Fit, Regular Fit, and Classic Fit options.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-[#DA2439] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-300">For custom tailoring, visit any Raymond store for precise measurements.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-[#DA2439] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-300">First-time buyers get free alterations at any Raymond store.</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default SizeGuidePage;

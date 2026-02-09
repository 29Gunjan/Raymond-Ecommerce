import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-slate-500 hover:text-[#DA2439] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

export default Breadcrumb;

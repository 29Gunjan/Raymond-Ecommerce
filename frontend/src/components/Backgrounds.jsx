import { useEffect, useRef } from 'react';

// Animated Gradient Background
export function GradientBackground({ children, className = '' }) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Particles Background
export function ParticlesBackground({ count = 50, className = '' }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-float-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                    }}
                />
            ))}
        </div>
    );
}

// Grid Pattern Background
export function GridBackground({ children, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Spotlight Effect
export function SpotlightBackground({ children, className = '' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.setProperty('--spotlight-x', `${x}px`);
            container.style.setProperty('--spotlight-y', `${y}px`);
        };

        container.addEventListener('mousemove', handleMouseMove);
        return () => container.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                '--spotlight-x': '50%',
                '--spotlight-y': '50%',
            }}
        >
            <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at var(--spotlight-x) var(--spotlight-y), rgba(217, 119, 6, 0.1), transparent 40%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Noise Texture Overlay
export function NoiseOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
        />
    );
}

// Aurora Background
export function AuroraBackground({ children, className = '' }) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-green-500/40 via-cyan-500/20 to-transparent blur-3xl animate-aurora"
                        style={{ animationDelay: '0s' }}
                    />
                    <div
                        className="absolute top-0 right-1/4 w-1/2 h-2/3 bg-gradient-to-b from-purple-500/30 via-pink-500/20 to-transparent blur-3xl animate-aurora"
                        style={{ animationDelay: '2s' }}
                    />
                    <div
                        className="absolute top-0 left-1/2 w-1/3 h-1/2 bg-gradient-to-b from-blue-500/30 via-indigo-500/20 to-transparent blur-3xl animate-aurora"
                        style={{ animationDelay: '4s' }}
                    />
                </div>
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Mesh Gradient Background
export function MeshGradientBackground({ children, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(at 40% 20%, rgba(217, 119, 6, 0.15) 0px, transparent 50%),
                        radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
                        radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
                        radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.1) 0px, transparent 50%),
                        radial-gradient(at 80% 100%, rgba(251, 191, 36, 0.1) 0px, transparent 50%)
                    `,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export default {
    GradientBackground,
    ParticlesBackground,
    GridBackground,
    SpotlightBackground,
    NoiseOverlay,
    AuroraBackground,
    MeshGradientBackground,
};

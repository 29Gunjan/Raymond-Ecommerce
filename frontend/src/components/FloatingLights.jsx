import { useEffect, useRef } from 'react';
import './FloatingLights.css';

/**
 * FloatingLights Component
 * Creates animated ambient light orbs that float in the background
 * Adds premium depth and atmosphere to the website
 */
const FloatingLights = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Add subtle mouse parallax effect
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 20;
            const yPercent = (clientY / innerHeight - 0.5) * 20;

            const lights = container.querySelectorAll('.floating-light');
            lights.forEach((light, index) => {
                const factor = (index + 1) * 0.15;
                light.style.transform = `translate(${xPercent * factor}px, ${yPercent * factor}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="floating-lights-container">
            {/* Primary red glow - top left */}
            <div className="floating-light floating-light-1" />

            {/* Secondary gold glow - bottom right */}
            <div className="floating-light floating-light-2" />

            {/* Tertiary subtle glow - center */}
            <div className="floating-light floating-light-3" />

            {/* Accent glow - top right */}
            <div className="floating-light floating-light-4" />

            {/* Deep accent - bottom left */}
            <div className="floating-light floating-light-5" />
        </div>
    );
};

export default FloatingLights;

import { useState } from 'react';

function ImageZoom({ src, alt, className = '' }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        if (!isZoomed) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
        setPosition({ x: 50, y: 50 });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-zoom-in ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${position.x}% ${position.y}%`,
                }}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
                }}
            />
            {isZoomed && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                    Move to zoom
                </div>
            )}
        </div>
    );
}

export default ImageZoom;

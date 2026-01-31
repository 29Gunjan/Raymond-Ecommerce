// ReactBits-style Animation Components
// Implemented using framer-motion for React

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';

// ================================
// TEXT ANIMATIONS
// ================================

// SplitText - Animates each character individually
export function SplitText({
    text,
    className = '',
    delay = 0,
    staggerDelay = 0.05,
    direction = 'up'
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const chars = text.split('');

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
            x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                delay: delay / 1000 + i * staggerDelay,
                duration: 0.4,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        }),
    };

    return (
        <span ref={ref} className={`inline-block ${className}`}>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={variants}
                    className="inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}

// BlurText - Text that animates with blur effect
export function BlurText({
    text,
    className = '',
    delay = 0,
    animateBy = 'words', // 'words' or 'letters'
    direction = 'up'
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const parts = animateBy === 'words' ? text.split(' ') : text.split('');

    const variants = {
        hidden: {
            opacity: 0,
            filter: 'blur(10px)',
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
        },
        visible: (i) => ({
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                delay: delay / 1000 + i * 0.08,
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    return (
        <span ref={ref} className={`inline ${className}`}>
            {parts.map((part, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={variants}
                    className="inline-block"
                >
                    {part}{animateBy === 'words' && i < parts.length - 1 ? '\u00A0' : ''}
                </motion.span>
            ))}
        </span>
    );
}

// GradientText - Text with animated gradient
export function GradientText({
    text,
    colors = ['#d97706', '#f59e0b', '#fbbf24'],
    className = '',
    animate = true
}) {
    const gradientStyle = {
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: animate ? '200% 100%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: animate ? 'gradient-shift 3s ease infinite' : 'none',
    };

    return (
        <span className={className} style={gradientStyle}>
            {text}
        </span>
    );
}

// ShinyText - Text with shine animation
export function ShinyText({ text, className = '', speed = '2s' }) {
    return (
        <span
            className={`relative inline-block ${className}`}
            style={{
                background: 'linear-gradient(90deg, currentColor 20%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.8) 60%, currentColor 80%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: `shimmer ${speed} linear infinite`,
            }}
        >
            {text}
        </span>
    );
}

// CountUp - Animated number counter
export function CountUp({
    from = 0,
    to,
    duration = 2,
    separator = ',',
    className = ''
}) {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = Date.now();
        const difference = to - from;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(from + difference * easeProgress);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, from, to, duration]);

    const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return <span ref={ref} className={className}>{formattedCount}</span>;
}

// ================================
// INTERACTIVE EFFECTS
// ================================

// ClickSpark - Spark effect on click
export function ClickSpark({
    children,
    sparkColor = '#f59e0b',
    sparkCount = 10,
    sparkRadius = 40
}) {
    const [sparks, setSparks] = useState([]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            angle: (360 / sparkCount) * i + Math.random() * 20,
        }));

        setSparks(prev => [...prev, ...newSparks]);

        setTimeout(() => {
            setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
        }, 600);
    };

    return (
        <div className="relative inline-block" onClick={handleClick}>
            {children}
            <AnimatePresence>
                {sparks.map(spark => (
                    <motion.span
                        key={spark.id}
                        initial={{
                            opacity: 1,
                            scale: 1,
                            x: spark.x,
                            y: spark.y,
                        }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            x: spark.x + Math.cos(spark.angle * Math.PI / 180) * sparkRadius,
                            y: spark.y + Math.sin(spark.angle * Math.PI / 180) * sparkRadius,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute pointer-events-none"
                        style={{
                            width: 6,
                            height: 6,
                            backgroundColor: sparkColor,
                            borderRadius: '50%',
                            boxShadow: `0 0 6px ${sparkColor}`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// StarBorder - Animated star border effect
export function StarBorder({
    children,
    color = '#f59e0b',
    speed = '3s',
    className = ''
}) {
    return (
        <div className={`relative group ${className}`}>
            <div
                className="absolute -inset-0.5 rounded-lg opacity-75 group-hover:opacity-100 blur-sm transition-opacity"
                style={{
                    background: `linear-gradient(90deg, ${color}, transparent, ${color})`,
                    backgroundSize: '200% 100%',
                    animation: `shimmer ${speed} linear infinite`,
                }}
            />
            <div className="relative bg-inherit rounded-lg">
                {children}
            </div>
        </div>
    );
}

// Bounce - Bounce animation on mount
export function Bounce({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{
                delay: delay / 1000,
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// FadeContent - Fade in with optional blur
export function FadeContent({
    children,
    blur = false,
    duration = 500,
    delay = 0,
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                filter: blur ? 'blur(10px)' : 'blur(0px)'
            }}
            animate={isInView ? {
                opacity: 1,
                filter: 'blur(0px)'
            } : {}}
            transition={{
                delay: delay / 1000,
                duration: duration / 1000,
                ease: 'easeOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// AnimatedContent - Slide in animation
export function AnimatedContent({
    children,
    direction = 'vertical',
    distance = 30,
    delay = 0,
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const initial = {
        opacity: 0,
        y: direction === 'vertical' ? distance : 0,
        x: direction === 'horizontal' ? distance : 0,
    };

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{
                delay: delay / 1000,
                duration: 0.6,
                ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ================================
// BACKGROUND EFFECTS
// ================================

// Particles - Floating particles background
export function Particles({
    particleCount = 50,
    particleColors = ['#d97706', '#f59e0b', '#ffffff'],
    particleSize = 3,
    className = ''
}) {
    const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * particleSize + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
    }));

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

// ================================
// UTILITY ANIMATIONS
// ================================

// ScrollReveal - Animate when scrolls into view
export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    distance = 30,
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { y: distance, x: 0 };
            case 'down': return { y: -distance, x: 0 };
            case 'left': return { x: distance, y: 0 };
            case 'right': return { x: -distance, y: 0 };
            case 'zoom': return { scale: 0.9, y: 0, x: 0 };
            default: return { y: distance, x: 0 };
        }
    };

    const initial = { opacity: 0, ...getInitialPosition() };
    const animate = { opacity: 1, y: 0, x: 0, scale: 1 };

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={isInView ? animate : initial}
            transition={{
                delay: delay / 1000,
                duration: 0.6,
                ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// StaggerReveal - Staggered children animation
export function StaggerReveal({
    children,
    stagger = 100,
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger / 1000,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className={className}
        >
            {Array.isArray(children) ? children.map((child, index) => (
                <motion.div key={index} variants={childVariants}>
                    {child}
                </motion.div>
            )) : (
                <motion.div variants={childVariants}>
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
}

// FloatingElement - Gentle floating animation
export function FloatingElement({
    children,
    amplitude = 10,
    duration = 3,
    className = ''
}) {
    return (
        <motion.div
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default {
    SplitText,
    BlurText,
    GradientText,
    ShinyText,
    CountUp,
    ClickSpark,
    StarBorder,
    Bounce,
    FadeContent,
    AnimatedContent,
    Particles,
    ScrollReveal,
    StaggerReveal,
    FloatingElement,
};

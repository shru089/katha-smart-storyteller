import React from 'react';

interface ChipProps {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    variant?: 'default' | 'category' | 'emotion' | 'music';
    color?: string; // Hex override
    className?: string; // Additional CSS classes
}

export const Chip: React.FC<ChipProps> = ({
    label,
    icon,
    isActive = false,
    onClick,
    variant = 'default',
    color,
    className = ''
}) => {
    const baseStyles = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm border border-transparent";

    const variants = {
        default: isActive ? "bg-earth text-sand border-white/10" : "bg-white/5 text-sand/60 hover:bg-white/10 border-white/5",
        category: isActive ? "bg-saffron text-white shadow-glow" : "bg-white/5 text-sand/60 hover:bg-white/10 border-white/5",
        emotion: "bg-white/10 backdrop-blur-sm text-sand border-white/10 shadow-soft",
        music: "bg-black/60 backdrop-blur-sm text-white border-white/20"
    };

    const style = color ? { backgroundColor: color, color: '#fff' } : {};

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${isActive ? 'shadow-md scale-105' : ''} ${className}`}
            onClick={onClick}
            style={style}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
};


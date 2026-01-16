import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";

    const variants = {
        primary: "bg-saffron text-white shadow-[0_0_20px_rgba(236,109,19,0.4)] hover:shadow-[0_0_30px_rgba(236,109,19,0.6)] active:scale-[0.98]",
        secondary: "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10",
        outline: "border-2 border-saffron/50 text-saffron hover:bg-saffron/10",
        ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                ${baseStyles} 
                ${variants[variant]} 
                ${sizes[size]} 
                ${fullWidth ? 'w-full' : ''} 
                ${className}
            `}
            {...props}
        >
            {icon && <span className="text-xl">{icon}</span>}
            {children}
        </motion.button>
    );
};

import { Link } from "react-router-dom";
import React from "react";

interface LinkButtonProps {
    to: string;
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
    className?: string;
}

export function LinkButton({
    to,
    variant = 'primary',
    children,
    className = "",
}: LinkButtonProps) {
    const variants = {
        primary: 'bg-[#ABD43A] text-black',
        secondary: 'bg-[#333333] text-white',
        outline: 'border border-blue-500 text-blue-500',
    };

    const baseClasses = "inline-flex items-center justify-center px-4 py-3 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50";

    const selectedVariant = variants[variant];

    return (
        <Link to={to} className={`${baseClasses} ${selectedVariant} ${className}`}>{children}</Link>
    );
}
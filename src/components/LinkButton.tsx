import { Link } from "react-router-dom";
import React from "react";

interface LinkButtonProps {
    to: string;
    variant?: 'primary' | 'secondary' | 'inverted' | 'outline';
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
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        inverted: 'bg-neutral text-neutral-foreground',
        outline: 'border border-neutral/20 text-neutral bg-transparent',
    };

    const baseClasses = "inline-flex items-center justify-center px-4 py-3 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50";

    const selectedVariant = variants[variant];

    return (
        <Link to={to} className={`${baseClasses} ${selectedVariant} ${className}`}>{children}</Link>
    );
}
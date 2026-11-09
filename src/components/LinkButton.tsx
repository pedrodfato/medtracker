import { Link } from "react-router-dom";
import React from "react";
import { buttonClasses, type ButtonVariant } from "./buttonStyles";

interface LinkButtonProps {
    to: string;
    variant?: ButtonVariant;
    children: React.ReactNode;
    className?: string;
}

export function LinkButton({ to, variant = 'primary', children, className = "" }: LinkButtonProps) {
    return <Link to={to} className={buttonClasses(variant, className)}>{children}</Link>;
}
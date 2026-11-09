import React from "react";
import { buttonClasses, type ButtonVariant } from "./buttonStyles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
    className?: string;
}

export function Button({ type = "button", variant = 'primary', children, className = "", ...rest }: ButtonProps) {
    return (
        <button type={type} className={buttonClasses(variant, className)} {...rest}>{children}</button>
    );
}
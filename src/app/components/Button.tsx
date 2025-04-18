import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    variant?: 'primary' | 'success' | 'error' | 'warning'
    outline?: boolean
    loading?: boolean
};

const baseStyles = 'font-semibold py-2 px-4 rounded-md shadow transition duration-200 cursor-pointer';

const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600',
    success: 'bg-green-600 hover:bg-green-700 text-white border border-green-600',
    error: 'bg-red-600 hover:bg-red-700 text-white border border-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500',
};

const outlineVariantStyles = {
    primary: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50',
    success: 'bg-transparent text-green-600 border border-green-600 hover:bg-green-50',
    error: 'bg-transparent text-red-600 border border-red-600 hover:bg-red-50',
    warning: 'bg-transparent text-yellow-600 border border-yellow-600 hover:bg-yellow-100',
};

const disabledStyles = 'opacity-50 cursor-not-allowed';

export default function Button ({
    children,
    className,
    variant = "primary",
    outline = false,
    loading = false,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = loading || disabled;
    const style = outline ? outlineVariantStyles[variant] : variantStyles[variant];

    return (
        <button
            className={clsx(baseStyles, style, isDisabled && disabledStyles, className)}
            disabled={isDisabled}
            {...props}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
}
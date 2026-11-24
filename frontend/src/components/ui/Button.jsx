import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    // Primary Purple Button with white text, darkens on hover
    primary: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-sm hover:shadow focus:ring-purple-500 active:scale-[0.98]',
    
    // Secondary Light Purple Button with crisp dark purple text, darkens on hover
    secondary: 'bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 hover:text-purple-900 border border-purple-200 hover:border-purple-300 shadow-sm focus:ring-purple-400 active:scale-[0.98]',
    
    // Pure White Button (for dark or colored banners like the welcome hero)
    white: 'bg-white hover:bg-gray-100 active:bg-gray-200 text-purple-700 hover:text-purple-900 shadow-md border border-gray-100 focus:ring-white active:scale-[0.98]',
    
    // Deep Indigo/Purple for contrast on light or hero backgrounds
    dark: 'bg-purple-900/90 hover:bg-purple-950 active:bg-black text-white border border-white/20 hover:border-white/40 shadow-md focus:ring-purple-400 active:scale-[0.98]',
    
    // Subtle Ghost Button
    ghost: 'bg-transparent hover:bg-purple-50 active:bg-purple-100 text-gray-700 hover:text-purple-700 focus:ring-purple-300',
    
    // Danger Red Button
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm focus:ring-rose-500 active:scale-[0.98]',
    
    // Outline Purple
    outline: 'bg-transparent border border-purple-300 hover:border-purple-600 text-purple-700 hover:text-purple-900 hover:bg-purple-50 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const selectedVariantClass = variants[variant] || variants.primary;

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${selectedVariantClass} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0 text-current">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0 text-current">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

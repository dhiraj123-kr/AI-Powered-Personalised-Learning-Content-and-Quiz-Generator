import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-purple-100 text-purple-700 border border-purple-200',
    beginner: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
    advanced: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-rose-100 text-rose-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-blue-100 text-blue-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const normalizedVariant = variants[variant.toLowerCase()] || variants.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full uppercase tracking-wider capitalize ${normalizedVariant} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

import React from 'react';

export default function ProgressBar({
  progress = 0,
  max = 100,
  color = 'purple',
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min(Math.max(Math.round((progress / max) * 100), 0), 100);

  const colors = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-gray-600">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color] || colors.purple}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

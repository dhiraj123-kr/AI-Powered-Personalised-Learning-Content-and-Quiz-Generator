import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'purple',
  change = null,
  subtext = null,
}) {
  const colorMap = {
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-100' },
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {(change || subtext) && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {change && <span className="font-semibold text-emerald-600">{change}</span>}
              {subtext && <span>{subtext}</span>}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} shadow-sm ring-4 ${scheme.ring}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}

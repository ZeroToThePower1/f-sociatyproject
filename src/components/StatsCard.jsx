// /app/src/components/StatsCard.jsx
import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, badge, color = 'purple' }) {
  const colorMap = {
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      accent: 'border-l-purple-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      accent: 'border-l-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accent: 'border-l-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accent: 'border-l-amber-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      accent: 'border-l-blue-600'
    }
  };

  const current = colorMap[color] || colorMap.purple;

  return (
    <div className={`stats-card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${current.bg} ${current.text}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${current.iconBg} ${current.iconColor} transition-transform group-hover:scale-110 duration-200`}>
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {subtitle && (
        <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-100">
          {subtitle}
        </div>
      )}
    </div>
  );
}
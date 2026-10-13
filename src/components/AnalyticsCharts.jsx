// src/components/AnalyticsCharts.jsx
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export default function AnalyticsCharts({ courses = [] }) {
  // ---- Progress breakdown (Pie) — derive from courses ----
  const progressPie = useMemo(() => {
    const completed = courses.filter((c) => c.status === 'completed').length;
    const inProgress = courses.filter((c) => c.status === 'in-progress').length;
    const notStarted = courses.length - completed - inProgress;

    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: Math.max(0, notStarted) },
    ].filter((d) => d.value > 0);
  }, [courses]);

  // ---- Courses by Category (Bar) ----
  const categoryBar = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      const cat = c.category || 'Other';
      if (!map[cat]) map[cat] = { category: cat, count: 0, completed: 0 };
      map[cat].count += 1;
      if (c.status === 'completed') map[cat].completed += 1;
    });
    return Object.values(map);
  }, [courses]);

  // ---- Difficulty distribution (Bar) ----
  const difficultyBar = useMemo(() => {
    const map = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    courses.forEach((c) => {
      if (map[c.difficulty] !== undefined) map[c.difficulty] += 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [courses]);

  // ---- Top Recommendation Scores (Area) ----
  const scoreArea = useMemo(() => {
    return [...courses]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10)
      .map((c, idx) => ({
        rank: idx + 1,
        score: c.score || 0,
        name: c.title?.slice(0, 15) + '...',
      }));
  }, [courses]);

  // Empty state
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-2xl">
          📊
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          No analytics yet
        </h3>
        <p className="text-xs text-slate-500">
          Start a course to see your learning insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              📊
            </span>
            Learning Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time insights from your learning journey
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Progress Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover-lift">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Progress Breakdown
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">
            Your course completion status
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={progressPie}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                animationBegin={100}
                animationDuration={800}
              >
                {progressPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === 'Completed'
                        ? '#059669'
                        : entry.name === 'In Progress'
                        ? '#7c3aed'
                        : '#cbd5e1'
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Category Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover-lift">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Courses by Category
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">
            Catalog distribution across topics
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                fill="#7c3aed"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="completed"
                fill="#059669"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
              Total
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
              Completed
            </span>
          </div>
        </div>

        {/* 3. Difficulty Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover-lift">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Difficulty Distribution
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">
            Courses split by difficulty level
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={difficultyBar} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="value"
                fill="#4f46e5"
                radius={[0, 8, 8, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Top Scores Area */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover-lift">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Top Recommendation Scores
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">
            Your top 10 recommended courses by match score
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={scoreArea}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="rank"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Rank #${label}`}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
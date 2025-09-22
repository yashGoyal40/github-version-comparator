'use client';

import { GitCommit, FileText, Plus, Minus } from 'lucide-react';

interface StatsGridProps {
  stats: {
    commits: number;
    filesChanged: number;
    insertions: number;
    deletions: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: 'Commits',
      value: stats.commits,
      icon: GitCommit,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      label: 'Files Changed',
      value: stats.filesChanged,
      icon: FileText,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    {
      label: 'Lines Added',
      value: `+${stats.insertions}`,
      icon: Plus,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700'
    },
    {
      label: 'Lines Removed',
      value: `-${stats.deletions}`,
      icon: Minus,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 dark:bg-gray-800">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`${item.bgColor} ${item.borderColor} border rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`${item.color} mb-3`}>
              <Icon className="h-8 w-8 mx-auto" />
            </div>
            <div className={`text-3xl font-bold ${item.color} mb-2`}>
              {item.value}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

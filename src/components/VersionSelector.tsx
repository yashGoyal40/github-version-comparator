'use client';

import { GitBranch, ArrowRight } from 'lucide-react';

interface VersionSelectorProps {
  versions: string[];
  fromVersion: string;
  toVersion: string;
  onFromVersionChange: (version: string) => void;
  onToVersionChange: (version: string) => void;
  onCompare: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function VersionSelector({
  versions,
  fromVersion,
  toVersion,
  onFromVersionChange,
  onToVersionChange,
  onCompare,
  loading,
  disabled
}: VersionSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Select Versions to Compare
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Choose two versions to see what changed between them
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 md:items-end">
        {/* From Version */}
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Version
          </label>
          <div className="relative">
            <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={fromVersion}
              onChange={(e) => onFromVersionChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select version...</option>
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:block">
          <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>

        {/* To Version */}
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Version
          </label>
          <div className="relative">
            <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={toVersion}
              onChange={(e) => onToVersionChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select version...</option>
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex-shrink-0 self-end">
          <button
            onClick={onCompare}
            disabled={disabled || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? 'Comparing...' : 'Compare Versions'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { BarChart3, FileText, GitCommit, Eye, ArrowRight } from 'lucide-react';

interface Commit {
  hash: string;
  message: string;
  date: string;
  author: string;
}

interface FileChange {
  file: string;
  changes: number;
  insertions: number;
  deletions: number;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  patch?: string;
}

interface ComparisonResult {
  fromVersion: string;
  toVersion: string;
  commits: Commit[];
  files: FileChange[];
  stats: {
    commits: number;
    filesChanged: number;
    insertions: number;
    deletions: number;
  };
}

interface OverviewProps {
  comparison: ComparisonResult;
  onFileSelect: (file: string) => void;
  onSwitchToFiles?: () => void;
}

export default function Overview({ comparison, onFileSelect, onSwitchToFiles }: OverviewProps) {
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['go'].includes(extension || '')) return '🐹';
    if (['js', 'ts', 'jsx', 'tsx'].includes(extension || '')) return '📜';
    if (['json', 'yaml', 'yml'].includes(extension || '')) return '📋';
    if (['md'].includes(extension || '')) return '📝';
    if (['yml', 'yaml'].includes(extension || '')) return '⚙️';
    if (['html', 'htm'].includes(extension || '')) return '🌐';
    if (['css', 'scss', 'sass'].includes(extension || '')) return '🎨';
    
    return '📄';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'modified': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'removed': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'renamed': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'added': return 'Added';
      case 'modified': return 'Modified';
      case 'removed': return 'Removed';
      case 'renamed': return 'Renamed';
      default: return 'Modified';
    }
  };

  const topFiles = comparison.files
    .sort((a, b) => (b.insertions + b.deletions) - (a.insertions + a.deletions))
    .slice(0, 5);

  const recentCommits = comparison.commits.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-800/30 rounded-lg">
              <GitCommit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Commits</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{comparison.stats.commits}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-200 dark:bg-green-800/30 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Files Changed</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{comparison.stats.filesChanged}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-200 dark:bg-purple-800/30 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Net Changes</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                +{comparison.stats.insertions - comparison.stats.deletions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Version Comparison */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Version Comparison</h3>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{comparison.fromVersion}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">From</div>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{comparison.toVersion}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">To</div>
          </div>
        </div>
      </div>

      {/* Top Changed Files */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Most Changed Files</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Top 5 by changes</span>
        </div>
        <div className="space-y-3">
          {topFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => onFileSelect(file.file)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-lg">{getFileIcon(file.file)}</span>
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate flex-1">
                  {file.file}
                </code>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                  {getStatusLabel(file.status)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 ml-4">
                {file.insertions > 0 && (
                  <span className="text-green-600 dark:text-green-400 font-medium">+{file.insertions}</span>
                )}
                {file.deletions > 0 && (
                  <span className="text-red-600 dark:text-red-400 font-medium">-{file.deletions}</span>
                )}
                <Eye className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Commits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Commits</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Latest 5 commits</span>
        </div>
        <div className="space-y-3">
          {recentCommits.map((commit, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <GitCommit className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <code className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                    {commit.hash}
                  </code>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(commit.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{commit.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">by {commit.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onFileSelect(comparison.files[0]?.file || '')}
            className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            disabled={comparison.files.length === 0}
          >
            <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View First File Diff</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {comparison.files[0]?.file || 'No files available'}
              </p>
            </div>
          </button>
          
          <button
            onClick={onSwitchToFiles}
            className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left w-full"
            disabled={!onSwitchToFiles}
          >
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View All Files</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch to Files tab to see all changes
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

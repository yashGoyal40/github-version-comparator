'use client';

import { GitCommit, User, Calendar } from 'lucide-react';

interface Commit {
  hash: string;
  message: string;
  date: string;
  author: string;
}

interface CommitsListProps {
  commits: Commit[];
}

export default function CommitsList({ commits }: CommitsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Commit History</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {commits.length} commits
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3">
        {commits.map((commit, index) => (
          <div
            key={commit.hash}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <GitCommit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <code className="text-sm font-mono bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                    {commit.hash}
                  </code>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-3 w-3" />
                    <span>{commit.author}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(commit.date)}</span>
                  </div>
                </div>
                
                <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                  {commit.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commits.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <GitCommit className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No commits found between these versions</p>
        </div>
      )}
    </div>
  );
}

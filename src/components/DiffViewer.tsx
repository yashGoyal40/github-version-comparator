'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { useGitHub } from '@/hooks/useGitHub';

interface DiffLine {
  type: 'added' | 'removed' | 'context';
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface FileDiff {
  file: string;
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
  };
}

interface DiffViewerProps {
  fromVersion: string;
  toVersion: string;
  selectedFile: string | null;
  repository: {
    owner: string;
    repo: string;
  };
  token?: string;
}

export default function DiffViewer({ fromVersion, toVersion, selectedFile, repository, token }: DiffViewerProps) {
  const [diff, setDiff] = useState<FileDiff | null>(null);
  const { loading, error, getFileDiff } = useGitHub(token);

  useEffect(() => {
    if (selectedFile) {
      fetchDiff();
    } else {
      setDiff(null);
      setError(null);
    }
  }, [selectedFile, fromVersion, toVersion]);

  const fetchDiff = async () => {
    if (!selectedFile) return;

    try {
      const patch = await getFileDiff(repository.owner, repository.repo, fromVersion, toVersion, selectedFile);
      
      // Parse the patch to extract diff lines
      const lines: DiffLine[] = [];
      let additions = 0;
      let deletions = 0;

      if (patch) {
        const patchLines = patch.split('\n');
        let lineNumber = 1;

        for (const line of patchLines) {
          if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
            // Skip header lines
            continue;
          }

          let type: 'added' | 'removed' | 'context' = 'context';
          let content = line;

          if (line.startsWith('+')) {
            type = 'added';
            content = line.substring(1);
            additions++;
          } else if (line.startsWith('-')) {
            type = 'removed';
            content = line.substring(1);
            deletions++;
          }

          lines.push({
            type,
            content,
            lineNumber: lineNumber++,
          });
        }
      }

      setDiff({
        file: selectedFile,
        lines,
        stats: {
          additions,
          deletions,
        },
      });
    } catch (err) {
      console.error('Error fetching diff:', err);
      // Error is already set by the hook
    }
  };

  const getLineNumber = (line: DiffLine, index: number) => {
    if (line.type === 'added') return line.newLineNumber || index + 1;
    if (line.type === 'removed') return line.oldLineNumber || index + 1;
    return line.lineNumber || index + 1;
  };

  if (!selectedFile) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium mb-2">Select a file to view changes</p>
        <p className="text-sm">Choose a file from the Files tab to see the detailed diff</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
        <p className="text-gray-600 dark:text-gray-300">Loading diff...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading diff</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!diff) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p>No diff available for this file</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-white dark:text-gray-100" />
            <span className="font-mono text-sm text-white dark:text-gray-100">{diff.file}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-400 dark:text-green-300">+{diff.stats.additions}</span>
            <span className="text-red-400 dark:text-red-300">-{diff.stats.deletions}</span>
          </div>
        </div>
      </div>

      {/* Diff Content */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-b-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto diff-scrollbar">
          <div className="font-mono text-sm">
            {diff.lines.map((line, index) => {
              const lineNumber = getLineNumber(line, index);
              
              return (
                <div
                  key={index}
                  className={`flex ${
                    line.type === 'added'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300'
                      : line.type === 'removed'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="w-16 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex-shrink-0">
                    {lineNumber}
                  </div>
                  <div className="flex-1 px-2 py-1 whitespace-pre-wrap">
                    {line.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
        <span>
          {diff.lines.length} lines • {diff.stats.additions} additions • {diff.stats.deletions} deletions
        </span>
        <span>
          {fromVersion} → {toVersion}
        </span>
      </div>
    </div>
  );
}

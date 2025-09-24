'use client';

import { useState, useEffect } from 'react';
import { X, GitCommit, User, Calendar, FileText, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { useGitHub } from '@/hooks/useGitHub';

interface CommitDetail {
  hash: string;
  message: string;
  date: string;
  author: string;
  files: Array<{
    file: string;
    changes: number;
    insertions: number;
    deletions: number;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    patch?: string;
  }>;
}

interface CommitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commit: CommitDetail | null;
  repository: {
    owner: string;
    repo: string;
  };
  token?: string;
}

export default function CommitDetailModal({ isOpen, onClose, commit, repository, token }: CommitDetailModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileDiff, setFileDiff] = useState<string | null>(null);
  const [commitDetails, setCommitDetails] = useState<CommitDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const { loading, error, getCommitDiff, compareVersions } = useGitHub(token);

  useEffect(() => {
    if (isOpen && commit) {
      // Reset state when modal opens
      setSelectedFile(null);
      setFileDiff(null);
      setCommitDetails(null);
      setModalError(null);
      fetchCommitDetails();
    }
  }, [isOpen, commit]);

  useEffect(() => {
    if (isOpen && commitDetails && selectedFile) {
      fetchFileDiff();
    }
  }, [isOpen, commitDetails, selectedFile]);

  const fetchCommitDetails = async () => {
    if (!commit) return;

    setIsLoading(true);
    setModalError(null);

    try {
      // Fetch the actual commit details from GitHub API
      const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.repo}/commits/${commit.hash}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Version-Comparator',
          ...(token && { 'Authorization': `token ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch commit details: ${response.status}`);
      }

      const commitData = await response.json();
      
      const commitDetails: CommitDetail = {
        hash: commitData.sha?.substring(0, 7) || commit.hash,
        message: commitData.commit?.message || commit.message,
        date: commitData.commit?.author?.date || commit.date,
        author: commitData.author?.login || commitData.commit?.author?.name || commit.author,
        files: (commitData.files || []).map((file: any) => ({
          file: file.filename || 'unknown',
          changes: file.changes || 0,
          insertions: file.additions || 0,
          deletions: file.deletions || 0,
          status: file.status || 'modified',
          patch: file.patch || ''
        }))
      };
      
      setCommitDetails(commitDetails);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching commit details:', err);
      setModalError(err instanceof Error ? err.message : 'Failed to fetch commit details');
      // Fallback to basic commit info if API fails
      const fallbackCommitDetails: CommitDetail = {
        hash: commit.hash,
        message: commit.message,
        date: commit.date,
        author: commit.author,
        files: []
      };
      setCommitDetails(fallbackCommitDetails);
      setIsLoading(false);
    }
  };

  const fetchFileDiff = async () => {
    if (!commitDetails || !selectedFile) return;

    try {
      // Find the file in the commit details
      const file = commitDetails.files.find(f => f.file === selectedFile);
      
      if (!file) {
        console.error('File not found in commit details:', selectedFile);
        setFileDiff(null);
        return;
      }

      // Use the patch from the commit data
      setFileDiff(file.patch || '');
    } catch (err) {
      console.error('Error fetching file diff:', err);
      setFileDiff(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'added':
        return { label: 'Added', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: Plus };
      case 'modified':
        return { label: 'Modified', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: FileText };
      case 'removed':
        return { label: 'Removed', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', icon: Minus };
      case 'renamed':
        return { label: 'Renamed', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: FileText };
      default:
        return { label: 'Modified', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: FileText };
    }
  };

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  };

  const getFileIcon = (filename: string) => {
    const extension = getFileExtension(filename).toLowerCase();
    
    if (['go'].includes(extension)) return '🐹';
    if (['js', 'ts', 'jsx', 'tsx'].includes(extension)) return '📜';
    if (['json', 'yaml', 'yml'].includes(extension)) return '📋';
    if (['md'].includes(extension)) return '📝';
    if (['yml', 'yaml'].includes(extension)) return '⚙️';
    if (['html', 'htm'].includes(extension)) return '🌐';
    if (['css', 'scss', 'sass'].includes(extension)) return '🎨';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) return '🖼️';
    
    return '📄';
  };

  const parseDiff = (patch: string) => {
    const lines = patch.split('\n');
    const diffLines: Array<{
      type: 'added' | 'removed' | 'context';
      content: string;
      lineNumber?: number;
    }> = [];

    let lineNumber = 1;
    for (const line of lines) {
      if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
        continue;
      }

      let type: 'added' | 'removed' | 'context' = 'context';
      let content = line;

      if (line.startsWith('+')) {
        type = 'added';
        content = line.substring(1);
      } else if (line.startsWith('-')) {
        type = 'removed';
        content = line.substring(1);
      }

      diffLines.push({
        type,
        content,
        lineNumber: lineNumber++,
      });
    }

    return diffLines;
  };

  if (!isOpen || !commit) return null;

  // Show loading state
  if (isLoading && !commitDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GitCommit className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Commit Details</h3>
              <p className="text-gray-600 dark:text-gray-400">Fetching commit information and file changes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (modalError && !commitDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Commit</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{modalError}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!commitDetails) return null;

  const totalChanges = commitDetails.files.reduce((sum, file) => sum + file.changes, 0);
  const totalInsertions = commitDetails.files.reduce((sum, file) => sum + file.insertions, 0);
  const totalDeletions = commitDetails.files.reduce((sum, file) => sum + file.deletions, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 m-2 sm:m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <GitCommit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Commit Details</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600 dark:text-gray-300">
                <code className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-xs font-semibold border border-gray-200 dark:border-gray-600">
                  {commitDetails.hash}
                </code>
                <div className="flex items-center space-x-1.5">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{commitDetails.author}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(commitDetails.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-105"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Commit Message */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl font-semibold break-words leading-relaxed">
              {commitDetails.message}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{commitDetails.files.length}</div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Files Changed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalChanges}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Changes</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">+{totalInsertions}</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Additions</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">-{totalDeletions}</div>
              <div className="text-sm font-medium text-red-700 dark:text-red-300">Deletions</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 p-4 sm:p-6">
          {/* Files List */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-80 lg:max-h-none bg-gray-50 dark:bg-gray-800/30 rounded-lg mr-0 lg:mr-4 mb-4 lg:mb-0">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Changed Files
              </h3>
              <div className="space-y-3">
                {commitDetails.files.length > 0 ? (
                  commitDetails.files.map((file, index) => {
                    const statusInfo = getStatusInfo(file.status);
                    const StatusIcon = statusInfo.icon;
                    const fileIcon = getFileIcon(file.file);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedFile(file.file)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          selectedFile === file.file
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{fileIcon}</span>
                          <code className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate flex-1 font-semibold">
                            {file.file}
                          </code>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color} border`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1.5" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{file.changes} changes</span>
                          {file.insertions > 0 && (
                            <span className="text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                              +{file.insertions}
                            </span>
                          )}
                          {file.deletions > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                              -{file.deletions}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">No files changed in this commit</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Diff Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            {selectedFile ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* File Header */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-4 border-b border-gray-200 dark:border-gray-600 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-100 font-semibold">{selectedFile}</span>
                  </div>
                </div>

                {/* Diff Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-0 rounded-b-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300">Loading diff...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center p-6">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error loading diff</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
                      </div>
                    </div>
                  ) : fileDiff ? (
                    <div className="font-mono text-sm">
                      {parseDiff(fileDiff).map((line, index) => (
                        <div
                          key={index}
                          className={`flex hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${
                            line.type === 'added'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 border-l-4 border-green-400'
                              : line.type === 'removed'
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border-l-4 border-red-400'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <div className="w-16 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex-shrink-0 font-semibold">
                            {line.lineNumber}
                          </div>
                          <div className="flex-1 px-3 py-2 whitespace-pre-wrap break-words leading-relaxed">
                            {line.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-medium">No diff available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 min-h-64">
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                  <p className="text-xl font-semibold mb-2">Select a file to view changes</p>
                  <p className="text-sm">Choose a file from the list to see the detailed diff</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

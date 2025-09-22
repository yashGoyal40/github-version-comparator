'use client';

import { FileText, Plus, Minus, Edit, Eye } from 'lucide-react';

interface FileChange {
  file: string;
  changes: number;
  insertions: number;
  deletions: number;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  patch?: string;
}

interface FilesListProps {
  files: FileChange[];
  onFileSelect: (file: string) => void;
}

export default function FilesList({ files, onFileSelect }: FilesListProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'added':
        return { label: 'Added', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: Plus };
      case 'modified':
        return { label: 'Modified', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: Edit };
      case 'removed':
        return { label: 'Removed', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', icon: Minus };
      case 'renamed':
        return { label: 'Renamed', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: Edit };
      default:
        return { label: 'Modified', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: Edit };
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">File Changes</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} files changed
        </span>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => {
          const statusInfo = getStatusInfo(file.status);
          const StatusIcon = statusInfo.icon;
          const fileIcon = getFileIcon(file.file);

          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group"
              onClick={() => onFileSelect(file.file)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg">{fileIcon}</span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <code className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                        {file.file}
                      </code>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{file.changes} changes</span>
                      {file.insertions > 0 && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{file.insertions}
                        </span>
                      )}
                      {file.deletions > 0 && (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          -{file.deletions}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No files changed between these versions</p>
        </div>
      )}
    </div>
  );
}

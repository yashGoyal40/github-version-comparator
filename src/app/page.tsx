'use client';

import { useState, useEffect } from 'react';
import { GitBranch, FileText, BarChart3, Eye, Loader2, Github, AlertCircle } from 'lucide-react';
import RepositoryInput from '@/components/RepositoryInput';
import VersionSelector from '@/components/VersionSelector';
import StatsGrid from '@/components/StatsGrid';
import CommitsList from '@/components/CommitsList';
import FilesList from '@/components/FilesList';
import DiffViewer from '@/components/DiffViewer';
import Overview from '@/components/Overview';
import LandingPage from '@/components/LandingPage';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useGitHub } from '@/hooks/useGitHub';

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
  repository: {
    owner: string;
    repo: string;
  };
}

type TabType = 'overview' | 'commits' | 'files' | 'diff';

export default function Home() {
  const [repository, setRepository] = useState<{ owner: string; name: string; url: string } | null>(null);
  const [token, setToken] = useState<string>('');
  const [versions, setVersions] = useState<string[]>([]);
  const [fromVersion, setFromVersion] = useState<string>('');
  const [toVersion, setToVersion] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Use GitHub hook for all API operations
  const { loading, error, getVersions, compareVersions, getFileDiff, validateToken } = useGitHub(token);

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Save token to localStorage whenever it changes
  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('github_token', newToken);
    } else {
      localStorage.removeItem('github_token');
    }
  };

  const fetchVersions = async () => {
    if (!repository) return;

    try {
      const versions = await getVersions(repository.owner, repository.name);
      setVersions(versions);
    } catch (err) {
      console.error('Error fetching versions:', err);
      // Error is already set by the hook
    }
  };

  useEffect(() => {
    if (repository) {
      fetchVersions();
    }
  }, [repository, token]);

  const handleCompareVersions = async () => {
    if (!fromVersion || !toVersion || fromVersion === toVersion || !repository) return;

    setComparison(null);

    try {
      const result = await compareVersions(repository.owner, repository.name, fromVersion, toVersion);
      setComparison(result);
    } catch (err) {
      console.error('Error comparing versions:', err);
      // Error is already set by the hook
    }
  };

  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
    setActiveTab('diff');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'commits', label: 'Commits', icon: GitBranch },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'diff', label: 'Diff', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <DarkModeToggle />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 GitHub Version Comparator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Compare different versions and visualize changes in any GitHub repository
          </p>
        </div>

        {/* Repository Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <RepositoryInput
            onRepositoryChange={setRepository}
            onTokenChange={handleTokenChange}
            loading={loading}
          />
        </div>


        {/* Landing Page or Version Selector */}
        {!repository ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <LandingPage />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <VersionSelector
              versions={versions}
              fromVersion={fromVersion}
              toVersion={toVersion}
              onFromVersionChange={setFromVersion}
              onToVersionChange={setToVersion}
              onCompare={handleCompareVersions}
              loading={loading}
              disabled={!fromVersion || !toVersion || fromVersion === toVersion}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Analyzing changes...</p>
          </div>
        )}

        {/* Results */}
        {comparison && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Stats Grid */}
            <StatsGrid stats={comparison.stats} />

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white dark:bg-gray-800">
              {activeTab === 'overview' && (
                <Overview
                  comparison={comparison}
                  onFileSelect={handleFileSelect}
                  onSwitchToFiles={() => setActiveTab('files')}
                />
              )}
              {activeTab === 'commits' && (
                <CommitsList commits={comparison.commits} />
              )}
              {activeTab === 'files' && (
                <FilesList
                  files={comparison.files}
                  onFileSelect={handleFileSelect}
                />
              )}
              {activeTab === 'diff' && (
                <DiffViewer
                  fromVersion={comparison.fromVersion}
                  toVersion={comparison.toVersion}
                  selectedFile={selectedFile}
                  repository={comparison.repository}
                  token={token}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

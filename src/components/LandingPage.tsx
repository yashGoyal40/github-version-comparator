'use client';

import { Github, GitBranch, BarChart3, FileText, Eye, Zap } from 'lucide-react';
import Logo from './Logo';

export default function LandingPage() {
  const features = [
    {
      icon: Github,
      title: 'Any GitHub Repository',
      description: 'Compare versions from any public GitHub repository'
    },
    {
      icon: GitBranch,
      title: 'Version Comparison',
      description: 'Compare tags, releases, and commits between versions'
    },
    {
      icon: BarChart3,
      title: 'Detailed Statistics',
      description: 'View commits, files changed, and lines added/removed'
    },
    {
      icon: FileText,
      title: 'File Changes',
      description: 'Browse all changed files with status indicators'
    },
    {
      icon: Eye,
      title: 'Diff Viewer',
      description: 'See detailed line-by-line changes with syntax highlighting'
    },
    {
      icon: Zap,
      title: 'Real-time Data',
      description: 'Live data from GitHub API with instant updates'
    }
  ];

  const popularRepos = [
    { name: 'React', url: 'https://github.com/facebook/react', owner: 'facebook', repo: 'react' },
    { name: 'Next.js', url: 'https://github.com/vercel/next.js', owner: 'vercel', repo: 'next.js' },
    { name: 'Vue.js', url: 'https://github.com/vuejs/vue', owner: 'vuejs', repo: 'vue' },
    { name: 'Angular', url: 'https://github.com/angular/angular', owner: 'angular', repo: 'angular' },
    { name: 'TypeScript', url: 'https://github.com/microsoft/TypeScript', owner: 'microsoft', repo: 'TypeScript' },
    { name: 'Node.js', url: 'https://github.com/nodejs/node', owner: 'nodejs', repo: 'node' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-6">
          <Logo size="lg" className="mr-3" />
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Github className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to GitHub Version Comparator
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Compare different versions of any GitHub repository and visualize changes 
          with detailed statistics, file diffs, and commit history.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Popular Repositories */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Popular Repositories to Try
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRepos.map((repo, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all">
              <div className="flex items-center space-x-3">
                <Github className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{repo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{repo.owner}/{repo.repo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Enter any of these repository URLs above to get started
        </p>
      </div>

      {/* How it Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mb-4">
              <span className="text-lg font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enter Repository URL</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Paste any GitHub repository URL or use the format owner/repo
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mb-4">
              <span className="text-lg font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Select Versions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose two versions to compare from the available tags and releases
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mb-4">
              <span className="text-lg font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Explore Changes</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View detailed statistics, commits, file changes, and diffs
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Token Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">GitHub Token (Optional)</h4>
            <p className="text-sm text-yellow-700 mb-3">
              For private repositories or higher rate limits, you can provide a GitHub personal access token.
            </p>
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-800 hover:text-yellow-900 underline"
            >
              Generate a token here →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

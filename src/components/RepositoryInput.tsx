'use client';

import { useState, useEffect, useCallback } from 'react';
import { Github, Link, Key, AlertCircle, CheckCircle, Search, Lock } from 'lucide-react';

interface RepositoryInputProps {
  onRepositoryChange: (repo: { owner: string; name: string; url: string }) => void;
  onTokenChange: (token: string) => void;
  loading: boolean;
}

export default function RepositoryInput({ onRepositoryChange, onTokenChange, loading }: RepositoryInputProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTokenStatus, setShowTokenStatus] = useState(false);

  // Check if there's a saved token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
      setShowTokenStatus(true);
    }
  }, []);

  const validateRepositoryUrl = (url: string) => {
    // Support various GitHub URL formats
    const patterns = [
      /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?\/?$/,
      /^git@github\.com:([^\/]+)\/([^\/]+)(?:\.git)?$/,
      /^github\.com\/([^\/]+)\/([^\/]+)$/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          name: match[2].replace('.git', ''),
          url: `https://github.com/${match[1]}/${match[2].replace('.git', '')}`
        };
      }
    }

    return null;
  };

  // Debounced validation function
  const debouncedValidate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (url: string) => {
        clearTimeout(timeoutId);
        setIsTyping(true);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setError('');
          
          if (url.trim() === '') {
            setIsValid(null);
            onRepositoryChange(null as any);
            return;
          }

          const repo = validateRepositoryUrl(url.trim());
          if (repo) {
            setIsValid(true);
            onRepositoryChange(repo);
          } else {
            setIsValid(false);
            setError('Please enter a valid GitHub repository URL');
            onRepositoryChange(null as any);
          }
        }, 500); // 500ms delay
      };
    })(),
    [onRepositoryChange]
  );

  const handleUrlChange = (url: string) => {
    setRepoUrl(url);
    debouncedValidate(url);
  };

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    setShowTokenStatus(!!newToken);
    onTokenChange(newToken);
  };

  const clearToken = () => {
    setToken('');
    setShowTokenStatus(false);
    onTokenChange('');
    localStorage.removeItem('github_token');
  };

  const handleConnectToPrivate = () => {
    setShowTokenInput(true);
  };

  const handleConnectToPublic = () => {
    setShowTokenInput(false);
    setIsPrivate(false);
  };

  // Check if repository might be private (simplified check)
  const checkIfPrivate = async (repo: { owner: string; name: string; url: string }) => {
    try {
      // This is a simplified check - in a real app you'd make an API call
      // For now, we'll show the token input for any valid repo
      setIsPrivate(true);
    } catch (error) {
      setIsPrivate(false);
    }
  };

  const examples = [
    'https://github.com/facebook/react',
    'https://github.com/microsoft/vscode',
    'https://github.com/vercel/next.js',
    'facebook/react',
    'microsoft/vscode'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect to GitHub Repository
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter any public GitHub repository URL to compare versions
        </p>
      </div>

      {/* Repository URL Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repository URL
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                isValid === true ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 
                isValid === false ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 
                'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {isTyping && (
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-pulse" />
              )}
              {!isTyping && isValid === true && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {!isTyping && isValid === false && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
          
          {/* Private Repo Connection Options */}
          {isValid === true && !showTokenInput && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Repository Connected Successfully!
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Ready to compare versions for this repository
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnectToPrivate}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add Token
                </button>
              </div>
            </div>
          )}
        </div>

        {/* GitHub Token Input */}
        {showTokenInput && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub Token
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                  - For private repos or higher rate limits
                </span>
              </label>
              <button
                onClick={handleConnectToPublic}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Skip for public repo
              </button>
            </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="password"
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (optional)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              disabled={loading}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <Link className="h-4 w-4 inline mr-1" />
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Generate a GitHub token
            </a>
            {' '}if you need access to private repositories or want higher rate limits
          </p>
        </div>
        )}
      </div>

      {/* Token Status */}
      {showTokenStatus && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  GitHub Token Active
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Token: {token.substring(0, 8)}...{token.substring(token.length - 4)}
                </p>
              </div>
            </div>
            <button
              onClick={clearToken}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear Token
            </button>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Examples:</h3>
        <div className="space-y-1">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleUrlChange(example)}
              className="block text-left text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Repository Info */}
      {isValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Repository connected successfully!
              </p>
              <p className="text-sm text-green-600">
                Ready to compare versions for this repository
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

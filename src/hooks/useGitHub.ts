import { useState, useCallback } from 'react';
import GitHubAPI from '@/lib/github';

export interface UseGitHubReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  getVersions: (owner: string, repo: string) => Promise<string[]>;
  compareVersions: (owner: string, repo: string, base: string, head: string) => Promise<any>;
  getFileDiff: (owner: string, repo: string, base: string, head: string, filename: string) => Promise<string>;
  validateToken: () => Promise<boolean>;
}

export function useGitHub(token?: string): UseGitHubReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const github = new GitHubAPI(token);

  const handleError = (err: any) => {
    console.error('GitHub API Error:', err);
    setError(err.message || 'An error occurred');
    setLoading(false);
  };

  const getVersions = useCallback(async (owner: string, repo: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const versions = await github.getVersions(owner, repo);
      setLoading(false);
      return versions;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [github]);

  const compareVersions = useCallback(async (owner: string, repo: string, base: string, head: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const comparison = await github.compareVersions(owner, repo, base, head);
      
      // Check if we need to swap the versions based on the comparison result
      const shouldSwap = comparison.commits.length === 0 && comparison.files.length === 0;
      const actualFromVersion = shouldSwap ? head : base;
      const actualToVersion = shouldSwap ? base : head;
      
      // Transform to our expected format
      const result = {
        fromVersion: actualFromVersion,
        toVersion: actualToVersion,
        commits: comparison.commits.map(commit => ({
          hash: commit.sha.substring(0, 7),
          message: commit.commit.message,
          date: commit.commit.author.date,
          author: commit.author.login || commit.commit.author.name
        })),
        files: comparison.files.map(file => ({
          file: file.filename,
          changes: file.changes,
          insertions: file.additions,
          deletions: file.deletions,
          status: file.status,
          patch: file.patch
        })),
        stats: {
          commits: comparison.commits.length,
          filesChanged: comparison.files.length,
          insertions: comparison.files.reduce((sum, file) => sum + file.additions, 0),
          deletions: comparison.files.reduce((sum, file) => sum + file.deletions, 0)
        },
        repository: { owner, repo }
      };
      
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [github]);

  const getFileDiff = useCallback(async (owner: string, repo: string, base: string, head: string, filename: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const diff = await github.getFileDiff(owner, repo, base, head, filename);
      setLoading(false);
      return diff;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [github]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      return await github.validateToken();
    } catch {
      return false;
    }
  }, [github]);

  return {
    loading,
    error,
    getVersions,
    compareVersions,
    getFileDiff,
    validateToken
  };
}

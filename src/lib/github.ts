// Client-side GitHub API utilities
export interface GitHubTag {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
  };
}

export interface GitHubFileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export interface GitHubComparison {
  commits: GitHubCommit[];
  files: GitHubFileChange[];
  base_commit: {
    sha: string;
  };
  merge_base_commit: {
    sha: string;
  };
}

class GitHubAPI {
  private baseURL = 'https://api.github.com';
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Version-Comparator'
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    console.log('🔍 Making GitHub API request:', { url, hasToken: !!this.token });

    const response = await fetch(url, { 
      headers,
      method: 'GET'
    });

    console.log('📡 GitHub API response:', { 
      status: response.status, 
      statusText: response.statusText,
      ok: response.ok 
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      let errorDetails = {};
      
      try {
        const error = await response.json();
        errorDetails = error;
        errorMessage = error.message || error.error || `HTTP ${response.status}`;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }
      
      console.error('❌ GitHub API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorDetails
      });
      
      // Handle specific GitHub API errors
      if (response.status === 403) {
        if (errorMessage.includes('rate limit') || errorMessage.includes('API rate limit')) {
          throw new Error('GitHub API rate limit exceeded. Please wait before making more requests or add a GitHub token for higher limits.');
        }
        throw new Error('Access denied. This repository may be private or you may not have permission to access it.');
      }
      
      if (response.status === 401) {
        throw new Error('GitHub API authentication failed. Please check your token or try without authentication for public repositories.');
      }
      
      if (response.status === 404) {
        throw new Error('Repository not found. Please check the repository URL and ensure it exists and is accessible.');
      }
      
      if (response.status === 422) {
        throw new Error('Invalid request. Please check the repository URL format.');
      }
      
      throw new Error(`GitHub API error: ${errorMessage}`);
    }

    return response.json();
  }

  async getVersions(owner: string, repo: string): Promise<string[]> {
    try {
      const tags = await this.request<GitHubTag[]>(`/repos/${owner}/${repo}/tags?per_page=100`);
      return tags.map(tag => tag.name);
    } catch (error) {
      console.error('Error fetching versions:', error);
      throw error;
    }
  }

  async compareVersions(owner: string, repo: string, base: string, head: string): Promise<GitHubComparison> {
    try {
      // Try the original order first
      let endpoint = `/repos/${owner}/${repo}/compare/${base}...${head}`;
      let comparison = await this.request<GitHubComparison>(endpoint);
      
      // If no commits found, try swapping the versions
      if (comparison.commits.length === 0 && comparison.files.length === 0) {
        endpoint = `/repos/${owner}/${repo}/compare/${head}...${base}`;
        comparison = await this.request<GitHubComparison>(endpoint);
      }
      
      return comparison;
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  }

  async getFileDiff(owner: string, repo: string, base: string, head: string, filename: string): Promise<string> {
    try {
      const comparison = await this.request<GitHubComparison>(`/repos/${owner}/${repo}/compare/${base}...${head}`);
      const file = comparison.files.find(f => f.filename === filename);
      
      if (!file) {
        throw new Error('File not found in comparison');
      }

      return file.patch || '';
    } catch (error) {
      console.error('Error fetching file diff:', error);
      throw error;
    }
  }

  // Check if token is valid
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;
    
    try {
      await this.request('/user');
      return true;
    } catch {
      return false;
    }
  }
}

export default GitHubAPI;

# 🚀 GitHub Version Comparator

A modern, interactive web application for comparing different versions of any GitHub repository. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔍 Version Comparison**: Compare any two versions of any GitHub repository
- **📊 Real-time Statistics**: View commits, files changed, lines added/removed
- **📝 Interactive Diff Viewer**: See detailed file changes with syntax highlighting
- **📋 Commit History**: Browse through all commits between versions
- **📁 File Explorer**: Explore changed files with status indicators
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⚡ Client-Side Only**: No server required - all API calls from user's browser
- **🔐 Private Repository Support**: Optional GitHub token for private repos
- **♾️ Infinite Scalability**: Each user has their own GitHub API rate limits
- **🔒 Privacy First**: No data stored on server, tokens stay in browser

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **GitHub API**: Direct browser fetch calls
- **Icons**: Lucide React
- **Deployment**: Vercel, Netlify, or any static hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn
- GitHub repository access (public or private with token)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sx-go-utils-version-comparator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables (optional)**
   
   Create a `.env.local` file for GitHub token (optional):
   
   ```bash
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Enter a repository URL**
   
   - Enter any GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Or use the format `owner/repo` (e.g., `facebook/react`)
   - Optionally provide a GitHub token for private repositories

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── github/
│   │       ├── versions/route.ts      # Fetch GitHub tags/releases
│   │       ├── compare/route.ts       # Compare two versions
│   │       └── diff/route.ts          # Get file diff
│   ├── globals.css                # Global styles
│   └── page.tsx                   # Main page component
├── components/
│   ├── RepositoryInput.tsx        # Repository URL input
│   ├── LandingPage.tsx           # Landing page
│   ├── VersionSelector.tsx        # Version selection UI
│   ├── StatsGrid.tsx             # Statistics display
│   ├── CommitsList.tsx           # Commit history
│   ├── FilesList.tsx             # File changes list
│   ├── DiffViewer.tsx            # File diff viewer
│   └── Overview.tsx              # Overview dashboard
└── types/                        # TypeScript type definitions
```

## 🔧 API Endpoints

### `POST /api/github/versions`
Returns all available version tags and releases from a GitHub repository.

**Request Body:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "token": "ghp_xxxxxxxxxxxxxxxxxxxx" // optional
}
```

**Response:**
```json
{
  "versions": ["v18.2.0", "v18.1.0", "v18.0.0", ...],
  "repository": { "owner": "facebook", "repo": "react" },
  "total": 150
}
```

### `POST /api/github/compare`
Compares two versions and returns statistics and changes.

**Request Body:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "fromVersion": "v18.1.0",
  "toVersion": "v18.2.0",
  "token": "ghp_xxxxxxxxxxxxxxxxxxxx" // optional
}
```

**Response:**
```json
{
  "fromVersion": "v18.1.0",
  "toVersion": "v18.2.0",
  "commits": [...],
  "files": [...],
  "stats": {
    "commits": 45,
    "filesChanged": 23,
    "insertions": 1250,
    "deletions": 340
  },
  "repository": { "owner": "facebook", "repo": "react" }
}
```

### `POST /api/github/diff`
Returns detailed diff for a specific file.

**Request Body:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "fromVersion": "v18.1.0",
  "toVersion": "v18.2.0",
  "file": "src/React.js",
  "token": "ghp_xxxxxxxxxxxxxxxxxxxx" // optional
}
```

**Response:**
```json
{
  "file": "src/React.js",
  "lines": [...],
  "stats": {
    "additions": 25,
    "deletions": 8
  },
  "repository": { "owner": "facebook", "repo": "react" }
}
```

## 🎨 UI Components

### RepositoryInput
- GitHub repository URL input
- Token authentication (optional)
- URL validation and examples
- Repository connection status

### LandingPage
- Welcome screen with features
- Popular repository examples
- How-to guide
- GitHub token information

### VersionSelector
- Dropdown menus for version selection
- Validation and error handling
- Responsive design

### StatsGrid
- Visual statistics cards
- Color-coded metrics
- Hover animations

### CommitsList
- Chronological commit display
- Author and date information
- Scrollable list with pagination

### FilesList
- File change indicators
- Status badges (Added, Modified, Removed, Renamed)
- Click-to-view diff functionality

### DiffViewer
- Syntax-highlighted diff display
- Line-by-line changes
- Addition/removal indicators

### Overview
- Summary dashboard
- Quick actions
- Top changed files
- Recent commits

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** (if needed)
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Considerations

- The app requires access to your local git repository
- Consider implementing authentication for production use
- Validate and sanitize all inputs
- Implement rate limiting for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **"Failed to fetch versions"**
   - Check that the `REPO_PATH` is correct
   - Ensure the repository exists and is accessible
   - Verify git is installed and working

2. **"Failed to compare versions"**
   - Check that both versions exist as git tags
   - Ensure the repository has the required commits

3. **"Failed to fetch diff"**
   - Verify the file path is correct
   - Check that the file exists in both versions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

Built with ❤️ for the sx-go-utils project

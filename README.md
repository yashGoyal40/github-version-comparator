# 🚀 GitHub Version Comparator

A modern, interactive web application for comparing different versions of any GitHub repository. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔍 Version Comparison**: Compare any two versions of any GitHub repository
- **📊 Real-time Statistics**: View commits, files changed, lines added/removed
- **📝 Interactive Diff Viewer**: See detailed file changes with syntax highlighting
- **📋 Commit History**: Browse through all commits between versions
- **📁 File Explorer**: Explore changed files with status indicators
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⚡ Client-Side Architecture**: No server required - all API calls from user's browser
- **🔐 Private Repository Support**: Optional GitHub token for private repos
- **♾️ Infinite Scalability**: Each user has their own GitHub API rate limits
- **🔒 Privacy First**: No data stored on server, tokens stay in browser
- **🔄 Smart Version Detection**: Automatically handles version order for optimal results

## 🏗️ Architecture

This application uses a **client-side only architecture** that provides several key benefits:

### **Client-Side Benefits:**
- **No Server Required**: Pure static site that can be hosted anywhere
- **Infinite Scalability**: Each user makes their own API calls to GitHub
- **Privacy First**: No data passes through any server - everything stays in your browser
- **Cost Effective**: No server costs, just static hosting
- **Rate Limits**: Subject to GitHub's official API rate limits (5,000 requests/hour with token, 60 without)

### **How It Works:**
1. **User enters repository URL** → Direct API call to GitHub from browser
2. **User adds GitHub token** → Stored securely in browser localStorage
3. **All comparisons** → Made directly from user's browser to GitHub API
4. **No data storage** → Nothing is stored on any server

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

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Enter a repository URL**
   
   - Enter any GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Or use the format `owner/repo` (e.g., `facebook/react`)
   - Optionally provide a GitHub token for private repositories

## 🔑 GitHub Token (Optional)

For private repositories or higher rate limits, you can add a GitHub Personal Access Token:

1. **Create a token** at [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. **Select scopes**: `repo` (for private repos) or `public_repo` (for public repos only)
3. **Enter the token** in the app when prompted
4. **Token is stored locally** in your browser - never sent to any server

**Note**: Without a token, you can still access public repositories with GitHub's standard rate limits.

## 📁 Project Structure

```
src/
├── app/
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
│   ├── Overview.tsx              # Overview dashboard
│   └── DarkModeToggle.tsx        # Dark mode toggle
├── lib/
│   └── github.ts                 # GitHub API client (client-side)
├── hooks/
│   └── useGitHub.ts              # GitHub API hook
└── types/                        # TypeScript type definitions
```

## 🔧 Client-Side Architecture

This application uses **direct GitHub API calls** from the browser, eliminating the need for server-side API endpoints.

### **GitHub API Integration:**

The app makes direct calls to GitHub's REST API:

- **`GET /repos/{owner}/{repo}/tags`** - Fetch version tags
- **`GET /repos/{owner}/{repo}/compare/{base}...{head}`** - Compare versions
- **`GET /repos/{owner}/{repo}/compare/{base}...{head}`** - Get file diffs

### **Key Components:**

- **`lib/github.ts`** - GitHub API client with error handling
- **`hooks/useGitHub.ts`** - React hook for API operations
- **Smart version detection** - Automatically handles version order
- **Error handling** - Clear messages for rate limits and auth issues

### **Data Flow:**

```
User Browser → GitHub API (Direct)
     ↓
Local Storage (Token Only)
     ↓
React Components (Display Data)
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

Since this is a **client-side only application**, it can be deployed to any static hosting platform:

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Deploy** - No environment variables needed!

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

The app can be deployed to any static hosting platform:
- **Netlify** - Drag & drop or Git integration
- **GitHub Pages** - Free hosting for public repos
- **AWS S3 + CloudFront** - Scalable static hosting
- **DigitalOcean App Platform** - Simple deployment
- **Firebase Hosting** - Google's static hosting

### Build for Production

```bash
# Build the application
npm run build

# The output will be in the 'out' directory
# Deploy the 'out' directory to any static host
```

## 🔒 Security & Privacy

- **No server required** - Pure client-side application
- **Tokens stored locally** - Never sent to any server
- **Direct GitHub API** - No data passes through your infrastructure
- **Rate limits** - Subject to GitHub's official API limits
- **CORS compliant** - Works with GitHub's API directly

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

1. **"Repository not found or not accessible"**
   - Check that the repository URL is correct
   - Ensure the repository exists and is public
   - For private repos, add a GitHub token

2. **"GitHub API rate limit exceeded"**
   - Wait before making more requests
   - Add a GitHub token for higher limits (5,000/hour vs 60/hour)
   - Check your token permissions

3. **"Access denied"**
   - Repository might be private - add a GitHub token
   - Check token permissions and validity
   - Ensure token has `repo` scope for private repos

4. **"No changes found"**
   - App automatically handles version order
   - Check that both versions exist as tags
   - Verify there are actual differences between versions

### Debug Mode

Open browser console (F12) to see detailed API logs and error messages.

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

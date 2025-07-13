# Clipify

**Web content clipper - Convert, extract, and save web pages in multiple formats**

Clipify is a powerful browser extension that allows you to extract, convert, and save web content in various formats including Markdown, HTML, and screenshots. Built with modern web technologies and designed for productivity.

## ✨ Features

- **Smart Content Extraction**: Uses Mozilla's Readability algorithm to extract clean, readable content from web pages
- **Markdown Conversion**: Convert web pages to well-formatted Markdown with YAML frontmatter
- **Multiple Export Formats**: 
  - Markdown with metadata
  - Clean HTML
  - Page screenshots
- **One-Click Actions**: Copy to clipboard or download files instantly
- **Rich Metadata**: Automatically extracts title, publication date, word count, and more
- **Table Support**: Intelligent table conversion to Markdown format
- **Cross-Browser Compatible**: Works on Chrome and Firefox

## 🚀 Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/moritalous/clipify.git
   cd clipify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   # For Chrome
   npm run dev
   
   # For Firefox
   npm run dev:firefox
   ```

4. **Load the extension**
   - **Chrome**: Open `chrome://extensions/`, enable Developer mode, click "Load unpacked" and select the `.output/chrome-mv3` folder
   - **Firefox**: Open `about:debugging`, click "This Firefox", click "Load Temporary Add-on" and select the manifest file from `.output/firefox-mv2`

### Production Build

```bash
# Build for Chrome
npm run build

# Build for Firefox
npm run build:firefox

# Create distribution packages
npm run zip
npm run zip:firefox
```

## 🎯 Usage

1. **Navigate to any web page** you want to clip
2. **Click the Clipify extension icon** in your browser toolbar
3. **Wait for automatic content extraction** - the extension will analyze the page using Readability
4. **Choose your preferred action**:
   - **Copy Markdown**: Copy formatted Markdown to clipboard
   - **Download Markdown**: Save as `.md` file
   - **Copy HTML**: Copy clean HTML to clipboard
   - **Download HTML**: Save as `.html` file
   - **Copy Screenshot**: Copy page screenshot to clipboard
   - **Save Screenshot**: Download page screenshot

## 📋 Output Format

### Markdown with YAML Frontmatter

```markdown
---
title: "Article Title"
source_url: "https://example.com/article"
source: "Example Site"
published_time: "2024-01-01T00:00:00Z"
extracted_at: "2024-01-01T12:00:00Z"
word_count: 1500
content_length: 8000
excerpt: "Article summary..."
---

# Article Content

Your converted markdown content here...
```

### Features of Markdown Conversion

- **YAML Frontmatter**: Rich metadata including source URL, publication date, word count
- **Clean Formatting**: Proper heading hierarchy, lists, and emphasis
- **Table Support**: HTML tables converted to Markdown table format
- **Code Block Preservation**: Maintains code formatting with fenced code blocks
- **Link Handling**: Converts links to inline Markdown format

## 🛠️ Technical Details

### Architecture

- **Framework**: Built with [WXT](https://wxt.dev/) - Modern web extension framework
- **UI**: React 19 with TypeScript
- **Content Extraction**: Mozilla Readability for clean content extraction
- **Markdown Conversion**: Turndown.js with custom rules
- **Build System**: Vite-powered development and build process

### Key Components

- **Background Script**: Handles extension lifecycle
- **Content Script**: Injected into web pages for content extraction
- **Popup Interface**: React-based UI for user interactions
- **Converter Utilities**: Custom Markdown conversion logic
- **Screenshot Utilities**: Page capture functionality

### Browser Permissions

- `activeTab`: Access current tab content
- `clipboardWrite`: Copy content to clipboard
- `tabs`: Query and interact with browser tabs

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Chrome development server
npm run dev:firefox      # Start Firefox development server

# Building
npm run build            # Build for Chrome
npm run build:firefox    # Build for Firefox
npm run zip              # Create Chrome distribution package
npm run zip:firefox      # Create Firefox distribution package

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run compile          # TypeScript compilation check
npm run check            # Run all checks (compile + lint + format)
npm run fix              # Fix all issues (lint + format)
```

### Project Structure

```
├── entrypoints/
│   ├── background.ts           # Background script
│   ├── content.ts             # Content script for page interaction
│   └── popup/                 # Popup UI components
│       ├── App.tsx            # Main app component
│       ├── components/        # React components
│       └── hooks/             # Custom React hooks
├── utils/
│   ├── converter.ts           # Markdown conversion logic
│   └── screenshot.ts          # Screenshot utilities
├── types/
│   └── index.ts              # TypeScript type definitions
├── public/
│   └── icon/                 # Extension icons
└── wxt.config.ts             # WXT configuration
```

### Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting with React rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better development experience
- **React**: Modern UI development with hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by ESLint and Prettier)
- Add TypeScript types for new features
- Test your changes in both Chrome and Firefox
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/moritalous/clipify/issues) on GitHub.

## 🙏 Acknowledgments

- [Mozilla Readability](https://github.com/mozilla/readability) - Content extraction algorithm
- [Turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown conversion
- [WXT](https://wxt.dev/) - Modern web extension development framework
- [React](https://react.dev/) - UI framework

---

**Made with ❤️ for productivity enthusiasts**

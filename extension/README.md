# Privacy Guardian Extension

This directory contains the React-based frontend for the Privacy Guardian extension.

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **UI Logic**: Chrome Scripting API + Streaming Fetch

## 🚀 Build Instructions
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Load the `dist` folder as an unpacked extension in your browser.

## 📂 Structure
- `src/App.jsx`: Main UI logic and streaming connection to the backend.
- `public/manifest.json`: Extension configuration and permissions.
- `src/App.css`: Premium glassmorphism design and styles.

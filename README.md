# AI Agent News App

A Vite + React web application that fetches and displays news articles about AI agents from yesterday using the News API.

## Features

- Fetches news articles about "AI agents" from yesterday's date
- Displays articles with images, titles, descriptions, and metadata
- Responsive design with hover effects
- Clean, modern UI with gradient styling

## Setup

1. Install dependencies:
```bash
npm install
```

2. The API key is already configured in the `.env` file

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Technologies Used

- React 18
- Vite
- News API (newsapi.org)
- CSS3 with modern features

## How It Works

The app uses the News API's `/v2/everything` endpoint to search for articles containing "ai agent" published yesterday. Articles are sorted by publish date and displayed in a card layout with:

- Article image
- Title (clickable link to full article)
- Source and publication date
- Description
- Author (when available)

## Environment Variables

- `VITE_NEWS_API_KEY`: Your News API key (already configured)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
# news

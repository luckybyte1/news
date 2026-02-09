import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('general')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        const apiKey = import.meta.env.VITE_NEWS_API_KEY
        const url = `https://newsapi.org/v2/everything?q=ai+agent&from=${yesterdayStr}&to=${yesterdayStr}&sortBy=publishedAt&language=en&apiKey=${apiKey}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.status === 'ok') {
          // Deduplicate by URL and by normalized title
          const seen = new Set()
          const uniqueArticles = data.articles.filter((article) => {
            const normalTitle = (article.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
            const url = article.url || ''
            if (seen.has(url) || seen.has(normalTitle)) return false
            seen.add(url)
            if (normalTitle) seen.add(normalTitle)
            return true
          })
          setArticles(uniqueArticles)
        } else {
          setError(data.message || 'Failed to fetch news')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const isPyPIRelated = (article) => {
    const text = `${article.title} ${article.description} ${article.url}`.toLowerCase()
    const pypiKeywords = [
      'pypi', 'pypi.org', 'python package', 'python library',
      'pip install', 'package release', 'package version',
      'release on pypi', 'published to pypi', 'available on pypi',
      'install via pip', 'pip package'
    ]
    return pypiKeywords.some(keyword => text.includes(keyword))
  }

  const generalArticles = articles.filter(article => !isPyPIRelated(article))
  const pypiArticles = articles.filter(article => isPyPIRelated(article))
  const displayArticles = activeTab === 'general' ? generalArticles : pypiArticles

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateDisplay = yesterday.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p className="loading-text">Fetching intelligence...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-state">
          <span className="error-label">Feed Error</span>
          <p className="error-message">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-mark" />
            <div className="brand-text">
              <span className="brand-name">AgentFeed</span>
              <span className="brand-tagline">AI Agent Intelligence</span>
            </div>
          </div>
          <span className="header-date">{dateDisplay}</span>
        </div>
        <h1 className="header-title">
          Today in<br />AI Agents<span className="accent-dot">.</span>
        </h1>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          All Stories
          <span className="tab-count">{generalArticles.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'pypi' ? 'active' : ''}`}
          onClick={() => setActiveTab('pypi')}
        >
          PyPI Packages
          <span className="tab-count">{pypiArticles.length}</span>
        </button>
      </nav>

      {displayArticles.length === 0 ? (
        <div className="empty-state">
          <span className="empty-label">No Results</span>
          <p className="empty-desc">No articles found for this category.</p>
        </div>
      ) : (
        <div className="articles-feed">
          {displayArticles.map((article, index) => {
            const isFeatured = index === 0

            if (isFeatured) {
              return (
                <article key={article.url} className="article-card featured">
                  {article.urlToImage && (
                    <div className="article-image-wrap">
                      <img
                        src={article.urlToImage}
                        alt=""
                        className="article-image"
                        onError={(e) => e.target.parentElement.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="article-body">
                    <div className="article-category">Featured</div>
                    <div className="article-meta-row">
                      <span className="article-source">{article.source.name}</span>
                      <span className="article-time">
                        {formatDate(article.publishedAt)} at {formatTime(article.publishedAt)}
                      </span>
                    </div>
                    <h2 className="article-title">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h2>
                    <p className="article-excerpt">{article.description}</p>
                    {article.author && (
                      <p className="article-author">By <strong>{article.author}</strong></p>
                    )}
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-link">
                      Read full story <span className="arrow">&rarr;</span>
                    </a>
                  </div>
                </article>
              )
            }

            return (
              <article key={article.url} className="article-card">
                <div className="article-body">
                  <div className="article-meta-row">
                    <span className="article-source">{article.source.name}</span>
                    <span className="article-time">
                      {formatDate(article.publishedAt)} at {formatTime(article.publishedAt)}
                    </span>
                  </div>
                  <h2 className="article-title">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h2>
                  <p className="article-excerpt">{article.description}</p>
                  {article.author && (
                    <p className="article-author">By <strong>{article.author}</strong></p>
                  )}
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-link">
                    Read article <span className="arrow">&rarr;</span>
                  </a>
                </div>
                {article.urlToImage && (
                  <div className="article-image-wrap">
                    <img
                      src={article.urlToImage}
                      alt=""
                      className="article-image"
                      onError={(e) => e.target.parentElement.style.display = 'none'}
                    />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      <footer className="site-footer">
        <span className="footer-text">
          Powered by <span className="footer-accent">NewsAPI</span>
        </span>
        <span className="footer-text">
          {articles.length} articles indexed
        </span>
      </footer>
    </div>
  )
}

export default App

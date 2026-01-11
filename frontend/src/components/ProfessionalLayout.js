"use client"

import { useState, useEffect } from "react"
import "./ProfessionalLayout.css"

const ProfessionalLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !darkMode
    setDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    document.body.className = newTheme ? "dark-theme" : "light-theme"
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={`professional-layout ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* Header */}
      <header className="professional-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">
              📚 Library Management System
            </h1>
            <p className="tagline">Professional Library Solutions</p>
          </div>
          
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`professional-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            <div className="nav-header">
              <h3>📋 Main Menu</h3>
              <button className="close-sidebar" onClick={toggleSidebar}>
                ✕
              </button>
            </div>
            
            <div className="nav-section">
              <h4>📚 Catalog Management</h4>
              <a href="/books" className="nav-item">
                <span className="nav-icon">📖</span>
                <span className="nav-text">Books</span>
              </a>
              <a href="/authors" className="nav-item">
                <span className="nav-icon">✍️</span>
                <span className="nav-text">Authors</span>
              </a>
              <a href="/publishers" className="nav-item">
                <span className="nav-icon">🏢</span>
                <span className="nav-text">Publishers</span>
              </a>
            </div>

            <div className="nav-section">
              <h4>👥 Member Services</h4>
              <a href="/members" className="nav-item">
                <span className="nav-icon">👤</span>
                <span className="nav-text">Members</span>
              </a>
              <a href="/borrows" className="nav-item">
                <span className="nav-icon">📖</span>
                <span className="nav-text">Borrow/Return</span>
              </a>
            </div>

            <div className="nav-section">
              <h4>📊 Reports & Analytics</h4>
              <a href="/dashboard" className="nav-item">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Dashboard</span>
              </a>
              <a href="/reports" className="nav-item">
                <span className="nav-icon">📋</span>
                <span className="nav-text">Reports</span>
              </a>
            </div>

            <div className="nav-section">
              <h4>⚙️ System</h4>
              <a href="/settings" className="nav-item">
                <span className="nav-icon">🔧</span>
                <span className="nav-text">Settings</span>
              </a>
              <a href="/help" className="nav-item">
                <span className="nav-icon">❓</span>
                <span className="nav-text">Help</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`professional-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default ProfessionalLayout

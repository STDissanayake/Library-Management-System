"use client"

import { useState } from "react"
import Dashboard from "./components/Dashboard"
import BooksList from "./components/BooksList"
import AuthorsList from "./components/AuthorsList"
import PublishersList from "./components/PublishersList"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  return (
    <div className="App">
      <div className="app-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>📚 Library Management</h2>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3>DASHBOARD</h3>
              <button
                className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
                onClick={() => setCurrentPage("dashboard")}
              >
                <i className="fas fa-home"></i> Dashboard
              </button>
            </div>
            <div className="nav-section">
              <h3>MANAGEMENT</h3>
              <button
                className={`nav-item ${currentPage === "books" ? "active" : ""}`}
                onClick={() => setCurrentPage("books")}
              >
                <i className="fas fa-book"></i> Books
              </button>
              <button
                className={`nav-item ${currentPage === "authors" ? "active" : ""}`}
                onClick={() => setCurrentPage("authors")}
              >
                <i className="fas fa-user"></i> Authors
              </button>
              <button
                className={`nav-item ${currentPage === "publishers" ? "active" : ""}`}
                onClick={() => setCurrentPage("publishers")}
              >
                <i className="fas fa-building"></i> Publishers
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {currentPage === "dashboard" && <Dashboard onNavigate={setCurrentPage} />}
          {currentPage === "books" && <BooksList />}
          {currentPage === "authors" && <AuthorsList />}
          {currentPage === "publishers" && <PublishersList />}
        </main>
      </div>
    </div>
  )
}

export default App

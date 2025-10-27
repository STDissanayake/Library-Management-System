"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import "./Dashboard.css"

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalPublishers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

// In Dashboard.js - Add better error handling
const loadStats = async () => {
  try {
    const [booksRes, authorsRes, publishersRes] = await Promise.all([
      BookService.getAllBooks(),
      AuthorService.getAllAuthors(),
      PublisherService.getAllPublishers(),
    ])

    console.log("Dashboard Stats:", {
      books: booksRes.data,
      authors: authorsRes.data,
      publishers: publishersRes.data
    })

    setStats({
      totalBooks: Array.isArray(booksRes.data) ? booksRes.data.length : 0,
      totalAuthors: Array.isArray(authorsRes.data) ? authorsRes.data.length : 0,
      totalPublishers: Array.isArray(publishersRes.data) ? publishersRes.data.length : 0,
    })
    setLoading(false)
  } catch (error) {
    console.error("Error loading stats:", error)
    setStats({
      totalBooks: 0,
      totalAuthors: 0,
      totalPublishers: 0,
    })
    setLoading(false)
  }
}

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Library Management System Dashboard</h1>
        <p>Welcome to your library management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon books-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-content">
            <h3>Manage Books</h3>
            <p className="stat-number">Total Books: {stats.totalBooks}</p>
            <button className="stat-button" onClick={() => onNavigate && onNavigate("books")}>View Books →</button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon authors-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="stat-content">
            <h3>Manage Authors</h3>
            <p className="stat-number">Total Authors: {stats.totalAuthors}</p>
            <button className="stat-button" onClick={() => onNavigate && onNavigate("authors")}>View Authors →</button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon publishers-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="stat-content">
            <h3>Manage Publishers</h3>
            <p className="stat-number">Total Publishers: {stats.totalPublishers}</p>
            <button className="stat-button" onClick={() => onNavigate && onNavigate("publishers")}>View Publishers →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

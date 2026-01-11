"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import MemberService from "../service/MemberService"
import BorrowService from "../service/BorrowService"
import "./Dashboard.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalAuthors: 0,
    totalPublishers: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
    availableBooks: 0,
    borrowedBooks: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [booksRes, membersRes, authorsRes, publishersRes, borrowsRes] = await Promise.all([
        BookService.getAllBooks(),
        MemberService.getAllMembers(),
        BookService.getAllAuthors(),
        BookService.getAllPublishers(),
        BorrowService.getAllBorrows()
      ])

      const books = booksRes.data || []
      const members = membersRes.data || []
      const authors = authorsRes.data || []
      const publishers = publishersRes.data || []
      const borrows = borrowsRes.data || []

      // Calculate statistics
      const availableBooks = books.filter(book => book.status === "Available").length
      const borrowedBooks = books.filter(book => book.status === "Borrowed").length
      const activeBorrows = borrows.filter(borrow => borrow.status === "BORROWED").length
      const overdueBorrows = borrows.filter(borrow => borrow.status === "OVERDUE").length

      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        totalAuthors: authors.length,
        totalPublishers: publishers.length,
        activeBorrows,
        overdueBorrows,
        availableBooks,
        borrowedBooks
      })

      // Get recent activity (last 5 borrows)
      const recentBorrows = borrows
        .sort((a, b) => new Date(b.borrowDate || b.borrowDate) - new Date(a.borrowDate || a.borrowDate))
        .slice(0, 5)

      setRecentActivity(recentBorrows)

    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  const getBookTitle = (bookId) => {
    const book = stats.books?.find(b => b.id === bookId)
    return book ? book.title : "Unknown Book"
  }

  const getMemberName = (memberId) => {
    const member = stats.members?.find(m => m.id === memberId)
    return member ? `${member.firstName} ${member.lastName}` : "Unknown Member"
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Library Dashboard</h1>
        <p>Complete overview of your library management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card books">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
            <div className="stat-breakdown">
              <span className="available">{stats.availableBooks} Available</span>
              <span className="borrowed">{stats.borrowedBooks} Borrowed</span>
            </div>
          </div>
        </div>

        <div className="stat-card members">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card authors">
          <div className="stat-icon">✍️</div>
          <div className="stat-content">
            <h3>{stats.totalAuthors}</h3>
            <p>Total Authors</p>
          </div>
        </div>

        <div className="stat-card publishers">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{stats.totalPublishers}</h3>
            <p>Total Publishers</p>
          </div>
        </div>

        <div className="stat-card borrows">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{stats.activeBorrows}</h3>
            <p>Active Borrows</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.overdueBorrows}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2>📋 Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="no-activity">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <h4>{getBookTitle(activity.book?.id)}</h4>
                    <p>Borrowed by: {getMemberName(activity.member?.id)}</p>
                  </div>
                  <div className="activity-details">
                    <span className="activity-date">
                      {activity.borrowDate ? new Date(activity.borrowDate).toLocaleDateString() : "N/A"}
                    </span>
                    <span className={`activity-status ${activity.status?.toLowerCase()}`}>
                      {activity.status || "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>🚀 Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => window.location.href = "/books"}>
              <span className="action-icon">📚</span>
              Manage Books
            </button>
            <button className="action-btn secondary" onClick={() => window.location.href = "/members"}>
              <span className="action-icon">👥</span>
              Manage Members
            </button>
            <button className="action-btn tertiary" onClick={() => window.location.href = "/borrows"}>
              <span className="action-icon">📖</span>
              Manage Borrows
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

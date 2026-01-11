"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import MemberService from "../service/MemberService"
import BorrowService from "../service/BorrowService"
import "./ModernDashboard.css"

const ModernDashboard = ({ onNavigate } = {}) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalAuthors: 0,
    totalPublishers: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalFines: 0,
    newMembersThisMonth: 0,
    popularBooks: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null)
  const redirectedFlagKey = "dashboardRedirectedToFines"

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    setCurrentUser(storedUser ? JSON.parse(storedUser) : null)
    fetchDashboardData()
  }, [])

  const safeCall = (fn, fallbackData = []) => {
    if (typeof fn !== "function") {
      return Promise.resolve({ data: fallbackData })
    }
    return fn()
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch in parallel, but don't fail the whole dashboard if some modules aren't available
      const results = await Promise.allSettled([
        safeCall(() => BookService.getAllBooks()),
        safeCall(() => MemberService.getAllMembers()),
        safeCall(() => BookService.getAllAuthors?.()),
        safeCall(() => BookService.getAllPublishers?.()),
        safeCall(() => BorrowService.getAllBorrows())
      ])

      const booksRes = results[0]
      const membersRes = results[1]
      const authorsRes = results[2]
      const publishersRes = results[3]
      const borrowsRes = results[4]

      if (booksRes.status !== "fulfilled") {
        throw booksRes.reason
      }

      const books = booksRes.value?.data || []
      const members = membersRes.status === "fulfilled" ? (membersRes.value?.data || []) : []
      const authors = authorsRes.status === "fulfilled" ? (authorsRes.value?.data || []) : []
      const publishers = publishersRes.status === "fulfilled" ? (publishersRes.value?.data || []) : []
      const borrows = borrowsRes.status === "fulfilled" ? (borrowsRes.value?.data || []) : []

      // Calculate statistics
      const totalBookCopies = books.reduce((sum, book) => sum + (Number(book?.totalCopies) || 0), 0)
      const availableBookCopies = books.reduce((sum, book) => sum + (Number(book?.availableCopies) || 0), 0)
      const activeBorrows = borrows.filter((borrow) => {
        const status = (borrow?.status || "").toString().trim().toUpperCase()
        const hasReturnDate = !!borrow?.returnDate

        if (hasReturnDate) return false
        if (status === "RETURNED") return false

        // Accept common variants
        if (status === "BORROWED" || status === "OVERDUE" || status === "ACTIVE") return true
        if (status === "") return true

        // If backend sends humanized values
        if (status === "BORROW" || status === "BORROWING") return true

        return true
      }).length

      // In a copies-based system, each active borrow represents 1 borrowed copy.
      // Some legacy data may have borrows without decrementing availableCopies, so we reconcile both sources.
      const borrowedBookCopies = Math.max(0, totalBookCopies - availableBookCopies, activeBorrows)
      const reconciledAvailableBookCopies = totalBookCopies > 0
        ? Math.max(0, totalBookCopies - borrowedBookCopies)
        : availableBookCopies

      const now = new Date()
      const overdueBorrows = borrows.filter((borrow) => {
        const status = (borrow?.status || "").toString().trim().toUpperCase()
        if (status === "OVERDUE") return true

        // Fallback: dueDate passed and not returned
        if (!borrow?.returnDate && borrow?.dueDate) {
          const due = new Date(borrow.dueDate)
          if (!Number.isNaN(due.getTime()) && due < now) return true
        }
        return false
      }).length
      
      // Get top 5 popular books
      const bookBorrowCounts = borrows.reduce((acc, borrow) => {
        const bookId = borrow?.book?.id ?? borrow?.bookId ?? null
        if (bookId == null) return acc
        acc[bookId] = (acc[bookId] || 0) + 1
        return acc
      }, {})

      const popularBooks = books
        .map(book => ({
          ...book,
          borrowCount: bookBorrowCounts[book?.id] || 0
        }))
        .filter(book => (book.borrowCount || 0) > 0)
        .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0))
        .slice(0, 5)

      // Calculate new members this month
      const currentMonth = new Date().getMonth()
      const newMembersThisMonth = members.filter(member => {
        const memberMonth = new Date(member.createdAt || Date.now()).getMonth()
        return memberMonth === currentMonth
      }).length

      // Calculate total fines
      const totalFines = borrows
        .filter(borrow => borrow.fineAmount && borrow.fineAmount > 0)
        .reduce((sum, borrow) => sum + (borrow.fineAmount || 0), 0)

      setStats({
        totalBooks: totalBookCopies,
        totalMembers: members.length,
        totalAuthors: authors.length,
        totalPublishers: publishers.length,
        activeBorrows,
        overdueBorrows,
        availableBooks: reconciledAvailableBookCopies,
        borrowedBooks: borrowedBookCopies,
        totalFines,
        newMembersThisMonth,
        popularBooks
      })

      try {
        if (overdueBorrows > 0) {
          const alreadyRedirected = sessionStorage.getItem(redirectedFlagKey) === "true"
          if (!alreadyRedirected && typeof onNavigate === "function") {
            sessionStorage.setItem(redirectedFlagKey, "true")
            onNavigate("fines")
          }
        } else {
          sessionStorage.removeItem(redirectedFlagKey)
        }
      } catch (e) {
        // ignore sessionStorage errors
      }

      setLastUpdatedAt(new Date().toISOString())

    } catch (err) {
      console.error("Dashboard error:", err)
      setError("Failed to load dashboard data. Please check if backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatRoleLabel = (role) => {
    const raw = (role || "").toString().trim()
    if (!raw) return "User"
    const lower = raw.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  // Remove unused variable warning
  // eslint-disable-next-line no-unused-vars

  if (loading) {
    return (
      <div className="modern-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="modern-dashboard">
        <div className="error-container">
          <div className="error-icon"></div>
          <div className="error-content">
            <h3>Dashboard Error</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modern-dashboard lb-page">
      {/* Header */}
      <div className="dashboard-header lb-card">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title lb-page-title">Thalahena Public Library</h1>
            <a
              className="dashboard-link"
              href="https://www.srilanka-places.com/places/thalahena-public-library"
              target="_blank"
              rel="noreferrer"
            >
              https://www.srilanka-places.com/places/thalahena-public-library
            </a>
          </div>
          <div className="header-right">
            <button type="button" className="profile-box" onClick={() => setShowProfile(true)}>
              <div className="profile-title">
                Welcome{currentUser?.firstName ? `, ${currentUser.firstName}` : `, ${formatRoleLabel(currentUser?.role)}`}
              </div>
              <div
                className="profile-subtitle"
                style={{
                  color:
                    (currentUser?.role || "").toString().toUpperCase() === "ADMIN"
                      ? "var(--lb-danger)"
                      : "var(--lb-muted)"
                }}
              >
                {formatRoleLabel(currentUser?.role)}
              </div>
            </button>
            <div className="last-updated">
              Last updated: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : "-"}
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>My Profile</h3>
              <button type="button" className="profile-close" onClick={() => setShowProfile(false)}>
                ✕
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-row">
                <span className="profile-label">Name</span>
                <span className="profile-value">
                  {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "-"}
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Username</span>
                <span className="profile-value">{currentUser?.username || "-"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{currentUser?.email || "-"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role</span>
                <span className="profile-value">{(currentUser?.role || "-").toString().toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
            <div className="stat-breakdown">
              <span className="available">{stats.availableBooks} Available</span>
              <span className="borrowed">{stats.borrowedBooks} Borrowed</span>
            </div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.activeBorrows}</h3>
            <p>Active Borrows</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.overdueBorrows}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="dashboard-content-grid">
        {/* Popular Books */}
        <div className="content-section">
          <div className="section-header">
            <h2>Popular Books</h2>
            <p>Most borrowed books this month</p>
          </div>
          <div className="popular-books">
            {stats.popularBooks.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-book"></i>
                <h3>No popular books yet</h3>
                <p>Borrow activity will appear here once books are borrowed.</p>
              </div>
            ) : (
              stats.popularBooks.map((book, index) => (
                <div key={book.id} className="popular-book">
                  <div className="book-rank">#{index + 1}</div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>by {book.author?.name || "Unknown"}</p>
                    <div className="book-stats">
                      <span className="borrow-count">{book.borrowCount} borrows</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard

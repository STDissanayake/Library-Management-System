"use client"

import { useState, useEffect } from "react"
import Login from "./components/Login"
import ModernDashboard from "./components/ModernDashboard"
import ModernBooksList from "./components/ModernBooksList"
import AuthorsList from "./components/AuthorsList"
import PublishersList from "./components/PublishersList"
import MemberManagement from "./components/MemberManagement"
import UserManagement from "./components/UserManagement"
import BorrowManagement from "./components/BorrowManagement"
import FinesManagement from "./components/FinesManagement"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const role = (user?.role || "").toString().toUpperCase()
  const isAdmin = role === "ADMIN"
  const basePages = ["dashboard", "resources", "books", "authors", "publishers", "members", "borrows", "fines"]
  const allowedPages = isAdmin ? [...basePages, "users"] : basePages

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    setIsAuthenticated(!!token)
    setUser(userData ? JSON.parse(userData) : null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    if (!allowedPages.includes(currentPage)) {
      setCurrentPage(allowedPages[0])
    }
  }, [isAuthenticated, allowedPages, currentPage])

  const handleLogin = (userData) => {
    localStorage.setItem("token", "dummy-token-" + Date.now())
    localStorage.setItem("user", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)

    const nextRole = (userData?.role || "").toString().toUpperCase()
    const nextAllowedPages = nextRole === "ADMIN" ? [...basePages, "users"] : basePages
    setCurrentPage(nextAllowedPages[0])
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
    setCurrentPage("dashboard")
  }

  // Remove unused variable warning
  // eslint-disable-next-line no-unused-vars

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-layout">
          <div className="sidebar">
            <div className="sidebar-header">
              <h2 className="app-brand">Online Library Management System</h2>
            </div>
            <nav className="sidebar-nav">
              <div className="nav-section">
                <h3>📊 DASHBOARD</h3>
                <button
                  className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
                  onClick={() => setCurrentPage("dashboard")}
                >
                  <i className="fas fa-home"></i> Dashboard
                </button>
              </div>
              <div className="nav-section">
                <h3>📚 LIBRARY RESOURCES</h3>
                <button
                  className={`nav-item ${currentPage === "resources" ? "active" : ""}`}
                  onClick={() => setCurrentPage("resources")}
                >
                  <i className="fas fa-book"></i> Library Resources
                </button>
              </div>
              <div className="nav-section">
                <h3>👥 USERS</h3>
                <button
                  className={`nav-item ${currentPage === "members" ? "active" : ""}`}
                  onClick={() => setCurrentPage("members")}
                >
                  <i className="fas fa-users"></i> Member Management
                </button>
                {isAdmin && (
                  <button
                    className={`nav-item ${currentPage === "users" ? "active" : ""}`}
                    onClick={() => setCurrentPage("users")}
                  >
                    <i className="fas fa-user-shield"></i> User Management
                  </button>
                )}
              </div>
              <div className="nav-section">
                <h3>📖 BORROW/RETURN</h3>
                <button
                  className={`nav-item ${currentPage === "borrows" ? "active" : ""}`}
                  onClick={() => setCurrentPage("borrows")}
                >
                  <i className="fas fa-exchange-alt"></i> Borrow/Return
                </button>
              </div>
              <div className="nav-section">
                <h3>💰 FINES</h3>
                <button
                  className={`nav-item ${currentPage === "fines" ? "active" : ""}`}
                  onClick={() => setCurrentPage("fines")}
                >
                  <i className="fas fa-coins"></i> Fines
                </button>
              </div>
              <div className="nav-section">
                <button className="nav-item logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </nav>
          </div>
          
          <main className="main-content">
            {currentPage === "dashboard" && (
              <ModernDashboard
                onNavigate={(target) => {
                  if (target) setCurrentPage(target)
                }}
              />
            )}
            {currentPage === "resources" && (
              <ModernBooksList
                mode="hub"
                onNavigate={(target) => {
                  if (target) setCurrentPage(target)
                }}
              />
            )}
            {currentPage === "books" && (
              <ModernBooksList
                mode="books"
                onNavigate={(target) => {
                  if (target) setCurrentPage(target)
                }}
              />
            )}
            {currentPage === "authors" && (
              <AuthorsList
                onNavigate={(target) => {
                  if (target) setCurrentPage(target)
                }}
              />
            )}
            {currentPage === "publishers" && (
              <PublishersList
                onNavigate={(target) => {
                  if (target) setCurrentPage(target)
                }}
              />
            )}
            {currentPage === "members" && <MemberManagement />}
            {currentPage === "borrows" && <BorrowManagement />}
            {currentPage === "fines" && <FinesManagement />}
            {currentPage === "users" && isAdmin && <UserManagement />}
          </main>
        </div>
      )}
    </div>
  )  
}

export default App

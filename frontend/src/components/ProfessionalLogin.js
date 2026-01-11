"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ProfessionalLogin.css"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"

const ProfessionalLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store user info and token
        localStorage.setItem("user", JSON.stringify(data))
        localStorage.setItem("token", "professional-token-" + Date.now())
        localStorage.setItem("loginTime", new Date().toISOString())
        
        // Navigate to professional dashboard
        navigate("/professional-dashboard")
      } else {
        const text = await response.text()
        setError(text || `Login failed (HTTP ${response.status})`)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (role) => {
    setFormData({
      username: role,
      password: role === "admin" ? "admin123" : "librarian123"
    })
    setError("")
  }

  return (
    <div className="professional-login">
      <div className="login-background">
        <div className="login-container">
          {/* Header */}
          <div className="login-header">
            <div className="logo-section">
              <h1 className="system-title">
                📚 Library Management System
              </h1>
              <p className="system-subtitle">Professional Library Solutions</p>
            </div>
            <div className="header-info">
              <span className="version">v2.0 Professional</span>
              <span className="status">● System Online</span>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="quick-access">
            <h3>🔐 Quick Access</h3>
            <div className="access-cards">
              <div className="access-card admin" onClick={() => demoLogin("admin")}>
                <div className="card-icon">👑</div>
                <div className="card-content">
                  <h4>Administrator</h4>
                  <p>Full system access</p>
                  <small>admin / admin123</small>
                </div>
              </div>
              
              <div className="access-card staff" onClick={() => demoLogin("librarian")}>
                <div className="card-icon">📚</div>
                <div className="card-content">
                  <h4>Library Staff</h4>
                  <p>Manage library resources</p>
                  <small>librarian / librarian123</small>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="login-form-container">
            <h2>🔑 Secure Login</h2>
            <p className="login-description">
              Enter your credentials to access the library management system
            </p>

            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username or Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username or email"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="security-notice">
              <div className="notice-icon">🔒</div>
              <div className="notice-content">
                <h4>Secure Connection</h4>
                <p>Your login is encrypted and secure</p>
                <small>This is a private library management system</small>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <div className="footer-content">
              <p>© 2026 Library Management System</p>
              <div className="footer-links">
                <a href="/help">Help Center</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalLogin

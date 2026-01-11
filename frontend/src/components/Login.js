"use client"

import { useState } from "react"
import Register from "./Register"
import "./Login.css"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"

const Login = ({ onLogin }) => {
  const [showRegister, setShowRegister] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
        onLogin(data)
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

  const demoLogin = (username, password) => {
    setFormData({ username, password })
    setError("")
  }

  const handleRegister = (userData) => {
    setShowRegister(false)
    alert("Registration successful! Please check your email for login credentials.")
  }

  const handleBackToLogin = () => {
    setShowRegister(false)
  }

  if (showRegister) {
    return <Register onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📚 Library Management System</h1>
          <p>Please login to continue</p>
        </div>

        <div className="demo-accounts">
          <h3>🔐 Quick Access</h3>
          <div className="demo-buttons">
            <button className="demo-btn admin" onClick={() => demoLogin("admin", "admin123")}>
              <div className="demo-info">
                <strong>Admin</strong>
                <span>admin / admin123</span>
              </div>
            </button>
            <button className="demo-btn staff" onClick={() => demoLogin("librarian", "librarian123")}>
              <div className="demo-info">
                <strong>Staff</strong>
                <span>librarian / librarian123</span>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? 
            <button 
              type="button" 
              className="register-link" 
              onClick={() => setShowRegister(true)}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

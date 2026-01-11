"use client"

import { useState } from "react"
import "./Register.css"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"

const Register = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "STAFF",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Generate username from email if not provided
      const username = formData.username || formData.email.split('@')[0]

      if (!formData.password || formData.password.length < 8) {
        setError("Password must be at least 8 characters long")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      // Backend Role enum supports only ADMIN/STAFF
      const role = formData.role === "ADMIN" ? "ADMIN" : "STAFF"
      
      const userData = {
        ...formData,
        username: username,
        role,
        password: formData.password
      }

      delete userData.confirmPassword

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Registration successful! Username: ${username}`)
        setTimeout(() => {
          onRegister(data)
        }, 3000)
      } else {
        const errorText = await response.text()
        setError(errorText || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Registration failed. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>📝 Register New User</h1>
          <p>Create a new library staff account</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Residential Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter residential address"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Enter password (min 8 characters)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="back-btn" onClick={onBackToLogin}>
              ← Back to Login
            </button>
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register User"}
            </button>
          </div>
        </form>

        <div className="register-info">
          <h3>📋 Registration Information</h3>
          <ul>
            <li>All fields marked with * are required</li>
            <li>Username will be auto-generated from email</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register

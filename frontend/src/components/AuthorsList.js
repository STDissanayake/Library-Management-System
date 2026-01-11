"use client"

import { useState, useEffect } from "react"
import AuthorService from "../service/AuthorService"
import AuthorFormModal from "./AuthorFormModal"
import "./AuthorsList.css"

const AuthorsList = ({ onNavigate } = {}) => {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState(null)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const normalizeAuthor = (author) => {
    if (!author) return null

    const id = author.id ?? author.authorID
    const name = author.name ?? author.authorName

    return {
      id,
      name,
      bio: author.bio ?? "",
      nationality: author.nationality ?? ""
    }
  }

  const fetchAuthors = async () => {
    try {
      setLoading(true)
      const response = await AuthorService.getAllAuthors()
      const data = Array.isArray(response.data) ? response.data : []

      const normalized = data
        .map(normalizeAuthor)
        .filter((a) => a && a.id != null)

      setAuthors(normalized)
      setError(null)
    } catch (err) {
      console.error("Error fetching authors:", err)
      setError("Failed to load authors")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAuthor = () => {
    setEditingAuthor(null)
    setShowForm(true)
  }

  const handleEditAuthor = (author) => {
    setEditingAuthor(author)
    setShowForm(true)
  }

  const handleSaveAuthor = async (formData) => {
    try {
      if (editingAuthor) {
        await AuthorService.updateAuthor(editingAuthor.id, formData)
        console.log("[v0] Author updated successfully")
        alert("Author updated successfully!")
      } else {
        await AuthorService.createAuthor(formData)
        console.log("[v0] Author created successfully")
        alert("Author added successfully!")
      }
      setShowForm(false)
      fetchAuthors()
    } catch (err) {
      console.error("[v0] Error saving author:", err)
      alert("Error saving author: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      try {
        await AuthorService.deleteAuthor(id)
        setAuthors(authors.filter((author) => author.id !== id))
        alert("Author deleted successfully!")
      } catch (err) {
        console.error("[v0] Error deleting author:", err)
        alert("Failed to delete author: " + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) return <div className="loading">Loading authors...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="authors-management lb-page">
      <div className="authors-header lb-page-header">
        <h1 className="lb-page-title">Authors</h1>
        <div className="lb-header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate("resources")}
          >
            Back
          </button>
          <button className="btn btn-primary" onClick={handleAddAuthor}>
            + Add New Author
          </button>
        </div>
      </div>

      <div className="authors-table-card lb-card">
        <table className="authors-table">
          <thead>
            <tr>
              <th className="col-number">No.</th>
              <th className="col-name">Name</th>
              <th>Nationality</th>
              <th>Bio</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr key={author.id}>
                <td className="row-number">{index + 1}</td>
                <td>
                  <span className="author-name-link">{author.name}</span>
                </td>
                <td>{author.nationality || "N/A"}</td>
                <td>
                  {author.bio
                    ? (author.bio.length > 60 ? author.bio.substring(0, 60) + "..." : author.bio)
                    : "N/A"}
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEditAuthor(author)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(author.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {authors.length === 0 && (
          <div className="no-data lb-empty">
            <i className="fas fa-user"></i>
            <h3>No author records found</h3>
            <p>Start by adding an author to the library.</p>
          </div>
        )}
      </div>

      {showForm && (
        <AuthorFormModal author={editingAuthor} onSave={handleSaveAuthor} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

export default AuthorsList

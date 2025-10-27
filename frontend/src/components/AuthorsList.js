"use client"

import { useState, useEffect } from "react"
import AuthorService from "../service/AuthorService"
import AuthorFormModal from "./AuthorFormModal"
import "./AuthorsList.css"

const AuthorsList = () => {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState(null)

  useEffect(() => {
    fetchAuthors()
  }, [])

// In AuthorsList.js - Add data validation
const fetchAuthors = async () => {
  try {
    setLoading(true)
    const response = await AuthorService.getAllAuthors()
    console.log("Authors data:", response.data)

    // Remove duplicates based on authorID or name
    const uniqueAuthors = response.data.filter((author, index, self) =>
      index === self.findIndex(a =>
        a.authorID === author.authorID ||
        a.authorName === author.authorName
      )
    )

    setAuthors(uniqueAuthors)
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
        await AuthorService.updateAuthor(editingAuthor.authorID, formData)
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
        setAuthors(authors.filter((author) => author.authorID !== id))
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
    <div className="authors-container">
      <div className="table-header">
        <h2>👨‍💼 Authors ({authors.length})</h2>
        <button className="add-btn" onClick={handleAddAuthor}>
          + Add New
        </button>
      </div>
      <table className="authors-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>NAME</th>
            <th>BIO</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, index) => (
            <tr key={author.authorID}>
              <td className="row-number">{index + 1}</td>
              <td className="author-name">{author.authorName}</td>
              <td>{author.bio ? author.bio.substring(0, 50) + "..." : "N/A"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditAuthor(author)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(author.authorID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <AuthorFormModal author={editingAuthor} onSave={handleSaveAuthor} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

export default AuthorsList

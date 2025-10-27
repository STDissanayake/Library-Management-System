"use client"

import { useState, useEffect } from "react"
import PublisherService from "../service/PublisherService"
import PublisherFormModal from "./PublisherFormModal"
import "./PublishersList.css"

const PublishersList = () => {
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPublisher, setEditingPublisher] = useState(null)

  useEffect(() => {
    fetchPublishers()
  }, [])

  const fetchPublishers = async () => {
    try {
      setLoading(true)
      const response = await PublisherService.getAllPublishers()
      console.log("📚 Publishers API response:", response)

      // Ensure we're getting array data with proper structure
      const publishersData = response.data || response || []
      const formattedPublishers = Array.isArray(publishersData) ? publishersData : []

      console.log("📋 Formatted publishers:", formattedPublishers)
      setPublishers(formattedPublishers)
      setError(null)
    } catch (err) {
      console.error("❌ Error fetching publishers:", err)
      setError("Failed to load publishers. Please check if the backend server is running.")
      setPublishers([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddPublisher = () => {
    setEditingPublisher(null)
    setShowForm(true)
  }

  const handleEditPublisher = (publisher) => {
    console.log("✏️ Editing publisher:", publisher)
    setEditingPublisher(publisher)
    setShowForm(true)
  }

  const handleSavePublisher = async (formData) => {
    try {
      console.log("💾 Saving publisher data:", formData)

      if (editingPublisher) {
        await PublisherService.updatePublisher(editingPublisher.publisherID, formData)
        console.log("✅ Publisher updated successfully")
        alert("Publisher updated successfully!")
      } else {
        await PublisherService.createPublisher(formData)
        console.log("✅ Publisher created successfully")
        alert("Publisher added successfully!")
      }
      setShowForm(false)
      fetchPublishers() // Refresh the list
    } catch (err) {
      console.error("❌ Error saving publisher:", err)
      alert("Error saving publisher: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      try {
        await PublisherService.deletePublisher(id)
        setPublishers(publishers.filter((pub) => pub.publisherID !== id))
        alert("Publisher deleted successfully!")
      } catch (err) {
        console.error("❌ Error deleting publisher:", err)
        alert("Failed to delete publisher: " + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) return <div className="loading">Loading publishers...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="publishers-container">
      <div className="table-header">
        <h2>🏢 Publishers ({publishers.length})</h2>
        <button className="add-btn" onClick={handleAddPublisher}>
          + Add New
        </button>
      </div>

      <table className="publishers-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>NAME</th>
            <th>PUBLISHED YEAR</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {publishers.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">
                <div>🏢</div>
                <h4>No publishers found</h4>
                <p>Get started by adding your first publisher.</p>
                <button className="add-btn" onClick={handleAddPublisher}>
                  + Add First Publisher
                </button>
              </td>
            </tr>
          ) : (
            publishers.map((publisher, index) => (
              <tr key={publisher.publisherID}>
                <td className="row-number">{index + 1}</td>
                <td className="publisher-name">{publisher.name || "Unnamed Publisher"}</td>
                <td>{publisher.publishedYear || "N/A"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditPublisher(publisher)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(publisher.publisherID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <PublisherFormModal
          publisher={editingPublisher}
          onSave={handleSavePublisher}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default PublishersList
"use client"

import { useState, useEffect } from "react"
import PublisherService from "../service/PublisherService"
import PublisherFormModal from "./PublisherFormModal"
import "./PublishersList.css"

const PublishersList = ({ onNavigate } = {}) => {
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPublisher, setEditingPublisher] = useState(null)

  useEffect(() => {
    fetchPublishers()
  }, [])

  const normalizePublisher = (publisher) => {
    if (!publisher) return null

    const id = publisher.id ?? publisher.publisherID

    return {
      id,
      name: publisher.name ?? "",
      address: publisher.address ?? "",
      contactInfo: publisher.contactInfo ?? publisher.contact_info ?? ""
    }
  }

  const fetchPublishers = async () => {
    try {
      setLoading(true)
      const response = await PublisherService.getAllPublishers()

      const data = Array.isArray(response.data) ? response.data : []
      const normalized = data
        .map(normalizePublisher)
        .filter((p) => p && p.id != null)

      setPublishers(normalized)
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
        await PublisherService.updatePublisher(editingPublisher.id, formData)
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
        setPublishers(publishers.filter((pub) => pub.id !== id))
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
    <div className="publishers-management lb-page">
      <div className="publishers-header lb-page-header">
        <h1 className="lb-page-title">Publishers</h1>
        <div className="lb-header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate("resources")}
          >
            Back
          </button>
          <button className="btn btn-primary" onClick={handleAddPublisher}>
            + Add New Publisher
          </button>
        </div>
      </div>

      <div className="publishers-table-card lb-card">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Address</th>
              <th>Contact Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher, index) => (
              <tr key={publisher.id}>
                <td className="row-number">{index + 1}</td>
                <td className="publisher-name">{publisher.name || "Unnamed Publisher"}</td>
                <td>{publisher.address || "N/A"}</td>
                <td>{publisher.contactInfo || "N/A"}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEditPublisher(publisher)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(publisher.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {publishers.length === 0 && (
          <div className="no-data lb-empty">
            <i className="fas fa-building"></i>
            <h3>No publisher records found</h3>
            <p>Start by adding a publisher to the library.</p>
          </div>
        )}
      </div>

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
"use client"

import "./HoverCard.css"

const PublisherHoverCard = ({ publisher, onClose }) => {
  if (!publisher) return null

  return (
    <div className="hover-card-overlay" onClick={onClose}>
      <div className="hover-card" onClick={(e) => e.stopPropagation()}>
        <div className="hover-card-header">
          <h3>🏢 Publisher Information</h3>
          <button className="close-hover-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hover-card-content">
          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">🏢</span>
              Publisher Name
            </label>
            <p className="data-value publisher-name">
              {publisher.name || publisher.publisherName || "N/A"}
            </p>
          </div>

          {publisher.publisherID && (
            <div className="card-section">
              <label className="section-label">
                <span className="label-icon">🆔</span>
                Publisher ID
              </label>
              <p className="data-value">{publisher.publisherID}</p>
            </div>
          )}

          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">ℹ️</span>
              Information
            </label>
            <div className="info-content">
              <p className="info-text">
                {publisher.description || "View detailed publisher information in the Publishers section."}
              </p>
            </div>
          </div>

          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">💡</span>
              Note
            </label>
            <p className="data-value note-text">
              Click the "Publishers" tab in the sidebar to view complete publisher details.
            </p>
          </div>
        </div>

        <div className="hover-card-footer">
          <div className="footer-actions">
            <button className="action-btn secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublisherHoverCard
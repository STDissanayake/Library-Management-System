"use client"

import "./HoverCard.css"

const AuthorHoverCard = ({ author, onClose }) => {
  if (!author) return null

  return (
    <div className="hover-card-overlay" onClick={onClose}>
      <div className="hover-card" onClick={(e) => e.stopPropagation()}>
        <div className="hover-card-header">
          <h3>👨‍💼 Author Information</h3>
          <button className="close-hover-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hover-card-content">
          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">📛</span>
              Author Name
            </label>
            <p className="data-value author-name">
              {author.authorName || author.name || "N/A"}
            </p>
          </div>

          {author.authorID && (
            <div className="card-section">
              <label className="section-label">
                <span className="label-icon">🆔</span>
                Author ID
              </label>
              <p className="data-value">{author.authorID}</p>
            </div>
          )}

          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">ℹ️</span>
              Information
            </label>
            <div className="info-content">
              <p className="info-text">
                {author.bio || "View detailed author profiles and biographies in the Authors section."}
              </p>
            </div>
          </div>

          <div className="card-section">
            <label className="section-label">
              <span className="label-icon">💡</span>
              Note
            </label>
            <p className="data-value note-text">
              Click the "Authors" tab in the sidebar to view complete author details.
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

export default AuthorHoverCard
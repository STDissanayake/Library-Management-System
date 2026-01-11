"use client"

import "./BookHoverCard.css"

const BookHoverCard = ({ book, onClose }) => {
  if (!book) return null

  // Safe data extraction with better field name handling
  const getAuthorName = () => {
    return book.authorName ||
           (book.author && book.author.authorName) ||
           (book.author && book.author.name) ||
           "Unknown Author"
  }

  const getPublisherName = () => {
    return book.publisherName ||
           (book.publisher && book.publisher.name) ||
           "Unknown Publisher"
  }

  const getAvailabilityClass = (status) => {
    if (!status) return "unknown"
    const statusValue = status.toString().toUpperCase()
    switch (statusValue) {
      case "AVAILABLE":
      case "AVAILABLE":
        return "available"
      case "BORROWED":
        return "borrowed"
      case "RESERVED":
        return "reserved"
      case "NOT_AVAILABLE":
      case "NOT AVAILABLE":
        return "not-available"
      default:
        return "unknown"
    }
  }

  const getAvailabilityColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "#10b981";
      case "borrowed":
        return "#ef4444";
      case "reserved":
        return "#f59e0b";
      case "maintenance":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  }

  const displayAvailability = book.availability || book.status || "UNKNOWN"

  return (
    <div className="book-hover-card-overlay" onClick={onClose}>
      <div className="book-hover-card" onClick={(e) => e.stopPropagation()}>
        <div className="hover-card-header">
          <h3>📚 Book Details</h3>
          <button className="close-hover-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hover-card-content">
          <div className="card-section">
            <label>Title</label>
            <p>{book.title || "N/A"}</p>
          </div>

          <div className="card-section">
            <label>Author</label>
            <p>{getAuthorName()}</p>
          </div>

          <div className="card-section">
            <label>Publisher</label>
            <p>{getPublisherName()}</p>
          </div>

          <div className="card-section">
            <label>ISBN</label>
            <p>{book.isbn || "N/A"}</p>
          </div>

          <div className="card-section">
            <label>Published Year</label>
            <p>{book.publishedYear || "N/A"}</p>
          </div>

          <div className="card-section">
            <label>Category</label>
            <p>{book.category || "General"}</p>
          </div>

          <div className="card-section">
            <label>Language</label>
            <p>{book.language || "English"}</p>
          </div>

          <div className="card-section">
            <label>Copies Available</label>
            <p>{book.copies || 0}</p>
          </div>

          <div className="card-section">
            <label>Status</label>
            <span className={`availability-badge ${getAvailabilityClass(displayAvailability)}`}>
              {displayAvailability}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookHoverCard
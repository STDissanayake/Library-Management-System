"use client"
import "../styles/DetailModal.css"

const DetailModal = ({ isOpen, title, data, onClose, type }) => {
  if (!isOpen || !data) return null

  const getContent = () => {
    if (type === "author") {
      return (
        <>
          <h3>{data.name}</h3>
          <div className="modal-details">
            <div className="detail-row">
              <span className="label">Biography:</span>
              <span className="value">{data.biography || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Birth Date:</span>
              <span className="value">{data.birthDate || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Nationality:</span>
              <span className="value">{data.nationality || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{data.email || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{data.phone || "Not available"}</span>
            </div>
          </div>
        </>
      )
    } else if (type === "publisher") {
      return (
        <>
          <h3>{data.name}</h3>
          <div className="modal-details">
            <div className="detail-row">
              <span className="label">Address:</span>
              <span className="value">{data.address || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">City:</span>
              <span className="value">{data.city || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Country:</span>
              <span className="value">{data.country || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{data.email || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{data.phone || "Not available"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Website:</span>
              <span className="value">{data.website || "Not available"}</span>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{getContent()}</div>
      </div>
    </div>
  )
}

export default DetailModal

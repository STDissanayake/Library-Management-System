"use client"

import "../styles/FilterPanel.css"

const FilterPanel = ({
  authors,
  publishers,
  selectedAuthor,
  selectedPublisher,
  selectedStatus,
  onAuthorChange,
  onPublisherChange,
  onStatusChange,
  onClearFilters,
}) => {
  const statuses = ["AVAILABLE", "BORROWED", "RESERVED"]

  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-group">
        <label className="filter-label">Author</label>
        <select value={selectedAuthor} onChange={(e) => onAuthorChange(e.target.value)} className="filter-select">
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Publisher</label>
        <select value={selectedPublisher} onChange={(e) => onPublisherChange(e.target.value)} className="filter-select">
          <option value="">All Publishers</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Availability</label>
        <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="filter-select">
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button onClick={onClearFilters} className="clear-filters-btn">
        Clear Filters
      </button>
    </div>
  )
}

export default FilterPanel

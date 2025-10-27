"use client"

import "../styles/SearchBar.css"

const SearchBar = ({ searchTerm, onSearchChange, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books by title..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      <button onClick={onSearch} className="search-button">
        Search
      </button>
    </div>
  )
}

export default SearchBar

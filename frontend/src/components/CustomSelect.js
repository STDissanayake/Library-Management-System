"use client"

import { useState, useRef, useEffect } from "react"
import "./CustomSelect.css"

const CustomSelect = ({ name, value, onChange, options, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef(null)

  // Helper functions to extract ID and name from objects
  const getOptionId = (opt) => opt?.id || opt?.authorID || opt?.publisherID
  const getOptionName = (opt) => opt?.name || opt?.authorName || opt?.publisherName || ""

  const selectedOption = options?.find((opt) => String(getOptionId(opt)) === String(value))
  const filteredOptions = options?.filter((opt) => {
    const optName = getOptionName(opt)
    return optName.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionId) => {
    console.log(`🎯 CustomSelect: Selected ${name} = ${optionId}`)
    onChange({
      target: {
        name,
        value: optionId,
      },
    })
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="custom-select-container" ref={containerRef}>
      <button
        type="button"
        className="custom-select-button"
        onClick={handleButtonClick}
      >
        <span>{selectedOption ? getOptionName(selectedOption) : placeholder}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          <input
            type="text"
            className="custom-select-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="custom-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={getOptionId(option)}
                  type="button"
                  className={`custom-select-option ${
                    String(value) === String(getOptionId(option)) ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(getOptionId(option))}
                >
                  {getOptionName(option)}
                </button>
              ))
            ) : (
              <div className="custom-select-no-options">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
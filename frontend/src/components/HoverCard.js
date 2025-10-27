"use client"

import { useState } from "react"
import "./HoverCard.css"

const HoverCard = ({ title, data, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 10,
      left: rect.left,
    })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <div className="hover-card-trigger" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className="hover-card"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="hover-card-header">{title}</div>
          <div className="hover-card-content">
            {data &&
              Object.entries(data).map(([key, value]) => (
                <div key={key} className="hover-card-item">
                  <span className="hover-card-label">{key}:</span>
                  <span className="hover-card-value">{value || "N/A"}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HoverCard

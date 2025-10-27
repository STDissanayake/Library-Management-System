"use client"
import "../styles/Navigation.css"

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: "books", label: "📚 Books", icon: "fas fa-book" },
    { id: "authors", label: "✍️ Authors", icon: "fas fa-user" },
    { id: "publishers", label: "🏢 Publishers", icon: "fas fa-building" },
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? "active" : ""}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation

// In Sidebar.js - Fix the corrupted text
const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Library Management</h3>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4>DASHBOARD</h4> {/* Fixed from S3HB0ARD */}
          <ul>
            <li>
              <button
                className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                📊 Dashboard
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h4>MANAGEMENT</h4>
          <ul>
            <li>
              <button
                className={`nav-link ${activeTab === "books" ? "active" : ""}`}
                onClick={() => setActiveTab("books")}
              >
                📚 Books
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === "authors" ? "active" : ""}`}
                onClick={() => setActiveTab("authors")}
              >
                👨‍💼 Authors
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === "publishers" ? "active" : ""}`}
                onClick={() => setActiveTab("publishers")}
              >
                🏢 Publishers
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
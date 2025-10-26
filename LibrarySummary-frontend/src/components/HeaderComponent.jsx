import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          📚 LMS Dashboard
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/summary">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/popular-books">
                Popular Books
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/fines">
                Fines
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/fines/add">
                Add Fine
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;

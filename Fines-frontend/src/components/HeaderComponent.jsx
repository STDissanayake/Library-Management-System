import React from 'react'
import { Link } from 'react-router-dom'

const HeaderComponent = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div className="container">
      <Link className="navbar-brand" to="/">Library - Fines</Link>
      <div>
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/fines">Fines</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/fines/add">Add Fine</Link></li>
        </ul>
      </div>
    </div>
  </nav>
)

export default HeaderComponent

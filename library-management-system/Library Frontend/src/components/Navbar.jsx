import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="nav-title">Library Management System</h1>
                <ul className="nav-links">
                    <li>
                        <Link to="/">Borrow Management</Link>
                    </li>
                    <li>
                        <Link to="/return">Return Book</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
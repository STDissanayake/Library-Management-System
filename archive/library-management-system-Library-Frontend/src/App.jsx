import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BorrowManagement from './pages/BorrowManagement';
import ReturnBook from './pages/ReturnBook';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<BorrowManagement />} />
                        <Route path="/return" element={<ReturnBook />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
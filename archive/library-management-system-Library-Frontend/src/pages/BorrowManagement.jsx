import { useState, useEffect } from 'react';
import borrowService from '../services/borrowService';
import AddBorrowModal from '../components/AddBorrowModal';
import ReturnBookModal from '../components/ReturnBookModal';
import BorrowList from '../components/BorrowList';
import './BorrowManagement.css';

function BorrowManagement() {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [editingBorrow, setEditingBorrow] = useState(null);
    const [returningBorrow, setReturningBorrow] = useState(null);

    useEffect(() => {
        fetchBorrows();
    }, []);

    const fetchBorrows = async () => {
        try {
            console.log('Fetching borrows...');
            const response = await borrowService.getAllBorrows();
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
  console.log('Example borrow object:', response.data[0]);
}

            console.log('Is array?', Array.isArray(response.data));
            console.log('Data length:', response.data?.length);
            
            if (Array.isArray(response.data)) {
                setBorrows(response.data);
                console.log('Borrows set successfully');
            } else {
                console.error('Response data is not an array:', response.data);
                setBorrows([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching borrows:', error);
            console.error('Error response:', error.response);
            setBorrows([]);
            setLoading(false);
        }
    };

    const handleAddBorrow = () => {
        setEditingBorrow(null);
        setShowAddModal(true);
    };

    const handleEditBorrow = (borrow) => {
        setEditingBorrow(borrow);
        setShowAddModal(true);
    };

    const handleReturnBorrow = (borrow) => {
        setReturningBorrow(borrow);
        setShowReturnModal(true);
    };

    const handleDeleteBorrow = async (id) => {
        if (window.confirm('Are you sure you want to delete this borrow record?')) {
            alert('Delete functionality to be implemented');
        }
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setShowReturnModal(false);
        setEditingBorrow(null);
        setReturningBorrow(null);
        fetchBorrows(); 
    };

    console.log('Current borrows state:', borrows);
    console.log('Loading state:', loading);

    if (loading) {
        return <div className="loading">Loading borrow records...</div>;
    }

    return (
        <div className="borrow-management">
            <div className="header">
                <div>
                    <h1>Borrow & Return Management</h1>
                    <p className="subtitle">Manage all book borrowing and return operations</p>
                </div>
                <button className="btn-add" onClick={handleAddBorrow}>
                    + Add New Borrow
                </button>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-value">{borrows.length}</div>
                    <div className="stat-label">Total Borrows</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {borrows.filter(b => b.status === 'BORROWED').length}
                    </div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {borrows.filter(b => b.status === 'OVERDUE').length}
                    </div>
                    <div className="stat-label">Overdue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {borrows.filter(b => b.status === 'RETURNED').length}
                    </div>
                    <div className="stat-label">Returned</div>
                </div>
            </div>

            <BorrowList
                borrows={borrows}
                onEdit={handleEditBorrow}
                onDelete={handleDeleteBorrow}
                onReturn={handleReturnBorrow}
            />

            {showAddModal && (
                <AddBorrowModal 
                    borrow={editingBorrow}
                    onClose={handleModalClose}
                />
            )}

            {showReturnModal && (
                <ReturnBookModal
                    borrow={returningBorrow}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default BorrowManagement;
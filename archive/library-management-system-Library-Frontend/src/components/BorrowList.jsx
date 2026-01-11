import { useState } from 'react';
import './BorrowList.css';

function BorrowList({ borrows = [], onEdit, onDelete, onReturn }) {
    const [filter, setFilter] = useState('ALL');

    const getStatusClass = (status) => {
        switch (status) {
            case 'BORROWED': return 'status-borrowed';
            case 'RETURNED': return 'status-returned';
            case 'OVERDUE': return 'status-overdue';
            default: return '';
        }
    };

    // Define filteredBorrows FIRST
    const filteredBorrows = borrows.filter(borrow => {
        if (filter === 'ALL') return true;
        return borrow.status === filter;
    });

    // THEN use console.log
    console.log('Borrows prop:', borrows);
    console.log('Filtered borrows:', filteredBorrows);

    return (
        <div className="borrow-list">
            <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="ALL">All</option>
                    <option value="BORROWED">Borrowed</option>
                    <option value="RETURNED">Returned</option>
                    <option value="OVERDUE">Overdue</option>
                </select>
            </div>

            <table className="borrow-table">
                <thead>
                    <tr>
                        <th>Issue ID</th>
                        <th>Book Title</th>
                        <th>Member Name</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!borrows || borrows.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                No borrow records found
                            </td>
                        </tr>
                    ) : filteredBorrows.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                No records match the selected filter
                            </td>
                        </tr>
                    ) : (
                        filteredBorrows.map((borrow) => (
                            <tr key={borrow.id}>
                                <td>{borrow.id}</td>
                                <td>{borrow.book?.title || 'N/A'}</td>
                                <td>
                                    {borrow.member?.firstName || ''} {borrow.member?.lastName || ''}
                                </td>
                                <td>{borrow.borrowDate}</td>
                                <td>{borrow.dueDate}</td>
                                <td>{borrow.returnDate || '-'}</td>
                                <td>
                                    <span className={`status ${getStatusClass(borrow.status)}`}>
                                        {borrow.status}
                                    </span>
                                </td>
                                <td className="actions">
                                    {borrow.status === 'BORROWED' && (
                                        <button 
                                            className="btn-return" 
                                            onClick={() => onReturn(borrow)}
                                        >
                                            Return
                                        </button>
                                    )}
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => onEdit(borrow)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => onDelete(borrow.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default BorrowList;
import { useState } from 'react';
import borrowService from '../services/borrowService';
import './ReturnBookModal.css';

function ReturnBookModal({ borrow, onClose }) {
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
    const [condition, setCondition] = useState('GOOD');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const returnData = {
            borrowId: borrow.id,
            actualReturnDate: returnDate,
            condition: condition
        };

        try {
            const response = await borrowService.returnBook(returnData);
            alert(response.data);
            onClose(); // This will refresh the list
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content return-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Return Book</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="borrow-details">
                    <h3>Borrow Details:</h3>
                    <div className="detail-row">
                        <span className="label">Issue ID:</span>
                        <span className="value">{borrow.id}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Book:</span>
                        <span className="value">{borrow.book?.title || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Member:</span>
                        <span className="value">
                            {borrow.member?.firstName} {borrow.member?.lastName}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Issue Date:</span>
                        <span className="value">{borrow.borrowDate}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Due Date:</span>
                        <span className="value">{borrow.dueDate}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Return Date:</label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Book Condition:</label>
                        <select 
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            required
                        >
                            <option value="GOOD">Good</option>
                            <option value="POOR">Poor</option>
                            <option value="DAMAGED">Damaged</option>
                        </select>
                        <small className="help-text">
                            Note: Damaged or Poor condition may incur additional charges
                        </small>
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Process Return'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReturnBookModal;
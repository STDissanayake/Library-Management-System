import { useState, useEffect } from 'react';
import borrowService from '../services/borrowService';
import './AddBorrowModal.css';

function AddBorrowModal({ borrow, onClose }) {
    const [formData, setFormData] = useState({
        book_id: '',
        member_id: '',
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        borrowDays: 14
    });

    useEffect(() => {
        if (borrow) {
            setFormData({
                id: borrow.id,
                book_id: borrow.book?.id || '',
                member_id: borrow.member?.id || '',
                borrowDate: borrow.borrowDate,
                dueDate: borrow.dueDate,
                returnDate: borrow.returnDate,
                status: borrow.status
            });
        } else {
            // Auto-calculate due date
            const today = new Date();
            const dueDate = new Date(today);
            dueDate.setDate(dueDate.getDate() + 14);
            setFormData(prev => ({
                ...prev,
                dueDate: dueDate.toISOString().split('T')[0]
            }));
        }
    }, [borrow]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (borrow) {
                await borrowService.updateBorrow(formData);
                alert('Borrow updated successfully!');
            } else {
                await borrowService.addBorrow(formData);
                alert('Borrow added successfully!');
            }
            onClose();
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{borrow ? 'Edit Borrow' : 'Add New Borrow'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Book ID:</label>
                        <input
                            type="number"
                            name="book_id"
                            value={formData.book_id}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Member ID:</label>
                        <input
                            type="number"
                            name="member_id"
                            value={formData.member_id}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Issue Date:</label>
                        <input
                            type="date"
                            name="borrowDate"
                            value={formData.borrowDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Due Date:</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {borrow && (
                        <>
                            <div className="form-group">
                                <label>Return Date:</label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Status:</label>
                                <select 
                                    name="status" 
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="BORROWED">BORROWED</option>
                                    <option value="RETURNED">RETURNED</option>
                                    <option value="OVERDUE">OVERDUE</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {borrow ? 'Update' : 'Add'} Borrow
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBorrowModal;
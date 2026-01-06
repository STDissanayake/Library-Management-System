import { useState } from 'react';
import borrowService from '../services/borrowService';
import './ReturnBook.css';

function ReturnBook() {
    const [borrowId, setBorrowId] = useState('');
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
    const [condition, setCondition] = useState('GOOD');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const returnData = {
            borrowId: parseInt(borrowId),
            actualReturnDate: returnDate,
            condition: condition
        };

        try {
            const response = await borrowService.returnBook(returnData);
            alert(response.data);
            // Reset form
            setBorrowId('');
            setReturnDate(new Date().toISOString().split('T')[0]);
            setCondition('GOOD');
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="return-book-page">
            <div className="return-container">
                <div className="return-header">
                    <h1>Return Book</h1>
                    <p className="subtitle">Process book returns and assess condition</p>
                </div>
                
                <form onSubmit={handleSubmit} className="return-form">
                    <div className="form-group">
                        <label>Borrow ID (Issue ID):</label>
                        <input
                            type="number"
                            value={borrowId}
                            onChange={(e) => setBorrowId(e.target.value)}
                            placeholder="Enter Issue ID"
                            required
                        />
                        <small className="help-text">Enter the Issue ID from the borrow record</small>
                    </div>

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
                        <div className="condition-options">
                            <label className={`condition-option ${condition === 'GOOD' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="condition"
                                    value="GOOD"
                                    checked={condition === 'GOOD'}
                                    onChange={(e) => setCondition(e.target.value)}
                                />
                                <div className="option-content">
                                    <span className="option-icon">✓</span>
                                    <span className="option-label">Good</span>
                                    <span className="option-desc">No damage</span>
                                </div>
                            </label>
                            
                            <label className={`condition-option ${condition === 'POOR' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="condition"
                                    value="POOR"
                                    checked={condition === 'POOR'}
                                    onChange={(e) => setCondition(e.target.value)}
                                />
                                <div className="option-content">
                                    <span className="option-icon">⚠</span>
                                    <span className="option-label">Poor</span>
                                    <span className="option-desc">Minor wear</span>
                                </div>
                            </label>
                            
                            <label className={`condition-option ${condition === 'DAMAGED' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="condition"
                                    value="DAMAGED"
                                    checked={condition === 'DAMAGED'}
                                    onChange={(e) => setCondition(e.target.value)}
                                />
                                <div className="option-content">
                                    <span className="option-icon">✕</span>
                                    <span className="option-label">Damaged</span>
                                    <span className="option-desc">Significant damage</span>
                                </div>
                            </label>
                        </div>
                        {(condition === 'POOR' || condition === 'DAMAGED') && (
                            <div className="warning-message">
                                ⚠️ Additional charges may apply for damaged or poor condition books
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn-return-submit"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Process Return'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReturnBook;
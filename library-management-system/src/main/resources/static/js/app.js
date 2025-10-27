// Library Management System - Main JavaScript File

// Global variables
let currentModal = null;
let isEditMode = false;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Utility Functions
function showLoading(element = null) {
    const target = element || document.querySelector('#booksTable tbody');
    if (target) {
        target.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading...</p>
                </td>
            </tr>
        `;
    }
}

function hideLoading() {
    // Loading will be replaced by actual content
}

function showError(message, element = null) {
    const target = element || document.querySelector('#booksTable tbody');
    if (target) {
        target.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4 class="text-warning">Error</h4>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh me-1"></i>Try Again
                    </button>
                </td>
            </tr>
        `;
    }
}

function showSuccess(message) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-check-circle me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// API Helper Functions
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Book Management Functions
function showAddBookModal() {
    isEditMode = false;
    document.getElementById('bookModalLabel').textContent = 'Add New Book';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('bookModal'));
    modal.show();
    currentModal = modal;
}

function editBook(bookId) {
    isEditMode = true;
    document.getElementById('bookModalLabel').textContent = 'Edit Book';
    
    showLoading();
    
    apiCall(`/api/books/${bookId}`)
        .then(book => {
            populateBookForm(book);
            hideLoading();
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('bookModal'));
            modal.show();
            currentModal = modal;
        })
        .catch(error => {
            hideLoading();
            showError('Error loading book data. Please try again.');
        });
}

function populateBookForm(book) {
    document.getElementById('bookId').value = book.bookID;
    document.getElementById('title').value = book.title || '';
    document.getElementById('authorName').value = book.authorName || '';
    document.getElementById('publisherName').value = book.publisherName || '';
    document.getElementById('isbn').value = book.isbn || '';
    document.getElementById('publishedYear').value = book.publishedYear || '';
    document.getElementById('copies').value = book.copies || 1;
    document.getElementById('availability').value = book.availability || 'AVAILABLE';
    document.getElementById('language').value = book.language || 'English';
    document.getElementById('category').value = book.category || '';
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        showLoading();
        
        apiCall(`/api/books/${bookId}`, { method: 'DELETE' })
            .then(() => {
                hideLoading();
                showSuccess('Book deleted successfully!');
                location.reload();
            })
            .catch(error => {
                hideLoading();
                showError('Error deleting book. Please try again.');
            });
    }
}

function saveBook() {
    const form = document.getElementById('bookForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const bookData = {
        title: document.getElementById('title').value,
        isbn: document.getElementById('isbn').value,
        publishedYear: parseInt(document.getElementById('publishedYear').value) || null,
        language: document.getElementById('language').value,
        availability: document.getElementById('availability').value,
        copies: parseInt(document.getElementById('copies').value),
        category: document.getElementById('category').value
    };

    const bookId = document.getElementById('bookId').value;
    const url = isEditMode ? `/api/books/${bookId}` : '/api/books';
    const method = isEditMode ? 'PUT' : 'POST';

    showLoading();

    apiCall(url, {
        method: method,
        body: JSON.stringify(bookData)
    })
    .then(() => {
        hideLoading();
        if (currentModal) {
            currentModal.hide();
        }
        showSuccess(isEditMode ? 'Book updated successfully!' : 'Book added successfully!');
        location.reload();
    })
    .catch(error => {
        hideLoading();
        showError('Error saving book. Please try again.');
    });
}

// Search and Filter Functions
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm.trim()) {
        showLoading();
        apiCall(`/api/books/search?title=${encodeURIComponent(searchTerm)}`)
            .then(books => {
                updateBooksTable(books);
                hideLoading();
            })
            .catch(error => {
                hideLoading();
                showError('Error searching books. Please try again.');
            });
    } else {
        location.reload();
    }
}

function filterBooks() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value;
    
    if (statusFilter || searchTerm) {
        let url = '/api/books/filter';
        const params = new URLSearchParams();
        
        if (searchTerm) {
            params.append('title', searchTerm);
        }
        if (statusFilter) {
            params.append('status', statusFilter);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        showLoading();
        apiCall(url)
            .then(books => {
                updateBooksTable(books);
                hideLoading();
            })
            .catch(error => {
                hideLoading();
                showError('Error filtering books. Please try again.');
            });
    } else {
        location.reload();
    }
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    location.reload();
}

function updateBooksTable(books) {
    const tbody = document.querySelector('#booksTable tbody');
    tbody.innerHTML = '';
    
    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <i class="fas fa-book fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No books found</h4>
                    <p class="text-muted">Try adjusting your search criteria.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title || 'N/A'}</td>
            <td>${book.authorName || 'N/A'}</td>
            <td>${book.publisherName || 'N/A'}</td>
            <td>${book.isbn || 'N/A'}</td>
            <td>${book.publishedYear || 'N/A'}</td>
            <td>
                <span class="badge ${getStatusClass(book.availability)}">${book.availability}</span>
            </td>
            <td>
                <span>${book.copies} total</span>
                <br>
                <small class="text-muted">${book.copies} available</small>
            </td>
            <td>${book.language || 'English'}</td>
            <td>
                <button class="btn btn-sm btn-warning mb-1" onclick="editBook(${book.bookID})" data-bs-toggle="tooltip" title="Edit Book">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger mb-1" onclick="deleteBook(${book.bookID})" data-bs-toggle="tooltip" title="Delete Book">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Re-initialize tooltips for new content
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'AVAILABLE': return 'bg-success';
        case 'BORROWED': return 'bg-warning';
        case 'RESERVED': return 'bg-info';
        default: return 'bg-danger';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }
    
    // Add real-time search
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length > 2) {
                    searchBooks();
                } else if (this.value.length === 0) {
                    location.reload();
                }
            }, 500);
        });
    }
});

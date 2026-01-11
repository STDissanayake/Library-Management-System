import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")
const API_URL = `${API_BASE_URL}/api/borrows`

class BorrowService {
  // Get all borrows
  getAllBorrows() {
    return axios.get(API_URL)
  }

  // Get borrow by ID
  getBorrowById(id) {
    return axios.get(`${API_URL}/${id}`)
  }

  // Create new borrow
  createBorrow(borrowData) {
    return axios.post(API_URL, borrowData)
  }

  // Update borrow
  updateBorrow(id, borrowData) {
    return axios.put(`${API_URL}/${id}`, borrowData)
  }

  // Return book
  returnBook(borrowId) {
    return axios.post(`${API_URL}/return/${borrowId}`)
  }

  // Delete borrow
  deleteBorrow(id) {
    return axios.delete(`${API_URL}/${id}`)
  }

  // Get active borrows
  getActiveBorrows() {
    return axios.get(`${API_URL}/active`)
  }

  // Get overdue borrows
  getOverdueBorrows() {
    return axios.get(`${API_URL}/overdue`)
  }

  // Get member's borrows
  getMemberBorrows(memberId) {
    return axios.get(`${API_URL}/member/${memberId}`)
  }

  // Get book's borrows
  getBookBorrows(bookId) {
    return axios.get(`${API_URL}/book/${bookId}`)
  }

  // Check if member can borrow
  canMemberBorrow(memberId) {
    return axios.get(`${API_URL}/canBorrow/${memberId}`)
  }

  // Get borrows by status
  getBorrowsByStatus(status) {
    return axios.get(`${API_URL}/status/${status}`)
  }
}

const borrowService = new BorrowService()

export default borrowService

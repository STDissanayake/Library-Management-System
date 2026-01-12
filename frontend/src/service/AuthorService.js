import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")
const API_URL = `${API_BASE_URL}/api/authors`

class AuthorService {
  // Get all authors
  getAllAuthors() {
    return axios.get(API_URL)
  }

  // Get author by ID
  getAuthorById(id) {
    return axios.get(`${API_URL}/${id}`)
  }

  // Create a new author
  createAuthor(author) {
    return axios.post(API_URL, author)
  }

  // Update author details
  updateAuthor(id, author) {
    return axios.put(`${API_URL}/${id}`, author)
  }

  // Delete an author
  deleteAuthor(id) {
    return axios.delete(`${API_URL}/${id}`)
  }

  // Get author count
  getAuthorsCount() {
    return axios.get(`${API_URL}/count`)
  }
}

const authorService = new AuthorService()

export default authorService

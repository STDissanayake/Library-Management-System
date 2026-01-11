import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")
const API_URL = `${API_BASE_URL}/api/books`

// Cache for search results to avoid duplicate API calls
const searchCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Create axios instance with optimized config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // Increased timeout to reduce false failures
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor with conditional logging
api.interceptors.request.use(
  (config) => {
    // Only log in development for better performance
    if (process.env.NODE_ENV === 'development') {
      console.log(`📚 ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('❌ Request failed:', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message
    console.error(`❌ API Error (${error.response?.status}):`, errorMessage)
    return Promise.reject(error)
  }
)

class BookService {
  constructor() {
    this.searchAvailability = null
    this.allBooksCache = null
    this.lastAllBooksFetch = null
  }

  // Get all books with caching
  async getAllBooks() {
    const now = Date.now()
    // Cache all books for 30 seconds to avoid repeated calls
    if (this.allBooksCache && this.lastAllBooksFetch && (now - this.lastAllBooksFetch < 30000)) {
      return { data: this.allBooksCache }
    }

    try {
      const response = await api.get(API_URL)
      this.allBooksCache = response.data
      this.lastAllBooksFetch = now
      return response
    } catch (error) {
      console.error('Failed to fetch all books:', error)
      throw error
    }
  }

  // Get book by ID
  getBookById(id) {
    return api.get(`${API_URL}/${id}`)
  }

  // Create new book
  createBook(book) {
    // Invalidate caches when creating new book
    this.invalidateCaches()
    return api.post(API_URL, book)
  }

  // Update book
  updateBook(id, book) {
    // Invalidate caches when updating book
    this.invalidateCaches()
    return api.put(`${API_URL}/${id}`, book)
  }

  // Delete book
  deleteBook(id) {
    // Invalidate caches when deleting book
    this.invalidateCaches()
    return api.delete(`${API_URL}/${id}`)
  }

  // Smart search with caching and fallback
  async searchBooks(searchTerm) {
    if (!searchTerm?.trim()) {
      return this.getAllBooks()
    }

    const normalizedTerm = searchTerm.toLowerCase().trim()
    const cacheKey = `search:${normalizedTerm}`
    const now = Date.now()

    // Check cache first
    const cached = searchCache.get(cacheKey)
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`🎯 Using cached search results for: "${searchTerm}"`)
      return { data: cached.data }
    }

    try {
      // Try API search first
      console.log(`🔍 API searching for: "${searchTerm}"`)
      const response = await api.get(`${API_URL}/search?query=${encodeURIComponent(searchTerm)}`)

      // Cache successful results
      searchCache.set(cacheKey, {
        data: response.data,
        timestamp: now
      })

      return response
    } catch (apiError) {
      console.warn(`🔶 API search failed for "${searchTerm}", using client-side filtering`)

      // Fallback to client-side search
      const allBooksResponse = await this.getAllBooks()
      const allBooks = allBooksResponse.data || []

      const filteredBooks = this.clientSideSearch(allBooks, normalizedTerm)

      // Cache fallback results too
      searchCache.set(cacheKey, {
        data: filteredBooks,
        timestamp: now
      })

      return { data: filteredBooks }
    }
  }

  // Efficient client-side search
  clientSideSearch(books, searchTerm) {
    if (!searchTerm) return books

    return books.filter(book => {
      // Check multiple fields efficiently
      const searchableFields = [
        book.title,
        book.authorName,
        book.author?.authorName,
        book.author?.name,
        book.isbn,
        book.publisherName,
        book.publisher?.name,
        book.category
      ]

      return searchableFields.some(field =>
        field && field.toString().toLowerCase().includes(searchTerm)
      )
    })
  }

  // Quick search for real-time suggestions (faster, less comprehensive)
  async quickSearch(searchTerm, limit = 10) {
    if (!searchTerm?.trim()) {
      return { data: [] }
    }

    try {
      const response = await api.get(`${API_URL}/search/quick?query=${encodeURIComponent(searchTerm)}&limit=${limit}`)
      return response
    } catch (error) {
      // Fallback to limited client-side search
      const allBooksResponse = await this.getAllBooks()
      const allBooks = allBooksResponse.data || []
      const normalizedTerm = searchTerm.toLowerCase().trim()

      const results = this.clientSideSearch(allBooks, normalizedTerm)
        .slice(0, limit)

      return { data: results }
    }
  }

  // Search by specific fields
  searchBooksByTitle(title) {
    return api.get(`${API_URL}/search/title?title=${encodeURIComponent(title)}`)
  }

  searchBooksByAuthor(author) {
    return api.get(`${API_URL}/search/author?author=${encodeURIComponent(author)}`)
  }

  searchBooksByISBN(isbn) {
    return api.get(`${API_URL}/search/isbn?isbn=${encodeURIComponent(isbn)}`)
  }

  searchBooksByPublisher(publisher) {
    return api.get(`${API_URL}/search/publisher?publisher=${encodeURIComponent(publisher)}`)
  }

  // Filter methods
  filterBooksByStatus(status) {
    return api.get(`${API_URL}/filter/status?status=${encodeURIComponent(status)}`)
  }

  filterBooksByCategory(category) {
    return api.get(`${API_URL}/filter/category?category=${encodeURIComponent(category)}`)
  }

  // Advanced filtering
  async filterBooks(filters = {}) {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value)
      }
    })

    if (params.toString()) {
      return api.get(`${API_URL}/filter?${params.toString()}`)
    } else {
      return this.getAllBooks()
    }
  }

  // Check search availability (with caching)
  async checkSearchAvailability() {
    if (this.searchAvailability !== null) {
      return this.searchAvailability
    }

    try {
      // Quick test request
      await api.get(`${API_URL}/search/quick?query=test&limit=1`, { timeout: 3000 })
      this.searchAvailability = true
    } catch (error) {
      this.searchAvailability = false
    }

    return this.searchAvailability
  }

  // Invalidate all caches
  invalidateCaches() {
    searchCache.clear()
    this.allBooksCache = null
    this.lastAllBooksFetch = null
    console.log('🔄 All caches invalidated')
  }

  // Get cache statistics (useful for debugging)
  getCacheStats() {
    return {
      searchCacheSize: searchCache.size,
      allBooksCached: !!this.allBooksCache,
      searchAvailability: this.searchAvailability
    }
  }

  // Preload data for better UX
  async preloadData() {
    try {
      await this.getAllBooks()
      await this.checkSearchAvailability()
      console.log('📚 Data preloaded successfully')
    } catch (error) {
      console.warn('⚠️ Data preloading failed:', error.message)
    }
  }
}

// Create and export service instance
const bookService = new BookService()

// Preload data when service is imported (optional)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    bookService.preloadData()
  }, 1000)
}

export default bookService
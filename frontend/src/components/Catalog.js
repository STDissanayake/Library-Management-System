"use client"

import { useEffect, useState } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import BookCard from "./BookCard"
import SearchBar from "./SearchBar"
import FilterPanel from "./FilterPanel"
import "../styles/Catalog.css"

const Catalog = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedPublisher, setSelectedPublisher] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [booksRes, authorsRes, publishersRes] = await Promise.all([
          BookService.getAllBooks(),
          AuthorService.getAllAuthors(),
          PublisherService.getAllPublishers(),
        ])

        setBooks(booksRes.data)
        setFilteredBooks(booksRes.data)
        setAuthors(authorsRes.data)
        setPublishers(publishersRes.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load catalog. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = books

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by author
    if (selectedAuthor) {
      filtered = filtered.filter((book) => book.author?.id === Number.parseInt(selectedAuthor))
    }

    // Filter by publisher
    if (selectedPublisher) {
      filtered = filtered.filter((book) => book.publisher?.id === Number.parseInt(selectedPublisher))
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((book) => book.status === selectedStatus)
    }

    setFilteredBooks(filtered)
  }, [searchTerm, selectedAuthor, selectedPublisher, selectedStatus, books])

  const handleSearch = () => {
    // Search is already handled by useEffect, this is just for UX
    console.log("[v0] Search triggered for:", searchTerm)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedAuthor("")
    setSelectedPublisher("")
    setSelectedStatus("")
  }

  if (loading) {
    return (
      <div className="catalog-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading catalog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="catalog-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>📖 Library Catalog</h1>
        <p className="catalog-subtitle">Discover and explore our collection of books</p>
      </header>

      <div className="catalog-content">
        <aside className="sidebar">
          <FilterPanel
            authors={authors}
            publishers={publishers}
            selectedAuthor={selectedAuthor}
            selectedPublisher={selectedPublisher}
            selectedStatus={selectedStatus}
            onAuthorChange={setSelectedAuthor}
            onPublisherChange={setSelectedPublisher}
            onStatusChange={setSelectedStatus}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="main-content">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearch={handleSearch} />

          <div className="results-info">
            <p>
              Showing <strong>{filteredBooks.length}</strong> of <strong>{books.length}</strong> books
            </p>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="no-results">
              <p>No books found matching your criteria.</p>
              <button onClick={handleClearFilters} className="reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard key={book.bookID} book={book} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Catalog

import React, { useEffect, useState } from "react";
import { fetchPopularBooks } from "../services/PopularBookService";
import TopBooksChart from "./TopBooksChart";

const ListPopularBookComponent = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchPopularBooks()
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">📚 Most Popular Books</h3>

      <TopBooksChart books={books} />

      <table className="table table-striped table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Borrow Count</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.bookId}</td>
              <td>{book.title}</td>
              <td>{book.borrowCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPopularBookComponent;

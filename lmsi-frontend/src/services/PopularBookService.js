import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/popular-books";

export const fetchPopularBooks = () => axios.get(API_BASE_URL);

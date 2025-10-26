import axios from "axios";

const BASE_URL = "http://localhost:8081/api/summary";

export const fetchLibrarySummary = () => axios.get(BASE_URL);


// import axios from "axios";

// const BASE = "http://localhost:8081/api/fines";

// export const listFines = () => axios.get(BASE);
// export const getFine = (id) => axios.get(`${BASE}/${id}`);
// export const createFine = (fine) => axios.post(BASE, fine);
// export const updateFine = (id, fine) => axios.put(`${BASE}/${id}`, fine);
// export const deleteFine = (id) => axios.delete(`${BASE}/${id}`);

/////////

// import axios from "axios";

// const BASE_URL = "http://localhost:8081/api/fines";

// export const listFines = () => axios.get(BASE_URL);
// export const getFine = (id) => axios.get(`${BASE_URL}/${id}`);
// export const createFine = (fine) => axios.post(BASE_URL, fine);
// export const updateFine = (id, fine) => axios.put(`${BASE_URL}/${id}`, fine);
// export const deleteFine = (id) => axios.delete(`${BASE_URL}/${id}`);

///////////

// import React from 'react'
// // ...existing code...
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './App.css'

// file: src/services/FineService.js

import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8081/api/fines";

// ✅ Get all fines
export const listFines = () => axios.get(REST_API_BASE_URL);

// ✅ Create a new fine
export const createFine = (fine) => axios.post(REST_API_BASE_URL, fine);

// ✅ Get a fine by ID
export const getFine = (fineId) => axios.get(`${REST_API_BASE_URL}/${fineId}`);

// ✅ Update fine by ID
export const updateFine = (fineId, fine) =>
  axios.put(`${REST_API_BASE_URL}/${fineId}`, fine);

// ✅ Delete fine by ID
export const deleteFine = (fineId) => axios.delete(`${REST_API_BASE_URL}/${fineId}`);

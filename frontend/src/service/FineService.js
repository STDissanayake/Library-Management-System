import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")
const API_URL = `${API_BASE_URL}/api/fines`

class FineService {
  getAllFines() {
    return axios.get(API_URL)
  }

  getUnpaidFines() {
    return axios.get(`${API_URL}/unpaid`)
  }

  getPaidFines() {
    return axios.get(`${API_URL}/paid`)
  }

  getFinesByMember(memberId) {
    return axios.get(`${API_URL}/member/${memberId}`)
  }

  payFine(fineId) {
    return axios.put(`${API_URL}/pay/${fineId}`)
  }

  waiveFine(fineId) {
    return axios.put(`${API_URL}/waive/${fineId}`)
  }

  getStatistics() {
    return axios.get(`${API_URL}/statistics`)
  }
}

const fineService = new FineService()

export default fineService

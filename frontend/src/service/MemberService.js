import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")
const API_URL = `${API_BASE_URL}/api/members`

class MemberService {
  // Get all members
  getAllMembers() {
    return axios.get(API_URL)
  }

  // Get member by ID
  getMemberById(id) {
    return axios.get(`${API_URL}/${id}`)
  }

  // Create a new member
  createMember(member) {
    return axios.post(API_URL, member)
  }

  // Update member details
  updateMember(id, member) {
    return axios.put(`${API_URL}/${id}`, member)
  }

  // Delete a member
  async deleteMember(id) {
    try {
      return await axios.delete(`${API_URL}/${id}`)
    } catch (err) {
      const status = err?.response?.status
      if (status === 404) {
        // Fallback for the other backend variant which serves /members
        return axios.delete(`${API_BASE_URL}/members/${id}`)
      }
      throw err
    }
  }

  // Search members
  searchMembers(query) {
    return axios.get(`${API_URL}/search?query=${query}`)
  }

  // Get members by status
  getMembersByStatus(status) {
    return axios.get(`${API_URL}/status/${status}`)
  }

  // Get member count
  getMembersCount() {
    return axios.get(`${API_URL}/count`)
  }

  // Get members count by status
  getMembersCountByStatus(status) {
    return axios.get(`${API_URL}/count/${status}`)
  }
}

const memberService = new MemberService()

export default memberService

import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"
const API_URL = `${API_BASE_URL}/api/publishers`

class PublisherService {
  // Get all publishers
  getAllPublishers() {
    return axios.get(API_URL)
  }

  // Get publisher by ID
  getPublisherById(id) {
    return axios.get(`${API_URL}/${id}`)
  }

  // Create a new publisher - matches database schema
  createPublisher(publisher) {
    const publisherData = {
      name: publisher.name,
      publishedYear: publisher.publishedYear || new Date().getFullYear()
    }
    return axios.post(API_URL, publisherData)
  }

  // Update publisher details
  updatePublisher(id, publisher) {
    const publisherData = {
      name: publisher.name,
      publishedYear: publisher.publishedYear || new Date().getFullYear()
    }
    return axios.put(`${API_URL}/${id}`, publisherData)
  }

  // Delete a publisher
  deletePublisher(id) {
    return axios.delete(`${API_URL}/${id}`)
  }

  // Get publisher count
  getPublishersCount() {
    return axios.get(`${API_URL}/count`)
  }
}

export default new PublisherService()
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8080")
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
      address: publisher.address || "",
      contactInfo: publisher.contactInfo || ""
    }
    return axios.post(API_URL, publisherData)
  }

  // Update publisher details
  updatePublisher(id, publisher) {
    const publisherData = {
      name: publisher.name,
      address: publisher.address || "",
      contactInfo: publisher.contactInfo || ""
    }
    return axios.put(`${API_URL}/${id}`, publisherData)
  }

  // Delete a publisher
  deletePublisher(id) {
    return axios.delete(`${API_URL}/${id}`)
  }

}

const publisherService = new PublisherService()

export default publisherService
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/api/v1/borrow';

const borrowService = {
    // Get all borrows
    getAllBorrows: () => {
        return axios.get(`${API_BASE_URL}/getAllBorrow`);
    },

    // Add new borrow
    addBorrow: (borrowData) => {
        return axios.post(`${API_BASE_URL}/save`, borrowData);
    },

    // Update borrow
    updateBorrow: (borrowData) => {
        return axios.put(`${API_BASE_URL}/update`, borrowData);
    },

    // Return book
    returnBook: (returnData) => {
        return axios.post(`${API_BASE_URL}/return`, returnData);
    },

    // Get overdue books
    getOverdueBooks: () => {
        return axios.get(`${API_BASE_URL}/overdue`);
    },

    // Get member's borrows
    getMemberBorrows: (memberId) => {
        return axios.get(`${API_BASE_URL}/member/${memberId}`);
    },

    // Get active borrows
    getActiveBorrows: () => {
        return axios.get(`${API_BASE_URL}/active`);
    },

    // Check if member can borrow
    canMemberBorrow: (memberId) => {
        return axios.get(`${API_BASE_URL}/canBorrow/${memberId}`);
    }
};

export default borrowService;
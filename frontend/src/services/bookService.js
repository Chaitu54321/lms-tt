import api from '../api/axiosConfig';

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  toggleAvailability: async (id) => {
    const response = await api.patch(`/books/${id}/toggle-status`);
    return response.data;
  },

  incrementInterest: async (id) => {
    const response = await api.post(`/books/${id}/interest`);
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get('/books/requests');
    return response.data;
  },

  createRequest: async (requestData) => {
    const response = await api.post('/books/requests', requestData);
    return response.data;
  },

  approveRequest: async (id) => {
    const response = await api.post(`/books/requests/${id}/approve`);
    return response.data;
  }
};

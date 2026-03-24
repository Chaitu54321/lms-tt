import api from '../api/axiosConfig';

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },
  
  addToWishlist: async (bookId) => {
    const response = await api.post(`/users/wishlist/${bookId}`);
    return response.data;
  },

  removeFromWishlist: async (bookId) => {
    const response = await api.delete(`/users/wishlist/${bookId}`);
    return response.data;
  }
};

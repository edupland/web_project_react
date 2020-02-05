import axios from 'axios';

export default {
  getAll: async () => {
    const res = await axios.get('/api/user/list');
    return res.data || [];
  },

  getLoggedInUser: async() => {
    const res = await axios.get('/api/user/loggedInUser', { withCredentials: true });
    return res;
  },

  getLogout: async() => {
    const res = await axios.get('/api/user/logout');
    return res;
  },

  postRegister: async(user) => {
    const res = await axios.post('/api/user/register', { user });
    return res;
  },

  postLogin: async(user) => {
    const res = await axios.post('/api/user/login', { user });
    return res;
  }

}
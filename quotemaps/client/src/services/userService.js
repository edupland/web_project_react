import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get('/api/user/list');
    return res.data || [];
  },

  getLoggedInUser: async() => {
    let res = await axios.get('/api/user/loggedInUser', { withCredentials: true });
    return res.data || [];
  },

  getLogout: async() => {
    let res = await axios.get('/api/user/logout');
    return res;
  },

  postRegister: async(user) => {
    const res = await axios.post('/api/user/register', { user });
    return res.status;
  }

}
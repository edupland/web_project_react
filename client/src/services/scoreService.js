import axios from 'axios';

export default {
    postScore: async(points) => {
        const res = await axios.post('api/score/update/', { points });
        return res;
    },

    getTop: async(top) => {
        const res = await axios.get('api/score/rankings/', { params: { top }});
        return res.data || [];
    }
}
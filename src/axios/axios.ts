import axios from 'axios';

const Axios = axios.create({
    baseURL: 'https://love-ring-api.vercel.app/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default Axios;
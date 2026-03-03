import axios from 'axios';

const Axios = axios.create({
    // baseURL: 'https://love-ring-api.vercel.app/',
    // baseURL:'/',
    baseURL:'http://localhost:3000/',    
headers: {
        'Content-Type': 'application/json'
    }
});

export default Axios;
import axios from 'axios';

const baseURL = process.env.REACT_APP_URL;
console.log("BaURL:" + baseURL)
const api = axios.create({
    baseURL: baseURL,
});


export default api;
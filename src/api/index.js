import Axios from 'axios'
export const BASE_URL = process.env.REACT_APP_API_URL;
export const PROXY_URL = process.env.REACT_APP_PROXY_URL;

export default Axios.create({
    // baseURL: 'http://localhost:5001',
    // baseURL: 'https://api.wisebox.xyz',
    baseURL: PROXY_URL,
    // baseURL: 'http://192.168.18.199:5000'
})
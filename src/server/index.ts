import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";
import { message } from "antd";


const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
  headers: { Authorization: `Bearer ${Cookies.get(TOKEN)}` },
});

request.interceptors.response.use(
  async (response) => {
    return response;
  },
  (err) => {
    message.error(err.response?.data.message);
    return Promise.reject(err);
  },
);

export default request;

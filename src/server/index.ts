import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";
import { message } from "antd";

const request = axios.create({
  baseURL: "https://collection-management-server.up.railway.app/api/v1/",
  timeout: 15000,
  headers: { Authorization: `Bearer ${Cookies.get(TOKEN)}` },
});

request.interceptors.response.use(
  async (response) => {
    return response;
  },
  (err) => {
    message.error(err.response?.data.message);
    console.log(err);

    return Promise.reject(err);
  },
);

export default request;

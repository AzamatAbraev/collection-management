import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL;
// const URL = "http://localhost:3000/";
const socket = io(URL);

export default socket;

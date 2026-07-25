import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000" : "https://loveandring.com");

const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

export default socket;
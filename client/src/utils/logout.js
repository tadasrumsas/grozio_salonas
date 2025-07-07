import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const logout = async () => {
    await axios.get(`${API_URL}/users/logout`, { withCredentials: true });
};
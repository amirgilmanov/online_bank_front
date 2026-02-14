import api from "./axiosConfig";

export const AuthApi = {
    login: async (credentials) => {
        const response = await api.post("/api/login", credentials);
        return response.data;
    },

    verifyEmail: async (data) => {
        const response = await api.post("/api/verify", data);
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        await api.post("/api/logout", { refreshToken });
        localStorage.clear();
    }
};
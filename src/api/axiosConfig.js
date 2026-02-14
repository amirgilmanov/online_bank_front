import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // Убедись, что порт верный (8080 или 8081)
});

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ: Добавляет Access Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // --- ОТЛАДКА: Удалишь потом ---
        console.log("ПОЛНЫЙ ОБЪЕКТ ОШИБКИ:", error);
        if (error.response) {
            console.log("ДАННЫЕ ОТ БЭКА (DATA):", error.response.data);
            console.log("ТИП ДАННЫХ:", typeof error.response.data);
        }
        // ------------------------------

        const originalRequest = error.config;

        // Логика 401 (Refresh Token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const res = await axios.post("http://localhost:8080/api/silent", { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = res.data;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    return Promise.reject(new Error("Сессия истекла"));
                }
            }
        }

        let message = "Произошла непредвиденная ошибка";

        if (error.response) {
            const data = error.response.data;

            // Если бэк вернул ResponseEntity<String>, axios может обернуть её в объект,
            // если пришел заголовок application/json, либо оставить строкой.
            if (typeof data === 'string' && data.length > 0) {
                message = data;
            } else if (typeof data === 'object' && data !== null) {
                // Обработка MethodArgumentNotValidException (Map)
                if (error.response.status === 400 && !data.message) {
                    message = Object.values(data).join(", ");
                } else {
                    message = data.message || data.error || data.details || message;
                }
            }
        } else if (error.request) {
            message = "Сервер не отвечает";
        }

        // Мы ПРИНУДИТЕЛЬНО создаем новый объект ошибки с нашим текстом
        const customError = new Error(message);
        customError.status = error.response?.status; // сохраняем статус на всякий случай

        return Promise.reject(customError);
    }
);

export default api;
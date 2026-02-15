import axios from "axios";

const API_URL = "http://localhost:8081";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// 1. Интерцептор запроса: динамически берем токен из хранилища
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token)
        }
    });
    failedQueue = [];
}

// 2. Интерцептор ответа: обработка 401 (Refresh Token) и ошибок бэкенда
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если 401 ошибка и мы еще не пробовали обновить токен
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest)
                    })
                    .catch(err => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    // Используем отдельный запрос для обновления, чтобы не зациклиться
                    const res = await axios.post(`${API_URL}/api/silent`, {token: refreshToken});

                    // Универсальная проверка: если бэкенд обернул в tokens или отдал сразу
                    const data = res.data.tokens || res.data;
                    const {accessToken, refreshToken: newRefresh} = data;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefresh);

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    // Обновляем заголовок в упавшем запросе и повторяем его
                    processQueue(null, accessToken); // Выполняем все запросы из очереди
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // Улучшенная обработка ошибок от твоего AdviceController
        if (error.response && error.response.data) {
            const serverData = error.response.data;

            if (typeof serverData === 'object' && serverData !== null) {
                // Если прилетел объект ошибок (валидация), склеиваем их
                error.message = Object.values(serverData).join(", ");
            } else if (typeof serverData === 'string') {
                // Если прилетела просто строка ошибки
                error.message = serverData;
            }
        }

        return Promise.reject(error);
    }
);

// Вспомогательная функция (обертка)
const request = (method, url, data = null, params = null) =>
    api({method, url, data, params}).then(res => res.data);

// ============================
// API Объекты
// ============================

export const RegistrationApi = {
    signUp: (data) => request("post", "/api/sign-up", data),
    signUpAdmin: (data) => request("post", "/api/sign-up/admin", data),
};

export const AuthApi = {
    login: (data) => request("post", "/api/login", data),
    // Возвращает токены после ввода OTP кода
    verifyEmail: (data) => request("post", "/api/first-auth-verify/email", data),
    silentLogin: (token) => request("post", "/api/silent", {token}),
    logout: (token) => request("post", "/api/logout", {token}),
};

export const AccountApi = {
    createAccount: (currencyCode) => request("post", "/api/account", null, {currencyCode}),
    getBalance: (num) => request("get", `/api/account/${num}`),
    findAllByHolder: () => request("get", "/api/account/find-all-by-holder"),
};

export const OperationApi = {
    receive: (data) => request("post", "/api/operation/receive", data),
    withdraw: (data) => request("post", "/api/operation/withdraw", data),
    buyCurrency: (data) => request("post", "/api/operation/buy-currency", data),
    findAllByAccountNumber: (num, page, size) =>
        request("get", "/api/operation/find-all-by-account-number", null, {accountNumber: num, page, size}),
    findAllByUser: (page, size) =>
        request("get", "/api/operation/find-all-operation-by-user", null, {page, size}),
};

export const BonusApi = {
    convert: (data) => request("post", "/api/bonus/convert", data),
};

export const CurrencyApi = {
    createExchangeRate: (base, target, amount) => request("post", "/api/currency/create", {
        baseCurrency: base,
        targetCurrency: target,
        amount: amount
    }),
    convertCurrency: (data) => request("post", "/api/currency/convert", data),
    findRate: (base, target) => request("post", "/api/currency/find-rate", {
        baseCurrency: base,
        targetCurrency: target
    }),
};

export const PartnerApi = {
    createPartner: (data) => request("post", "/api/bank-partner", data),
    getAllPartners: () => request("get", "/api/bank-partner")
};

export const PayApi = {
    pay: (data) => request("post", "/api/pay", data),
};

export const QuestApi = {
    createRandomQuest: () => request("post", "/api/quest"),
    getUserQuests: () => request("get", "/api/quest/get-user")
};

export const UserApi = {
    deleteByPhoneNumber: (phone) => request("delete", `/api/user/${encodeURIComponent(phone)}`),
};

export const CodeApi = {
    deleteOldCodes: () => request("delete", "/api/code"),
    regenerateOtp: (email) => request("patch", "/api/code/update/otp", {email}),
};

export const TestApi = {
    test: () => request("get", "/test"),
    pureJava: () => request("get", "/test/pure"),
    sendEmail: (email) => request("post", `/test/send-email?email=${encodeURIComponent(email)}`),
};

export default api;
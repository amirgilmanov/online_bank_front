import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Авто-подстановка токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 2. Интерсептор обработки ошибок и Silent Login
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        //// Если получили 401 и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    // Пытаемся обновить токен
                    const res = await axios.post("http://localhost:8081/api/silent", { token: refreshToken });
                    const { accessToken, refreshToken: newRefresh } = res.data.tokens;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefresh);
                    // Повторяем запрос с новым токеном
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token expired or stolen", refreshError);
                    localStorage.clear();
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

// Вспомогательная функция для сокращения кода
const request = (method, url, data = null, params = null) =>
    api({ method, url, data, params }).then(res => res.data);

// ============================
// API Объекты
// ============================

export const RegistrationApi = {
    signUp: (data) => request("post", "/api/sign-up", data),
    signUpAdmin: (data) => request("post", "/api/sign-up/admin", data),
};

export const AuthApi = {
    login: (data) => request("post", "/api/login", data),
    verifyEmail: (data) => request("post", "/api/first-auth-verify/email", data),
    silentLogin: (token) => request("post", "/api/silent", { token }),
    logout: (token) => request("post", "/api/logout", { token }),
};

export const AccountApi = {
    createAccount: (currencyCode) => request("post", "/api/account", null, { currencyCode }),
    getBalance: (num) => request("get", `/api/account/${num}`),
    findAllByHolder: () => request("get", "/api/account/find-all-by-holder"),
};

export const OperationApi = {
    receive: (data) => request("post", "/api/operation/receive", data),
    withdraw: (data) => request("post", "/api/operation/withdraw", data),
    buyCurrency: (data) => request("post", "/api/operation/buy-currency", data),
    findAllByAccountNumber: (num, page, size) =>
        request("get", "/api/operation/find-all-by-account-number", null, { accountNumber: num, page, size }),
    findAllByUser: (page, size) =>
        request("get", "/api/operation/find-all-operation-by-user", null, { page, size }),
};

export const BonusApi = {
    convert: (data) => request("post", "/api/bonus/convert", data),
};

export const CurrencyApi = {
    createExchangeRate: (data) => request("post", "/api/currency/create", data),
    convertCurrency: (data) => request("post", "/api/currency/convert", data),
    findRate: (base, target) => request("get", "/api/currency/find-rate", null, { baseCurrency: base, targetCurrency: target }),
};

export const PartnerApi = {
    createPartner: (data) => request("post", "/api/bank-partner", data),
};

export const PayApi = {
    pay: (data) => request("post", "/api/pay", data),
};

export const QuestApi = {
    createRandomQuest: () => request("post", "/api/quest"),
};

export const UserApi = {
    deleteByPhoneNumber: (phone) => request("delete", `/api/user/${encodeURIComponent(phone)}`),
};

export const CodeApi = {
    deleteOldCodes: () => request("delete", "/api/code"),
    regenerateOtp: (email) => request("patch", "/api/code/update/otp", { email }),
};

export const TestApi = {
    test: () => request("get", "/test"),
    pureJava: () => request("get", "/test/pure"),
    sendEmail: (email) => request("post", `/test/send-email?email=${encodeURIComponent(email)}`),
};
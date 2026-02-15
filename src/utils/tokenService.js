export const TokenService = {
    save: (data) => {
        // Проверяем, лежат ли токены в поле tokens или в корне объекта
        const accessToken = data.tokens?.accessToken || data.accessToken;
        const refreshToken = data.tokens?.refreshToken || data.refreshToken;

        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        console.log("Tokens saved successfully");
    },
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
    getRefresh: () => localStorage.getItem("refreshToken")
};

export class tokenService {
}
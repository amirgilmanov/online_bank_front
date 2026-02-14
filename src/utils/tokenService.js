export const TokenService = {
    save: (data) => {
        const tokens = data.tokens;
        if (tokens?.accessToken) localStorage.setItem("accessToken", tokens.accessToken);
        if (tokens?.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
    },
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
    getRefresh: () => localStorage.getItem("refreshToken")
};
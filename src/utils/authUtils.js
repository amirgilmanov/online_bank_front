import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        // Обычно поле называется 'role' или 'roles'. Проверь в консоли свой токен!
        return decoded.roles
    } catch (e) {
        console.error("Can not parse jwt token")
        return null;
    }
};
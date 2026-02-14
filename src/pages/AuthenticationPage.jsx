import React, { useEffect, useState, useCallback } from "react"; // 1. Добавили useCallback
import { AuthApi } from "../api";
import { useAuthForms } from "../hooks/useAuthForms";
import { TokenService } from "../utils/tokenService";
import { VerifySection, LoginSection } from "../components/AuthForms";

const AuthenticationPage = () => {
    // 2. Сначала состояния
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { verifyForm, handleVerifyChange, loginForm, handleLoginChange } = useAuthForms();

    // 3. Общая функция запроса
    const executeRequest = useCallback(async (requestFn, successCallback) => {
        setLoading(true);
        setError(null);
        try {
            const result = await requestFn();
            if (successCallback) successCallback(result);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // Пустой массив, так как она не зависит от данных рендера

    // 4. Оборачиваем handleSilent в useCallback, чтобы добавить в зависимости useEffect
    const handleSilent = useCallback(() => {
        const refresh = TokenService.getRefresh();
        if (!refresh) return; // Просто выходим, если токена нет
        executeRequest(() => AuthApi.silentLogin(refresh), (res) => TokenService.save(res));
    }, [executeRequest]);

    // 5. Теперь useEffect стоит после объявлений и имеет все зависимости
    useEffect(() => {
        const refresh = TokenService.getRefresh();
        if (refresh && !data) {
            handleSilent();
        }
    }, [handleSilent, data]); // Теперь ESLint доволен

    const handleLogin = () => {
        executeRequest(() => AuthApi.login(loginForm), (res) => TokenService.save(res));
    };

    const handleLogout = () => {
        const refresh = TokenService.getRefresh();
        executeRequest(() => AuthApi.logout(refresh), () => {
            TokenService.clear();
            setData(null);
        });
    };

    return (
        <div className="container">
            {/* Твой JSX без изменений */}
            <h2>Аутентификация</h2>
            <VerifySection
                form={verifyForm}
                onChange={handleVerifyChange}
                onVerify={() => executeRequest(() => AuthApi.verifyEmail(verifyForm))}
                loading={loading}
            />
            <hr />
            <LoginSection
                form={loginForm}
                onChange={handleLoginChange}
                onLogin={handleLogin}
                loading={loading}
            />
            <hr />
            <section>
                <h3>Сессия</h3>
                {/*<button onClick={handleSilent} disabled={loading}>Обновить вход (Silent)</button>*/}
                <button onClick={handleLogout} disabled={loading} className="btn-danger">Выйти</button>
            </section>
            {loading && <p>Загрузка...</p>}
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default AuthenticationPage;
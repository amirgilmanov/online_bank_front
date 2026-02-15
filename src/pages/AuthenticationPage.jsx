import React, {useCallback, useState} from "react";
import {AuthApi} from "../api";
import {useAuthForms} from "../hooks/useAuthForms";
import {TokenService} from "../utils/tokenService";
import {LoginSection} from "../components/AuthForm";

const AuthenticationPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Берем только то, что нужно для логина
    const {loginForm, handleLoginChange} = useAuthForms();

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
    }, []);

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
            <h2>Вход в систему</h2>

            {/* Секция верификации УДАЛЕНА отсюда */}

            <LoginSection
                form={loginForm}
                onChange={handleLoginChange}
                onLogin={handleLogin}
                loading={loading}
            />

            <hr/>

            <section>
                <h3>Управление сессией</h3>
                <button onClick={handleLogout} disabled={loading} className="btn-danger">Выйти</button>
            </section>

            {loading && <p>Загрузка...</p>}
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default AuthenticationPage;
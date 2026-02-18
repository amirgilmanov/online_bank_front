import React, { useState, useEffect } from "react";
import { AuthApi, RegistrationApi, CodeApi } from "../api";
import { useAuthForms } from "../hooks/useAuthForms";
import { TokenService } from "../utils/tokenService";
import { LoginSection, VerifySection } from "../components/AuthForm";
import RegistrationForm from "../components/RegistrationForm";
import {getDeviceId} from "../utils/authUtils";
import {getDeviceName} from "../utils/deviceService";

const AuthenticationPage = ({ initialMode = "login", onSuccess, userRole }) => {
    const [isNewUser, setIsNewUser] = useState(false);
    // 1. Сначала ВСЕ хуки (стейты, формы, эффекты)
    const [mode, setMode] = useState(initialMode === "registration" ? "register" : "login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resendStatus, setResendStatus] = useState("");

    const {
        loginForm, handleLoginChange,
        regForm, handleRegChange,
        verifyForm, handleVerifyChange, setVerifyForm
    } = useAuthForms();

    useEffect(() => {
        if (mode !== "verify" && mode !== "completed") {
            setMode(initialMode === "registration" ? "register" : "login");
        }
    }, [initialMode]);

    // 2. Объявление всех функций-обработчиков
    const execute = async (task) => {
        setLoading(true);
        setError(null);
        setResendStatus("");
        try {
            await task();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => execute(async () => {
        const refresh = TokenService.getRefresh();
        const deviceId = getDeviceId(); // Получаем ID устройства
        if (refresh) {
            try {
                // Отправляем объект согласно RefreshTokenRequestDto
                await AuthApi.logout(refresh, deviceId);
            } catch (e) {
                console.error("Logout API failed", e);
            }
        }
        TokenService.clear();
        setResendStatus("Вы вышли из системы");
        setTimeout(() => window.location.reload(), 1000);
    });

    const handleLogin = () => execute(async () => {
        const payload = {
            email: loginForm.email,
            password: loginForm.password,
            deviceId: getDeviceId(),
            deviceName: getDeviceName(),
            userAgent: navigator.userAgent
        };

        try {
            const res = await AuthApi.login(payload);
            TokenService.save(res.data);
            setMode("completed");
            setTimeout(() => onSuccess ? onSuccess() : window.location.reload(), 1000);
        } catch (err) {
            if (err.response?.status === 403) {
                const newId = err.deviceId || err.response.data?.deviceId;
                if (newId) {
                    localStorage.setItem("deviceId", newId);
                }

                setVerifyForm(prev => ({
                    ...prev,
                    email: loginForm.email,
                    deviceId: newId || getDeviceId()
                }));

                setMode("verify");
                setResendStatus("Безопасный вход: подтвердите личность кодом из письма");
            } else {
                throw err;
            }
        }
    });

    const handleRegister = (e, isAdmin = false) => {
        if (e) e.preventDefault();
        execute(async () => {
            const apiCall = isAdmin ? RegistrationApi.signUpAdmin : RegistrationApi.signUp;
            await apiCall(regForm);
            setIsNewUser(true); // ЗАПОМИНАЕМ, что это регистрация
            setVerifyForm(prev => ({ ...prev, email: regForm.email }));
            setMode("verify");
        });
    };

    // 3. Исправленный Verify (ДОБАВЛЕНЫ deviceName и userAgent)
    const handleVerify = () => execute(async () => {
        const verifyPayload = {
            email: verifyForm.email,
            code: verifyForm.code,
            deviceId: localStorage.getItem("deviceId") || getDeviceId(),
            deviceName: getDeviceName(),
            userAgent: navigator.userAgent
        };

        let response;
        // Используем наш флаг вместо mode
        if (isNewUser) {
            response = await RegistrationApi.verifyFirst(verifyPayload);
        } else {
            response = await AuthApi.verifyDefault(verifyPayload);
        }

        TokenService.save(response.data);
        setMode("completed");
        setTimeout(() => onSuccess ? onSuccess() : window.location.reload(), 1500);
    });

    const handleRegisterSubmit = (e) => {
        if (e) e.preventDefault();
        // При регистрации мы сразу просим ввести код, который должен был быть
        // отправлен при каком-то предварительном действии или будет отправлен сейчас
        setVerifyForm(prev => ({ ...prev, email: regForm.email }));
        setMode("register"); // Режим регистрации (ввод кода для нового юзера)
    };

    // 3. Логические проверки (после объявления функций)
    const isAuthenticated = !!TokenService.getRefresh();

    // Early Return для авторизованного пользователя
    if (isAuthenticated && (mode === "login" || mode === "register")) {
        return (
            <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
                <div className="auth-body">
                    <h3>Вы уже в системе</h3>
                    <p>Вы вошли как <b>{userRole || 'Пользователь'}</b></p>
                    {resendStatus && <div className="auth-info" style={{color: 'blue'}}>{resendStatus}</div>}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button onClick={onSuccess} className="btn-success">В личный кабинет</button>
                        <button onClick={handleLogout} className="btn-danger" disabled={loading}>
                            {loading ? "Выход..." : "Выйти из аккаунта"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Основной рендер (для гостей или режима верификации)
    return (
        <div className="auth-card">
            {(mode === "login" || mode === "register") && (
                <div className="auth-tabs">
                    <button
                        className={mode === "login" ? "tab-btn active" : "tab-btn"}
                        onClick={() => setMode("login")}
                    >
                        Вход
                    </button>
                    <button
                        className={mode === "register" ? "tab-btn active" : "tab-btn"}
                        onClick={() => setMode("register")}
                    >
                        Регистрация
                    </button>
                </div>
            )}

            <div className="auth-body">
                {error && <div className="auth-error">{error}</div>}
                {resendStatus && <div className="auth-info" style={{color: 'blue', marginBottom: '10px'}}>{resendStatus}</div>}

                {mode === "login" && (
                    <LoginSection
                        form={loginForm}
                        onChange={handleLoginChange}
                        onLogin={handleLogin}
                        loading={loading}
                    />
                )}

                {mode === "register" && (
                    <RegistrationForm
                        values={regForm}
                        onChange={handleRegChange}
                        onSubmit={(e) => handleRegister(e, false)}
                        onAdminSubmit={() => handleRegister(null, true)}
                        loading={loading}
                        showAdminButton={userRole === "ROLE_ADMIN"}
                    />
                )}

                {mode === "verify" && (
                    <VerifySection
                        form={verifyForm}
                        onChange={handleVerifyChange}
                        onVerify={handleVerify}
                        onResend={() => execute(async () => {
                            await CodeApi.regenerateOtp(verifyForm.email);
                            setResendStatus("Код отправлен повторно");
                        })}
                        loading={loading}
                    />
                )}

                {mode === "completed" && (
                    <div className="auth-success" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'green' }}>✓ Добро пожаловать!</h3>
                        <p>Вы успешно авторизованы.</p>
                    </div>
                )}
            </div>

            {mode === "verify" && (
                <button className="back-link" onClick={() => setMode("login")}>
                    ← Вернуться к входу
                </button>
            )}
        </div>
    );
};

export default AuthenticationPage;
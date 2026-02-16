import React, { useState, useEffect } from "react";
import { AuthApi, RegistrationApi, CodeApi } from "../api";
import { useAuthForms } from "../hooks/useAuthForms";
import { TokenService } from "../utils/tokenService";
import { LoginSection, VerifySection } from "../components/AuthForm";
import RegistrationForm from "../components/RegistrationForm";

const AuthenticationPage = ({ initialMode = "login", onSuccess, userRole }) => {
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

    const handleLogin = () => execute(async () => {
        await AuthApi.login(loginForm);
        setVerifyForm(prev => ({ ...prev, email: loginForm.email }));
        setMode("verify");
    });

    // НОВАЯ ЛОГИКА LOGOUT
    const handleLogout = () => execute(async () => {
        const refresh = TokenService.getRefresh();
        if (refresh) {
            await AuthApi.logout(refresh);
        }
        TokenService.clear();
        setResendStatus("Вы вышли из системы");
        // Опционально: перезагрузить страницу или сбросить стейт
        setTimeout(() => window.location.reload(), 1000);
    });

    const handleRegister = (e, isAdmin = false) => {
        if (e) e.preventDefault();
        execute(async () => {
            const apiCall = isAdmin ? RegistrationApi.signUpAdmin : RegistrationApi.signUp;
            await apiCall(regForm);
            setVerifyForm(prev => ({ ...prev, email: regForm.email }));
            setMode("verify");
        });
    };

    const handleVerify = () => execute(async () => {
        const res = await AuthApi.verifyEmail(verifyForm);

        // Сохраняем токены через твой TokenService
        TokenService.save(res);

        setMode("completed");

        // Вместо перезагрузки всей страницы, плавно переходим в личный кабинет
        setTimeout(() => {
            if (onSuccess) {
                onSuccess(); // Вызываем смену компонента в App.js
            } else {
                // Запасной вариант, если пропс не передан
                window.location.href = "/";
            }
        }, 1500);
    });

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
                    <>
                        <LoginSection
                            form={loginForm}
                            onChange={handleLoginChange}
                            onLogin={handleLogin}
                            loading={loading}
                        />

                        {/* ДОБАВЛЕНА СЕКЦИЯ ВЫХОДА */}
                        {TokenService.getRefresh() && (
                            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    className="btn-danger"
                                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                >
                                   Выйти
                                </button>
                            </div>
                        )}
                    </>
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
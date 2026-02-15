import React, {useState} from "react";
// ДОБАВИЛИ CodeApi в импорт
import {AuthApi, CodeApi, RegistrationApi} from "../api";
import {useForm} from "../hooks/useForm";
import RegistrationForm, {VerifySection} from "../components/RegistrationForm";
import {getDeviceName} from "../utils/deviceService";

const RegistrationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [verified, setVerified] = useState(false);

    // ДОБАВИЛИ состояние для статуса переотправки
    const [resendStatus, setResendStatus] = useState("");

    const [verifyForm, setVerifyForm] = useState({
        email: "",
        code: "",
        deviceName: getDeviceName(),
        userAgent: navigator.userAgent
    });

    const {values, handleChange, reset} = useForm({
        name: "", surname: "", patronymic: "", phone: "", password: "", email: "",
    });

    // Функция переотправки кода
    const handleResendCode = async () => {
        setLoading(true);
        setError(null);
        setResendStatus("");
        try {
            await CodeApi.regenerateOtp(verifyForm.email);
            setResendStatus("Новый код отправлен на почту!");
        } catch (err) {
            setError("Не удалось отправить код: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (apiMethod) => {
        setLoading(true);
        setError(null);
        try {
            await apiMethod(values);
            setVerifyForm(prev => ({...prev, email: values.email}));
            setSuccess(true);
            reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthApi.verifyEmail(verifyForm);
            if (response.tokens) {
                localStorage.setItem("accessToken", response.tokens.accessToken);
                localStorage.setItem("refreshToken", response.tokens.refreshToken);
            }
            setVerified(true);
            setSuccess(false);
        } catch (err) {
            setError("Ошибка верификации: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ОСТАВЛЯЕМ ОДИН ЧИСТЫЙ RETURN
    return (
        <div className="container">
            {/* 1. Экран регистрации */}
            {!success && !verified && (
                <>
                    <h2>Регистрация</h2>
                    <RegistrationForm
                        values={values}
                        onChange={handleChange}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister(RegistrationApi.signUp);
                        }}
                        onAdminSubmit={() => handleRegister(RegistrationApi.signUpAdmin)}
                        loading={loading}
                    />
                </>
            )}

            {/* 2. Экран верификации */}
            {success && !verified && (
                <>
                    <VerifySection
                        form={verifyForm}
                        onChange={(e) => setVerifyForm({...verifyForm, [e.target.name]: e.target.value})}
                        onVerify={handleVerify}
                        onResend={handleResendCode} // Теперь пропс передается верно
                        loading={loading}
                    />
                    {resendStatus && <p style={{color: 'blue', marginTop: '10px'}}>{resendStatus}</p>}
                </>
            )}

            {/* 3. Финальный экран */}
            {verified && <h2 style={{color: 'green'}}>Поздравляем! Регистрация и верификация завершены.</h2>}

            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        </div>
    );
};

export default RegistrationPage;
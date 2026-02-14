import React, { useState } from "react";
import { RegistrationApi, CodeApi } from "../api"; // Добавили CodeApi
import { useForm } from "../hooks/useForm";
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [lastEmail, setLastEmail] = useState(""); // Запоминаем email для повторной отправки

    const { values, handleChange, reset } = useForm({
        name: "", surname: "", patronymic: "", phone: "", password: "", email: "",
    });

    const handleRegister = async (apiMethod) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const emailToSave = values.email; // Сохраняем email перед очисткой формы
            await apiMethod(values);
            setLastEmail(emailToSave);
            setSuccess(true);
            reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError(null);
        try {
            await CodeApi.regenerateOtp(lastEmail);
            alert(`Новый код успешно отправлен на ${lastEmail}`);
        } catch (err) {
            setError("Не удалось отправить код повторно: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Регистрация в системе</h2>

            <RegistrationForm
                values={values}
                onChange={handleChange}
                onSubmit={(e) => { e.preventDefault(); handleRegister(RegistrationApi.signUp); }}
                onAdminSubmit={() => handleRegister(RegistrationApi.signUpAdmin)}
                loading={loading}
            />

            {error && <p className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {success && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid green', borderRadius: '8px' }}>
                    <p className="success" style={{ color: 'green', margin: 0 }}>
                        Код подтверждения отправлен на почту. Подтвердите владение почтой!
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        style={{ marginTop: '10px', cursor: 'pointer' }}
                    >
                        {loading ? "Отправка..." : "Отправить код еще раз"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegistrationPage;
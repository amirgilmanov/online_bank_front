import React, { useState } from 'react';
import { CodeApi } from '../api';

const CodePage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [email, setEmail] = useState('');
    const [regenerateResult, setRegenerateResult] = useState('');

    // Универсальный обработчик запросов
    const execute = async (requestFn, successMsg, callback) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await requestFn();
            setSuccess(successMsg);
            if (callback) callback(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onDeleteOld = () => {
        if (window.confirm('Удалить все старые коды? Это необратимо.')) {
            execute(CodeApi.deleteOldCodes, 'Старые коды успешно удалены');
        }
    };

    const onRegenerate = (e) => {
        e.preventDefault();
        execute(
            () => CodeApi.regenerateOtp(email),
            'OTP код успешно перегенерирован',
            (result) => {
                setRegenerateResult(result);
                setEmail('');
            }
        );
    };

    return (
        <div className="component-container">
            <h2>Управление Verification кодами</h2>

            {/* Админ-секция */}
            <section className="admin-box" style={{ marginBottom: '30px', padding: '20px', border: '1px dotted red' }}>
                <h3>Администрирование</h3>
                <button
                    className="btn-danger"
                    onClick={onDeleteOld}
                    disabled={loading}
                >
                    {loading ? 'Удаление...' : 'Очистить старые коды'}
                </button>
            </section>

            {/* Форма перегенерации */}
            <section style={{ maxWidth: '400px' }}>
                <h3>Перегенерация OTP</h3>
                <form onSubmit={onRegenerate}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>Отправить новый код</button>
                </form>
            </section>

            {/* Статус и результаты */}
            <StatusMessages error={error} success={success} result={regenerateResult} />

            <footer style={{ marginTop: '30px', fontSize: '0.9em', color: '#666' }}>
                <p><strong>Важно:</strong> Очистка кодов доступна только для ADMIN. Перегенерация отправит письмо пользователю.</p>
            </footer>
        </div>
    );
};

// Маленький под-компонент для чистоты кода
const StatusMessages = ({ error, success, result }) => (
    <div style={{ marginTop: '20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {result && (
            <div className="result-box">
                <h4>Полученный код:</h4>
                <pre>{result}</pre>
            </div>
        )}
    </div>
);

export default CodePage;
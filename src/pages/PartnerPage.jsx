import React, { useState } from 'react';
import { PartnerApi } from '../api'; // Убедись, что в api.js он с большой буквы
import { useForm } from '../hooks/useForm';
import PartnerCreateForm from '../components/PartnerCreateForm';

const PartnerPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Инициализируем форму через наш универсальный хук
    const { values, handleChange, reset } = useForm({
        name: '',
        category: 'MEDICINE',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await PartnerApi.createPartner(values);
            setSuccess(true);
            reset(); // Очищаем форму одной командой!
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Управление партнерами банка</h2>

            <PartnerCreateForm
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />

            {error && <div className="error-message" style={{ color: 'red' }}>Ошибка: {error}</div>}

            {success && (
                <div className="success-message" style={{ color: 'green', marginTop: '15px' }}>
                    Партнер успешно создан!
                </div>
            )}

            <div className="admin-note" style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee' }}>
                <p><strong>Примечание:</strong> Данный метод доступен только пользователям с ролью ADMIN.</p>
            </div>
        </div>
    );
};

export default PartnerPage;
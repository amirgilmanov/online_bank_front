import React, { useState } from 'react';
import { PayApi } from '../api'; // Убедись, что в api.js экспорт с большой буквы
import { usePayForm } from '../hooks/usePayForm';
import PayForm from '../components/PayForm';
import OperationTable from '../components/OperationTable';

const PayPage = () => {
    const { values, handleChange, reset } = usePayForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await PayApi.pay({
                ...values,
                serviceRequestAmount: parseFloat(values.serviceRequestAmount)
            });
            setResponse(result);
            reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Совершение платежа</h2>

            <PayForm
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />

            {error && <div className="error-message" style={{color: 'red'}}>Ошибка: {error}</div>}

            {response && (
                <div style={{ marginTop: '30px' }}>
                    <h3>Успешная операция:</h3>
                    {/* Переиспользуем нашу таблицу! Оборачиваем в массив. */}
                    <OperationTable operations={[response]} />
                </div>
            )}
        </div>
    );
};

export default PayPage;
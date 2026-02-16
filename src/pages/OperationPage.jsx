import React, { useState } from 'react';
import { OperationApi } from '../api';
import { useForm } from '../hooks/useForm';
import OperationTable from '../components/OperationTable';

const OperationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [operations, setOperations] = useState([]);

    // Начальные значения соответствуют FinanceOperationDto
    const { values, handleChange, resetForm } = useForm({
        accountNumber: '',
        amount: '',
        description: '',
        selectedCurrencyCode: 'RUB' // Значение по умолчанию
    });

    // Общая функция для вызова API
    const executeOperation = async (apiMethod) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...values,
                amount: parseFloat(values.amount)
            };

            const result = await apiMethod(payload);

            // Добавляем результат в начало списка операций
            setOperations(prev => [result, ...prev]);
            // Очищаем форму после успеха (опционально)
            // resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Операции со счетом</h2>

            <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <div className="form-group">
                    <label>Номер счета:</label>
                    <input
                        name="accountNumber"
                        value={values.accountNumber || ''}
                        onChange={handleChange}
                        placeholder="0000000000000000"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Сумма:</label>
                    <input
                        type="number"
                        name="amount"
                        value={values.amount || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Валюта операции:</label>
                    <select
                        name="selectedCurrencyCode"
                        value={values.selectedCurrencyCode}
                        onChange={handleChange}
                    >
                        <option value="RUB">RUB</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Описание:</label>
                    <input
                        name="description"
                        value={values.description || ''}
                        onChange={handleChange}
                        placeholder="Назначение платежа"
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                        onClick={() => executeOperation(OperationApi.receive)}
                        disabled={loading}
                        className="btn-success"
                    >
                        {loading ? '...' : 'Пополнить'}
                    </button>

                    <button
                        onClick={() => executeOperation(OperationApi.withdraw)}
                        disabled={loading}
                        className="btn-danger"
                    >
                        {loading ? '...' : 'Снять'}
                    </button>
                </div>
            </div>

            {error && <p className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div style={{ marginTop: '30px' }}>
                <h3>История текущей сессии</h3>
                <OperationTable operations={operations} />
            </div>
        </div>
    );
};

export default OperationPage;
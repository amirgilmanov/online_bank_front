import React, { useState } from 'react';
import { CurrencyApi } from '../api';
import { useForm } from '../hooks/useForm';
import CurrencySelect from '../components/CurrencySelect';

const CurrencyPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    // Используем наш универсальный хук для всех трех форм
    const createForm = useForm({ baseCurrency: 'USD', targetCurrency: 'RUB', rate: '' });
    const convertForm = useForm({ baseCurrency: 'USD', targetCurrency: 'RUB', amount: '' });
    const findForm = useForm({ baseCurrency: 'USD', targetCurrency: 'RUB' });

    // Универсальная обертка для запросов
    const execute = async (requestFn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await requestFn();
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Валютный Сервис</h2>

            {/* Форма 1: Создание курса */}
            <form onSubmit={(e) => { e.preventDefault(); execute(() => CurrencyApi.createExchangeRate(createForm.values)); }}>
                <h3>Создать курс (ADMIN)</h3>
                <CurrencySelect label="Базовая" name="baseCurrency" value={createForm.values.baseCurrency} onChange={createForm.handleChange} />
                <CurrencySelect label="Котируемая" name="targetCurrency" value={createForm.values.targetCurrency} onChange={createForm.handleChange} />
                <input type="number" name="rate" placeholder="Курс" value={createForm.values.rate} onChange={createForm.handleChange} required />
                <button type="submit" disabled={loading}>Создать</button>
            </form>

            <hr />

            {/* Форма 2: Конвертация */}
            <form onSubmit={(e) => { e.preventDefault(); execute(() => CurrencyApi.convertCurrency(convertForm.values)); }}>
                <h3>Конвертация</h3>
                <CurrencySelect label="Из" name="baseCurrency" value={convertForm.values.baseCurrency} onChange={convertForm.handleChange} />
                <CurrencySelect label="В" name="targetCurrency" value={convertForm.values.targetCurrency} onChange={convertForm.handleChange} />
                <input type="number" name="amount" placeholder="Сумма" value={convertForm.values.amount} onChange={convertForm.handleChange} required />
                <button type="submit" disabled={loading}>Конвертировать</button>
            </form>

            <hr />

            {/* Форма 3: Поиск курса */}
            <form onSubmit={(e) => { e.preventDefault(); execute(() => CurrencyApi.findRate(findForm.values.baseCurrency, findForm.values.targetCurrency)); }}>
                <h3>Найти курс</h3>
                <CurrencySelect label="Базовая" name="baseCurrency" value={findForm.values.baseCurrency} onChange={findForm.handleChange} />
                <CurrencySelect label="Котируемая" name="targetCurrency" value={findForm.values.targetCurrency} onChange={findForm.handleChange} />
                <button type="submit" disabled={loading}>Найти</button>
            </form>

            {/* Вывод результата */}
            {loading && <p>Загрузка...</p>}
            {error && <div className="error">{error}</div>}
            {response && <pre className="result-box">{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
};

export default CurrencyPage;
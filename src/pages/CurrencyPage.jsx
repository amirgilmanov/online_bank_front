import React, {useState} from 'react';
import {CurrencyApi} from '../api';
import {useForm} from '../hooks/useForm';
import CurrencySelect from '../components/CurrencySelect';

const CurrencyPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    // Состояния для трех разных форм
    const createForm = useForm({baseCurrency: 'USD', targetCurrency: 'RUB', rate: ''});
    const convertForm = useForm({baseCurrency: 'USD', targetCurrency: 'RUB', amount: ''});
    const findForm = useForm({baseCurrency: 'USD', targetCurrency: 'RUB'});

    // Универсальная обертка для запросов
    const execute = async (requestFn) => {
        setLoading(true);
        setError(null);
        setResponse(null); // Сбрасываем старый результат перед новым запросом
        try {
            const result = await requestFn();
            setResponse(result);
        } catch (err) {
            // Обработка ошибки: выводим сообщение от сервера или стандартное
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container" style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <h2 style={{textAlign: 'center', color: '#2c3e50'}}>Валютный Сервис</h2>

            <div style={{display: 'grid', gap: '30px'}}>

                {/* Форма 1: Создание курса (ADMIN) */}
                <section style={{padding: '20px', border: '1px solid #eee', borderRadius: '10px'}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        execute(() => CurrencyApi.createExchangeRate(createForm.values));
                    }}>
                        <h3>Создать/Обновить курс (ADMIN)</h3>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end'}}>
                            <CurrencySelect label="Базовая" name="baseCurrency" value={createForm.values.baseCurrency}
                                            onChange={createForm.handleChange}/>
                            <CurrencySelect label="Котируемая" name="targetCurrency"
                                            value={createForm.values.targetCurrency}
                                            onChange={createForm.handleChange}/>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <label>Курс:</label>
                                <input type="number" name="rate" step="0.0001" placeholder="90.50"
                                       value={createForm.values.rate} onChange={createForm.handleChange} required
                                       style={{padding: '8px'}}/>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">Установить</button>
                        </div>
                    </form>
                </section>

                {/* Форма 2: Конвертация */}
                <section style={{padding: '20px', border: '1px solid #eee', borderRadius: '10px'}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        execute(() => CurrencyApi.convertCurrency(convertForm.values));
                    }}>
                        <h3>Конвертация суммы</h3>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end'}}>
                            <CurrencySelect label="Из" name="baseCurrency" value={convertForm.values.baseCurrency}
                                            onChange={convertForm.handleChange}/>
                            <CurrencySelect label="В" name="targetCurrency" value={convertForm.values.targetCurrency}
                                            onChange={convertForm.handleChange}/>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <label>Сумма:</label>
                                <input type="number" name="amount" placeholder="100" value={convertForm.values.amount}
                                       onChange={convertForm.handleChange} required style={{padding: '8px'}}/>
                            </div>
                            <button type="submit" disabled={loading}>Рассчитать</button>
                        </div>
                    </form>
                </section>

                {/* Форма 3: Поиск курса */}
                <section style={{padding: '20px', border: '1px solid #eee', borderRadius: '10px'}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        execute(() => CurrencyApi.findRate(findForm.values.baseCurrency, findForm.values.targetCurrency));
                    }}>
                        <h3>Узнать текущий курс</h3>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
                            <CurrencySelect label="Базовая" name="baseCurrency" value={findForm.values.baseCurrency}
                                            onChange={findForm.handleChange}/>
                            <CurrencySelect label="Котируемая" name="targetCurrency"
                                            value={findForm.values.targetCurrency} onChange={findForm.handleChange}/>
                            <button type="submit" disabled={loading} className="btn-secondary">Найти</button>
                        </div>
                    </form>
                </section>

            </div>

            {/* --- ВЫВОД РЕЗУЛЬТАТОВ --- */}
            <div style={{marginTop: '30px'}}>
                {loading && <p style={{textAlign: 'center', color: '#666'}}>⌛ Обработка запроса...</p>}

                {error && (
                    <div className="error-box" style={{
                        padding: '15px',
                        backgroundColor: '#fff5f5',
                        border: '1px solid #feb2b2',
                        borderRadius: '8px',
                        color: '#c53030'
                    }}>
                        <strong>Ошибка:</strong> {error}
                    </div>
                )}

                {response && (
                    <div className="result-card" style={{
                        padding: '20px',
                        backgroundColor: '#f0fff4',
                        border: '1px solid #9ae6b4',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* 1. Если это расчет суммы или поиск курса (1 USD = 90 RUB) */}
                        {response.convertedAmount !== undefined ? (
                            <div style={{textAlign: 'center'}}>
                                <span style={{fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase'}}>Результат операции</span>
                                <h2 style={{margin: '10px 0', color: '#276749'}}>
                                    {response.amount} {response.baseCurrency} = {response.convertedAmount} {response.targetCurrency}
                                </h2>
                                <p style={{fontSize: '0.85rem', color: '#4a5568'}}>Курс обмена:
                                    1 {response.baseCurrency} ≈ {(response.convertedAmount / response.amount).toFixed(4)} {response.targetCurrency}</p>
                            </div>
                        ) : response.rate ? (
                            /* 2. Если это подтверждение от ADMIN-формы */
                            <div style={{textAlign: 'center'}}>
                                <h3 style={{color: '#2f855a', margin: '0 0 10px 0'}}>✅ Курс обновлен</h3>
                                <p style={{fontSize: '1.2rem'}}>
                                    Новое значение:
                                    1 <b>{response.baseCurrency}</b> = <b>{response.rate} {response.targetCurrency}</b>
                                </p>
                            </div>
                        ) : (
                            /* 3. Запасной вариант для других типов ответов */
                            <pre style={{
                                fontSize: '0.8rem',
                                overflowX: 'auto'
                            }}>{JSON.stringify(response, null, 2)}</pre>
                        )}

                        <button
                            onClick={() => setResponse(null)}
                            style={{
                                display: 'block',
                                margin: '15px auto 0',
                                padding: '5px 15px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                background: 'none',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            Очистить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyPage;
import React from 'react';

const CATEGORIES = ['FOOD', 'ENTERTAINMENT', 'MEDICINE', 'TRANSPORT'];
const CURRENCIES = ['RUB', 'USD', 'EUR'];

const PayForm = ({ values, onChange, onSubmit, loading }) => (
    <form onSubmit={onSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            <section>
                    <h3>Данные отправителя</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                                name="senderInfo.name"
                                placeholder="Имя"
                                value={values.senderInfo.name}
                                onChange={onChange}
                                required
                            />
                            <input
                                name="senderInfo.surname"
                                placeholder="Фамилия"
                                value={values.senderInfo.surname}
                                onChange={onChange}
                                required
                            />
                            <input
                                name="senderInfo.patronymic"
                                placeholder="Отчество"
                                value={values.senderInfo.patronymic}
                                onChange={onChange}
                            />
                            <input
                                name="senderInfo.accountNumberFrom"
                                placeholder="Номер счета отправителя"
                                value={values.senderInfo.accountNumberFrom}
                                onChange={onChange}
                                required
                            />
                    </div>
            </section>

            <section>
                    <h3>Информация об услуге</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                                name="serviceInfo.partnerName"
                                placeholder="Название партнера"
                                value={values.serviceInfo.partnerName}
                                onChange={onChange}
                                required
                            />
                            <select
                                name="serviceInfo.accountCurrencyCode"
                                value={values.serviceInfo.accountCurrencyCode}
                                onChange={onChange}
                            >
                                    {CURRENCIES.map(code => <option key={code} value={code}>{code}</option>)}
                            </select>
                    </div>
            </section>

            <section>
                    <h3>Детали платежа</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                                name="serviceRequestAmount"
                                type="number"
                                step="0.01"
                                placeholder="Сумма"
                                value={values.serviceRequestAmount}
                                onChange={onChange}
                                required
                            />
                            <select
                                name="category"
                                value={values.category}
                                onChange={onChange}
                            >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                    </div>
            </section>

            <button type="submit" disabled={loading} className="btn-pay">
                    {loading ? 'Обработка...' : 'Оплатить'}
            </button>
    </form>
);

export default PayForm;
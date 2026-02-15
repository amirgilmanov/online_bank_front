import React from 'react';

const CATEGORIES = ['FOOD', 'ENTERTAINMENT', 'MEDICINE'];

const PayForm = ({values, onChange, onSubmit, loading}) => (
    <form onSubmit={onSubmit} style={{maxWidth: '600px'}}>
        <h3>Отправитель</h3>
        <input
            placeholder="Счет отправителя"
            value={values.senderInfo.accountNumber}
            onChange={(e) => onChange('senderInfo', 'accountNumber', e.target.value)}
            required
        />
        <input
            placeholder="Банк отправителя"
            value={values.senderInfo.bankName}
            onChange={(e) => onChange('senderInfo', 'bankName', e.target.value)}
            required
        />

        <h3>Получатель</h3>
        <input
            placeholder="Название услуги"
            value={values.serviceInfo.serviceName}
            onChange={(e) => onChange('serviceInfo', 'serviceName', e.target.value)}
            required
        />
        <input
            placeholder="Счет получателя"
            value={values.serviceInfo.accountNumber}
            onChange={(e) => onChange('serviceInfo', 'accountNumber', e.target.value)}
            required
        />
        <input
            placeholder="Банк получателя"
            value={values.serviceInfo.bankName}
            onChange={(e) => onChange('serviceInfo', 'bankName', e.target.value)}
            required
        />

        <h3>Детали</h3>
        <input
            type="number"
            placeholder="Сумма"
            value={values.serviceRequestAmount}
            onChange={(e) => onChange(null, 'serviceRequestAmount', e.target.value)}
            required
        />
        <select value={values.category} onChange={(e) => onChange(null, 'category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button type="submit" disabled={loading}>
            {loading ? 'Обработка...' : 'Оплатить'}
        </button>
    </form>
);

export default PayForm;
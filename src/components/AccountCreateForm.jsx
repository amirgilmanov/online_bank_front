const AccountCreateForm = ({currencyCode, setCurrencyCode, onCreate, loading}) => (
    <section>
        <h3>Создать счёт</h3>
        <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
            <option value="USD">USD</option>
            <option value="RUB">RUB</option>
            <option value="CNY">CNY</option>
        </select>
        <button onClick={onCreate} disabled={loading}>Создать</button>
    </section>
);
export default AccountCreateForm;
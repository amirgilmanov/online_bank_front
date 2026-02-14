const CURRENCY_CODES = ['USD', 'RUB', 'CNY'];

const CurrencySelect = ({ name, value, onChange, label }) => (
    <div className="form-group">
        <label>{label}:</label>
        <select name={name} value={value} onChange={onChange}>
            {CURRENCY_CODES.map(code => (
                <option key={code} value={code}>{code}</option>
            ))}
        </select>
    </div>
);

export default CurrencySelect;
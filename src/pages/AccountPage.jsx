import React, { useState } from "react";
import { AccountApi } from "../api";
import { useAccountForm } from "../hooks/useAccountForm";
import AccountCreateForm from "../components/AccountCreateForm";
import AccountTable from "../components/AccountTable";

const AccountPage = () => {
    const { currencyCode, setCurrencyCode, accountNumber, setAccountNumber } = useAccountForm();

    // Состояния данных
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Универсальный исполнитель запросов
    const request = async (apiFunc, successCallback) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFunc();
            successCallback(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Управление счетами</h2>

            {/* Форма создания */}
            <AccountCreateForm
                currencyCode={currencyCode}
                setCurrencyCode={setCurrencyCode}
                onCreate={() => request(() => AccountApi.createAccount(currencyCode), (data) => alert(`Счет создан: ${data.accountNumber}`))}
                loading={loading}
            />

            <hr />

            {/* Баланс */}
            <section>
                <h3>Баланс</h3>
                <input
                    placeholder="Номер счета"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <button onClick={() => request(() => AccountApi.getBalance(accountNumber), setBalance)}>
                    Узнать баланс
                </button>
                {balance !== null && <p>Баланс: <strong>{balance}</strong></p>}
            </section>

            <hr />

            {/* Таблица */}
            <section>
                <button onClick={() => request(AccountApi.findAllByHolder, setAccounts)}>
                    Загрузить список моих счетов
                </button>
                <AccountTable accounts={accounts} />
            </section>

            {loading && <p>Загрузка...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AccountPage;
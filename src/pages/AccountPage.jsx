import {AccountApi, OperationApi} from "../api"; // Импортируем OperationApi
import {useAccountForm} from "../hooks/useAccountForm";
import AccountCreateForm from "../components/AccountCreateForm";
import AccountTable from "../components/AccountTable";
import OperationTable from "../components/OperationTable"; // Твой готовый компонент
import React, {useEffect, useState} from "react";

const AccountPage = () => {
    const {currencyCode, setCurrencyCode, accountNumber, setAccountNumber} = useAccountForm();

    const [accounts, setAccounts] = useState([]);
    const [operations, setOperations] = useState([]); // Для истории
    const [selectedAcc, setSelectedAcc] = useState(null); // Какой счет сейчас смотрим
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    //автозагрузка счетов
    useEffect(() => {
        request(AccountApi.findAllByHolder, setAccounts);
    }, []);

    // Функция загрузки истории
    const handleShowHistory = (accNum) => {
        setSelectedAcc(accNum);
        // Вызываем api с параметрами page=0, size=10
        request(
            () => OperationApi.findAllByAccountNumber(accNum, 0, 10),
            (data) => setOperations(data)
        );
    };

    return (
        <div className="container">
            <h2>Управление счетами</h2>

            <AccountCreateForm
                currencyCode={currencyCode}
                setCurrencyCode={setCurrencyCode}
                onCreate={() => request(() =>
                        AccountApi.createAccount(currencyCode),
                    (data) => {
                        alert(`Счет создан: ${data.accountNumber}`);
                        request(AccountApi.findAllByHolder, setAccounts);
                    },
                )}
                loading={loading}
            />

            <hr/>

            <hr/>

            <section>
                <button onClick={() => request(AccountApi.findAllByHolder, setAccounts)}>
                    Загрузить список моих счетов
                </button>
                {/* Передаем функцию в пропсы */}
                {accounts.length > 0 ? (
                        <AccountTable accounts={accounts} onShowHistory={handleShowHistory}/>) :
                    (<p>У вас нет открытых счетов</p>)}

            </section>

            <hr/>

            {/* Секция истории операций */}
            {selectedAcc && (
                <section style={{marginTop: '20px'}}>
                    <h3>История операций по счету: {selectedAcc}</h3>
                    {operations.length > 0 ? (
                        <OperationTable operations={operations}/>
                    ) : (
                        <p>По этому счету пока нет операций.</p>
                    )}
                </section>
            )}

            {loading && <p>Загрузка...</p>}
            {error && <p className="error" style={{color: 'red'}}>{error}</p>}

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
        </div>
    );
};

export default AccountPage;
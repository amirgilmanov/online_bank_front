import React from "react";

const AccountTable = ({accounts, onShowHistory}) => {
    if (accounts.length === 0) return null;
    return (
        <table>
            <thead>
            <tr>
                <th>Номер</th>
                <th>Валюта</th>
                <th>Баланс</th>
                <th>Владелец</th>
                <th>Действие</th>
            </tr>
            </thead>
            <tbody>
            {accounts.map((acc) => (
                <tr key={acc.accountNumber}>
                    <td>{acc.accountNumber}</td>
                    <td>{acc.currencyCode}</td>
                    <td>{acc.balance}</td>
                    <td>{`${acc.holderName} ${acc.holderSurname}`}</td>
                    <td>
                        <button onClick={() => onShowHistory(acc.accountNumber)}>
                            История
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AccountTable;
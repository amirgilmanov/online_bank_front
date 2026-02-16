import React from "react";

const AccountTable = ({accounts, onShowHistory}) => {
    if (accounts.length === 0) return null;
    return (
        <div className="table-responsive">
            <table className="styled-table">
                <thead>
                <tr>
                    <th>Номер счета</th>
                    <th>Валюта</th>
                    <th>Баланс</th>
                    <th>Владелец</th>
                    <th style={{ textAlign: 'center' }}>Действие</th>
                </tr>
                </thead>
                <tbody>
                {accounts.map((acc) => (
                    <tr key={acc.accountNumber}>
                        <td className="mono">{acc.accountNumber}</td>
                        <td><span className="badge-currency">{acc.currencyCode}</span></td>
                        <td className="amount">{acc.balance.toLocaleString()}</td>
                        <td>{`${acc.holderName} ${acc.holderSurname}`}</td>
                        <td style={{ textAlign: 'center' }}>
                            <button
                                className="btn-history"
                                onClick={() => onShowHistory(acc.accountNumber)}
                            >
                                История
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountTable;
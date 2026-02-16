import React from "react";

const OperationTable = ({ operations }) => {
    if (!operations?.length) return <p>Операций пока нет</p>;

    return (
        <table className="table">
            <thead>
            <tr>
                <th>Номер счёта</th>
                <th>Дата</th>
                <th>ID</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>Валюта</th>
            </tr>
            </thead>
            <tbody>
            {operations.map((op) => (
                <tr key={op.operationId || op.id}>
                    <td>{op.accountNumber}</td>
                    <td>{op.createdAt ? new Date(op.createdAt).toLocaleString() : '-'}</td>
                    <td>{op.operationId || op.id}</td>
                    <td>{op.operationType}</td>
                    <td>{op.description}</td>
                    <td>{op.currencyCode}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OperationTable;
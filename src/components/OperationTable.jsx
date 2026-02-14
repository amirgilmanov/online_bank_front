import React from "react";

const OperationTable = ({operations }) => {
    if (!operations?.length) return null;
    return (
        <table>
            <thead>
            <tr>
                <th>Номер счёта</th>
                <th>Дата</th>
                <th>ID операции</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>Валюта</th>
            </tr>
            </thead>
            <tbody>
            {operations.map((op) => (
                <tr key={op.operationId}>
                    <td>{op.accountNumber}</td>
                    <td>{op.createdAt}</td>
                    <td>{op.operationId}</td>
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
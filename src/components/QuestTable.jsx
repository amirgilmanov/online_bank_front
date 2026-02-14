import React from 'react';

const QuestTable = ({ quests }) => {
    if (!quests || quests.length === 0) return null;

    return (
        <div className="data-display">
            <h3>Список квестов:</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Награда</th>
                    <th>Сложность</th>
                </tr>
                </thead>
                <tbody>
                {quests.map((quest, index) => (
                    <tr key={quest.id || index}>
                        <td>{quest.id || '-'}</td>
                        <td>{quest.name || 'Случайный квест'}</td>
                        <td>{quest.description || 'Описание отсутствует'}</td>
                        <td>{quest.reward || '0'}</td>
                        <td>{quest.difficulty || 'Средняя'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestTable;
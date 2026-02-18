import React from 'react';

const QuestTable = ({ quests }) => {
    if (!quests || quests.length === 0) return null;

    return (
        <div className="data-display" style={{ marginBottom: '30px' }}>
            <table>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Прогресс</th>
                    <th>Цель</th>
                    <th>Награда</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {quests.map((quest, index) => (
                    <tr key={index}>
                        <td>{quest.questName}</td>
                        <td>{quest.questCategory}</td>
                        <td>{quest.userProgress}</td>
                        <td>{quest.necessaryToReward}</td>
                        <td>{quest.pointReward}</td>
                        <td>{quest.isComplete ? 'Завершён' : 'В процессе'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestTable;
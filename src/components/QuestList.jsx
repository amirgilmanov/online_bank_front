import React from 'react';

const QuestList = ({ quests }) => {
    if (!quests || quests.length === 0) return null;

    return (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {quests.map((quest, index) => {
                const progressPercent = Math.min(
                    (quest.userProgress / quest.necessaryToReward) * 100,
                    100
                );

                return (
                    <div key={index} style={{
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '8px',
                        backgroundColor: quest.isComplete ? '#f0fff0' : '#fff',
                        position: 'relative'
                    }}>
                        {quest.isComplete &&
                            <span style={{ position: 'absolute', top: '10px', right: '10px' }}>✅ Выполнено</span>
                        }

                        <h4>{quest.questName}</h4>
                        <p>Категория: <strong>{quest.questCategory}</strong></p>
                        <p>Награда: <strong>{quest.pointReward} бонусов</strong></p>

                        <div style={{ margin: '15px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span>Прогресс: {quest.userProgress} / {quest.necessaryToReward}</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '5px', height: '10px' }}>
                                <div style={{
                                    width: `${progressPercent}%`,
                                    backgroundColor: quest.isComplete ? '#4caf50' : '#2196f3',
                                    height: '100%',
                                    borderRadius: '5px',
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </div>
                        </div>

                        <small>Истекает: {new Date(quest.questExpireDate).toLocaleDateString()}</small>
                    </div>
                );
            })}
        </div>
    );
};

export default QuestList;
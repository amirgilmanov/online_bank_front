import React, { useState } from 'react';
import { QuestApi } from '../api'; // Убедись, что экспорт в api.js с большой буквы
import QuestTable from '../components/QuestTable';

const QuestPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quests, setQuests] = useState([]);

    const handleCreateRandomQuest = async () => {
        setLoading(true);
        setError(null);
        try {
            // Токен подхватится автоматически перехватчиком axios
            const result = await QuestApi.createRandomQuest();
            setQuests(result);
        } catch (err) {
            setError(err.message);
            setQuests([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Управление квестами</h2>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={handleCreateRandomQuest}
                    disabled={loading}
                >
                    {loading ? 'Создание...' : 'Создать случайный квест'}
                </button>
            </div>

            {error && <div className="error-message" style={{ color: 'red' }}>Ошибка: {error}</div>}

            <QuestTable quests={quests} />

            <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee' }}>
                <p><strong>Примечание:</strong> Данный метод доступен только пользователям с ролью ADMIN.</p>
            </div>
        </div>
    );
};

export default QuestPage;
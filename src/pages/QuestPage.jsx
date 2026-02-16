import React, { useEffect, useState } from 'react';
import { QuestApi } from '../api';
import QuestTable from '../components/QuestTable';
import QuestList from "../components/QuestList";
import { getUserRole } from "../utils/authUtils";

const QuestPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quests, setQuests] = useState([]);

    const userRole = getUserRole();
    const isAdmin = Array.isArray(userRole)
        ? userRole.includes("ROLE_ADMIN")
        : userRole === "ROLE_ADMIN";

    const fetchQuests = async () => {
        setLoading(true);
        try {
            const data = await QuestApi.getUserQuests();
            setQuests(data);
        } catch (err) {
            setError("Не удалось загрузить квесты");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleCreateRandomQuest = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await QuestApi.createRandomQuest();
            setQuests(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Квесты и задачи</h2>

            {/* Кнопка видна ТОЛЬКО админу. Обычный юзер даже не узнает о её существовании */}
            {isAdmin && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>Панель управления (Админ)</h4>
                    <button
                        onClick={handleCreateRandomQuest}
                        disabled={loading}
                        className="btn-success"
                        style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {loading ? 'Генерация...' : 'Сгенерировать новый квест'}
                    </button>
                </div>
            )}

            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <section>
                <h3>Ваш список задач</h3>
                {quests.length > 0 ? (
                    <>
                        <QuestTable quests={quests} />
                        <QuestList quests={quests} />
                    </>
                ) : (
                    <p>У вас пока нет активных квестов. Загляните позже!</p>
                )}
            </section>
        </div>
    );
};

export default QuestPage;
import React, { useState } from 'react';
import './App.css';

import AccountPage from "./pages/AccountPage";
import OperationPage from "./pages/OperationPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import BonusPage from "./pages/BonusPage";
import CurrencyPage from "./pages/CurrencyPage";
import PartnerPage from "./pages/PartnerPage";
import PayPage from "./pages/PayPage";
import QuestPage from "./pages/QuestPage";
import TestPage from "./pages/TestPage";
import CodePage from "./pages/CodePage";
import { getUserRole } from "./utils/authUtils";

function App() {
    const menuGroups = [
        {
            title: "Пользователь",
            items: [
                // Оставляем оба ID, чтобы в боковом меню подсвечивалась нужная кнопка,
                // но renderComponent вернет один и тот же AuthenticationPage
                { id: 'authentication', label: 'Вход' },
                // { id: 'registration', label: 'Регистрация' },
                { id: 'account', label: 'Мои счета' },
            ]
        },
        {
            title: "Финансы",
            items: [
                { id: 'operation', label: 'Операции' },
                { id: 'pay', label: 'Платежи' },
                { id: 'bonusAccount', label: 'Бонусы' },
                { id: 'currency', label: 'Валюты' },
            ]
        },
        {
            title: "Сервисы",
            items: [
                { id: 'partner', label: 'Партнеры' },
                { id: 'quest', label: 'Квесты' },
            ]
        },
        {
            title: "Админ",
            items: [
                { id: 'code', label: 'Коды' },
                { id: 'test', label: 'Тесты' },
            ]
        }
    ];

    // Установили 'authentication' как стартовый экран
    const [currentComponent, setCurrentComponent] = useState('authentication');
    const userRole = getUserRole();

    // Фильтруем группы меню
    const filteredMenuGroups = menuGroups.filter(group => {
        // Если группа "Админ", показываем её только админу
        if (group.title === "Админ") {
            return userRole === "ROLE_ADMIN";
        }
        return true;
    });

    const renderComponent = () => {
        // Проверка на админа для конкретных кейсов
        const isAdmin = userRole === "ROLE_ADMIN";

        switch (currentComponent) {
            case 'account':
                return <AccountPage />;
            case 'authentication':
            case 'registration':
                return <AuthenticationPage
                    initialMode={currentComponent}
                    onSuccess={() => setCurrentComponent('account')}
                    userRole={userRole} // Не забудь передать роль сюда
                />;
            case 'bonusAccount':
                return <BonusPage />;
            case 'currency':
                return <CurrencyPage />;
            case 'operation':
                return <OperationPage />;
            case 'partner':
                return <PartnerPage />;
            case 'pay':
                return <PayPage />;
            case 'quest':
                return <QuestPage />;

            // ЗАЩИЩЕННЫЕ РОУТЫ
            case 'test':
                return isAdmin ? <TestPage /> : null; // Если не админ, просто ничего не рендерим
            case 'code':
                return isAdmin ? <CodePage /> : null;

            default:
                return <AuthenticationPage />;
        }
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Online Bank</h2>
                </div>
                <nav className="sidebar-nav">
                    {filteredMenuGroups.map(group => (
                        <div key={group.title} className="menu-group">
                            <span className="group-title">{group.title}</span>
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    className={`menu-item ${currentComponent === item.id ? 'active' : ''}`}
                                    onClick={() => setCurrentComponent(item.id)}
                                >
                                    <span className="icon-wrapper"></span>
                                    <span className="menu-label">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <div className="component-container">
                    {renderComponent()}
                </div>
            </main>
        </div>
    );
}

export default App;
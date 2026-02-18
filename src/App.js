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
import { TokenService } from "./utils/tokenService";

function App() {
    const userRole = getUserRole();
    const isAuthenticated = !!TokenService.getRefresh();

    // ГИБКАЯ ИНИЦИАЛИЗАЦИЯ:
    // Если пользователь авторизован, открываем 'account', если нет — 'authentication'
    const [currentComponent, setCurrentComponent] = useState(
        isAuthenticated ? 'account' : 'authentication'
    );

    const handleLogout = () => {
        TokenService.clear();
        window.location.reload(); // Полный сброс всех состояний
    };

    const menuGroups = [
        {
            title: "Пользователь",
            items: [
                // Показываем "Вход" только если НЕ авторизован
                ...(!isAuthenticated ? [{ id: 'authentication', label: 'Вход' }] : []),
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

    // Фильтруем группы меню (логика админа)
    const filteredMenuGroups = menuGroups.filter(group => {
        if (group.title === "Админ") {
            return userRole === "ROLE_ADMIN";
        }
        return true;
    });

    const renderComponent = () => {
        const isAdmin = userRole === "ROLE_ADMIN";

        // Если пользователь залогинен, но текущий компонент 'authentication',
        // автоматически переключаем на 'account'
        if (isAuthenticated && (currentComponent === 'authentication' || currentComponent === 'registration')) {
            return <AccountPage />;
        }

        switch (currentComponent) {
            case 'account':
                return <AccountPage />;
            case 'authentication':
            case 'registration':
                return <AuthenticationPage
                    initialMode={currentComponent}
                    onSuccess={() => setCurrentComponent('account')}
                    userRole={userRole}
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
                return isAdmin ? <TestPage /> : null;
            case 'code':
                return isAdmin ? <CodePage /> : null;

            default:
                return isAuthenticated ? <AccountPage /> : <AuthenticationPage />;
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
                                    <span className="menu-label">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ))}

                    {/* Кнопка выхода */}
                    {isAuthenticated && (
                        <div className="menu-group" style={{ marginTop: 'auto' }}>
                            <button
                                className="menu-item logout-btn"
                                onClick={handleLogout}
                                style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                            >
                                <span className="menu-label">Выйти</span>
                            </button>
                        </div>
                    )}
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
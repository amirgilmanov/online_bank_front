import React, { useState } from 'react';
import './App.css';

// Импорты страниц
import AccountPage from "./pages/AccountPage";
import OperationPage from "./pages/OperationPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import BonusPage from "./pages/BonusPage";
import CurrencyPage from "./pages/CurrencyPage";
import PartnerPage from "./pages/PartnerPage";
import RegistrationPage from "./pages/RegistrationPage";
import PayPage from "./pages/PayPage";
import QuestPage from "./pages/QuestPage";
import TestPage from "./pages/TestPage";
import CodePage from "./pages/CodePage";

function App() {
    const [currentComponent, setCurrentComponent] = useState('registration');

    const renderComponent = () => {
        switch (currentComponent) {
            case 'account': return <AccountPage />;
            case 'authentication': return <AuthenticationPage />;
            case 'bonusAccount': return <BonusPage />;
            case 'registration': return <RegistrationPage />;
            case 'currency': return <CurrencyPage />;
            case 'operation': return <OperationPage />;
            case 'partner': return <PartnerPage />;
            case 'pay': return <PayPage />;
            case 'quest': return <QuestPage />;
            case 'test': return <TestPage />;
            case 'code': return <CodePage />;
            default: return <RegistrationPage />;
        }
    };

    // Оставили строковые ключи для будущих иконок MUI
    const menuGroups = [
        {
            title: "Пользователь",
            items: [
                { id: 'authentication', label: 'Вход' },
                { id: 'registration', label: 'Регистрация' },
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

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Online Bank</h2>
                </div>
                <nav className="sidebar-nav">
                    {menuGroups.map(group => (
                        <div key={group.title} className="menu-group">
                            <span className="group-title">{group.title}</span>
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    className={`menu-item ${currentComponent === item.id ? 'active' : ''}`}
                                    onClick={() => setCurrentComponent(item.id)}
                                >
                                    {/* Место под будущую иконку Material UI */}
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
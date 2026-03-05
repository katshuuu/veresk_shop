import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import ProductList from './components/ProductList';
import './styles/main.scss';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userToEdit, setUserToEdit] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' или 'products'

    const handleUserAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUserUpdated = () => {
        setUserToEdit(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
    };

    // Функция для открытия API Tester в новом окне
    const openAPITester = () => {
        // Определяем базовый URL (текущий порт, на котором запущен фронтенд)
        const baseUrl = window.location.origin;
        // Открываем API Tester в новом окне
        window.open(`${baseUrl}/api-tester.html`, '_blank', 'width=1400,height=800,scrollbars=yes,resizable=yes');
    };

    return (
        <div className="app">
            {/* Шапка с кнопкой API Tester */}
            <div className="header-with-button">
                <h1>Veresk </h1>
                <h33>магазин украшений из эпоксидной смолы</h33>
                <button 
                    className="api-tester-button"
                    onClick={openAPITester}
                    title="Открыть тестер API в новом окне"
                >
                    <span className="button-text">API Tester</span>
                </button>
            </div>
            
            {/* Добавляем табы для переключения между разделами */}
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button 
                    className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Товары
                </button>
            </div>

            <div className="content">
                {activeTab === 'users' ? (
                    <>
                        <UserForm 
                            onUserAdded={handleUserAdded}
                            onUserUpdated={handleUserUpdated}
                            userToEdit={userToEdit}
                        />
                        <UserList 
                            onEditUser={handleEditUser}
                            refreshTrigger={refreshTrigger}
                        />
                    </>
                ) : (
                    <ProductList />
                )}
            </div>

            {/* Маленькая подсказка внизу */}
            <div className="api-hint">
                <span className="hint-text">
                    Проверить все эндпоинты API в 
                    <button 
                        className="hint-link" 
                        onClick={openAPITester}
                    >
                        интерактивном тестере
                    </button>
                </span>
            </div>
        </div>
    );
}

export default App;
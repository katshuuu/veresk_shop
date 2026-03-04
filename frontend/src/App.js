import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import './styles/main.scss';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userToEdit, setUserToEdit] = useState(null);

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

    return (
        <div className="app">
            <h1>Veresk - Магазин украшений из эпоксидной смолы</h1>
            
            <div className="content">
                <UserForm 
                    onUserAdded={handleUserAdded}
                    onUserUpdated={handleUserUpdated}
                    userToEdit={userToEdit}
                />
                
                <UserList 
                    onEditUser={handleEditUser}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}

export default App;
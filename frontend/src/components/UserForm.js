import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ onUserAdded, userToEdit, onUserUpdated }) => {
    const [name, setName] = useState(userToEdit?.name || '');
    const [email, setEmail] = useState(userToEdit?.email || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (userToEdit) {
                // Update existing user
                const response = await axios.put(`http://localhost:5001/api/users/${userToEdit.id}`, {
                    name,
                    email
                });
                onUserUpdated(response.data);
            } else {
                // Create new user
                const response = await axios.post('http://localhost:5001/api/users', {
                    name,
                    email
                });
                onUserAdded(response.data);
            }
            
            // Clear form
            setName('');
            setEmail('');
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    return (
        <div className="user-form">
            <h2>{userToEdit ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {userToEdit ? 'Обновить' : 'Добавить'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
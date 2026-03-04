import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onEditUser, refreshTrigger }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
            try {
                await axios.delete(`http://localhost:5001/api/users/${id}`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (loading) {
        return <div className="user-list">Загрузка...</div>;
    }

    return (
        <div className="user-list">
            <h2>Пользователи</h2>
            {users.length === 0 ? (
                <p>Пользователей пока нет</p>
            ) : (
                users.map(user => (
                    <div key={user.id} className="user-item">
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                        </div>
                        <div className="actions">
                            <button 
                                className="edit"
                                onClick={() => onEditUser(user)}
                            >
                                ✏️
                            </button>
                            <button 
                                className="delete"
                                onClick={() => handleDelete(user.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserList;
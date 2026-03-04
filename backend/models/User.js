// Пр4. REST API CRUD (User) - Модель пользователя
// Пр5. REST API расширенный (Relations) - Модель с отношениями

/**
 * Модель пользователя для магазина украшений Veresk
 * Содержит полную структуру данных пользователя с валидацией и методами работы
 */

class User {
    /**
     * Конструктор класса User
     * @param {Object} userData - Данные пользователя
     * @param {string} userData.name - Имя пользователя
     * @param {string} userData.email - Email пользователя
     * @param {string} userData.phone - Телефон пользователя
     * @param {string} userData.address - Адрес доставки
     * @param {Array} userData.orders - Массив ID заказов (relations)
     */
    constructor(userData = {}) {
        this.id = userData.id || null;
        this.name = userData.name || '';
        this.email = userData.email || '';
        this.phone = userData.phone || '';
        this.address = userData.address || '';
        this.orders = userData.orders || []; // Пр5. Relations - связь с заказами
        this.favorites = userData.favorites || []; // Избранные товары
        this.role = userData.role || 'customer'; // 'customer', 'admin', 'designer'
        this.createdAt = userData.createdAt || new Date().toISOString();
        this.updatedAt = userData.updatedAt || new Date().toISOString();
        this.lastLogin = userData.lastLogin || null;
        this.isActive = userData.isActive !== undefined ? userData.isActive : true;
        
        // Дополнительная информация для профиля
        this.profile = {
            avatar: userData.profile?.avatar || null,
            birthDate: userData.profile?.birthDate || null,
            preferences: userData.profile?.preferences || {
                newsletter: false,
                notifications: true,
                theme: 'light'
            }
        };
    }

    /**
     * Валидация данных пользователя
     * @returns {Object} - Результат валидации {isValid: boolean, errors: Array}
     */
    validate() {
        const errors = [];

        // Проверка имени
        if (!this.name || this.name.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        } else if (this.name.length > 50) {
            errors.push('Имя не должно превышать 50 символов');
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email) {
            errors.push('Email обязателен для заполнения');
        } else if (!emailRegex.test(this.email)) {
            errors.push('Некорректный формат email');
        }

        // Проверка телефона (если указан)
        if (this.phone) {
            const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            if (!phoneRegex.test(this.phone.replace(/\s+/g, ''))) {
                errors.push('Некорректный формат телефона. Используйте +7XXXXXXXXXX или 8XXXXXXXXXX');
            }
        }

        // Проверка роли
        const validRoles = ['customer', 'admin', 'designer'];
        if (this.role && !validRoles.includes(this.role)) {
            errors.push(`Роль должна быть одной из: ${validRoles.join(', ')}`);
        }

        // Проверка массива заказов
        if (this.orders && !Array.isArray(this.orders)) {
            errors.push('Заказы должны быть массивом');
        } else if (this.orders) {
            // Проверяем, что все элементы массива - числа
            const invalidOrders = this.orders.filter(id => typeof id !== 'number' || id <= 0);
            if (invalidOrders.length > 0) {
                errors.push('ID заказов должны быть положительными числами');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Создание пользователя из данных формы
     * @param {Object} formData - Данные из формы
     * @returns {User} - Новый экземпляр пользователя
     */
    static fromForm(formData) {
        return new User({
            name: formData.name,
            email: formData.email.toLowerCase(),
            phone: formData.phone || '',
            address: formData.address || '',
            role: formData.role || 'customer',
            profile: {
                preferences: {
                    newsletter: formData.newsletter === 'on',
                    notifications: formData.notifications !== 'off'
                }
            }
        });
    }

    /**
     * Преобразование пользователя в JSON для отправки клиенту
     * @param {boolean} includeSensitive - Включать ли чувствительные данные
     * @returns {Object} - Объект для отправки
     */
    toJSON(includeSensitive = false) {
        const baseJSON = {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address,
            orders: this.orders,
            favorites: this.favorites,
            role: this.role,
            createdAt: this.createdAt,
            profile: this.profile
        };

        // Чувствительные данные только для админа
        if (includeSensitive) {
            return {
                ...baseJSON,
                lastLogin: this.lastLogin,
                isActive: this.isActive,
                updatedAt: this.updatedAt
            };
        }

        return baseJSON;
    }

    /**
     * Добавление заказа к пользователю (Пр5. Relations)
     * @param {number} orderId - ID заказа
     */
    addOrder(orderId) {
        if (!this.orders.includes(orderId)) {
            this.orders.push(orderId);
            this.updatedAt = new Date().toISOString();
        }
    }

    /**
     * Удаление заказа пользователя
     * @param {number} orderId - ID заказа
     */
    removeOrder(orderId) {
        const index = this.orders.indexOf(orderId);
        if (index !== -1) {
            this.orders.splice(index, 1);
            this.updatedAt = new Date().toISOString();
        }
    }

    /**
     * Добавление товара в избранное
     * @param {number} productId - ID товара
     */
    addToFavorites(productId) {
        if (!this.favorites.includes(productId)) {
            this.favorites.push(productId);
            this.updatedAt = new Date().toISOString();
        }
    }

    /**
     * Удаление товара из избранного
     * @param {number} productId - ID товара
     */
    removeFromFavorites(productId) {
        const index = this.favorites.indexOf(productId);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.updatedAt = new Date().toISOString();
        }
    }

    /**
     * Обновление данных пользователя
     * @param {Object} updates - Поля для обновления
     */
    update(updates) {
        // Обновляем только разрешенные поля
        const allowedUpdates = ['name', 'phone', 'address', 'profile'];
        
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                this[field] = updates[field];
            }
        });

        // Обновление профиля
        if (updates.profile) {
            this.profile = {
                ...this.profile,
                ...updates.profile
            };
        }

        this.updatedAt = new Date().toISOString();
    }

    /**
     * Получение статистики пользователя
     * @param {Array} products - Массив всех товаров для вычислений
     * @returns {Object} - Статистика пользователя
     */
    getStats(products) {
        // Пр5. Aggregation - агрегация данных пользователя
        const userProducts = products.filter(p => this.orders.includes(p.id));
        
        return {
            userId: this.id,
            userName: this.name,
            totalOrders: this.orders.length,
            totalSpent: userProducts.reduce((sum, p) => sum + p.price, 0),
            averageOrderValue: this.orders.length > 0 
                ? userProducts.reduce((sum, p) => sum + p.price, 0) / this.orders.length 
                : 0,
            favoriteCategories: this.getFavoriteCategories(products),
            favoriteDesigners: this.getFavoriteDesigners(products),
            memberSince: this.createdAt,
            lastActive: this.lastLogin || this.updatedAt
        };
    }

    /**
     * Получение любимых категорий пользователя
     * @private
     */
    getFavoriteCategories(products) {
        const categories = {};
        products
            .filter(p => this.orders.includes(p.id))
            .forEach(p => {
                categories[p.category] = (categories[p.category] || 0) + 1;
            });
        
        return Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => ({ category, count }));
    }

    /**
     * Получение любимых дизайнеров пользователя
     * @private
     */
    getFavoriteDesigners(products) {
        const designers = {};
        products
            .filter(p => this.orders.includes(p.id))
            .forEach(p => {
                designers[p.designer] = (designers[p.designer] || 0) + 1;
            });
        
        return Object.entries(designers)
            .sort((a, b) => b[1] - a[1])
            .map(([designer, count]) => ({ designer, count }));
    }
}

// Пр5. Relations - экспорт класса для использования в других модулях
module.exports = User;
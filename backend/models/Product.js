// Пр5. REST API расширенный (Aggregation) - Модель товара с агрегацией

/**
 * Модель товара (украшения из эпоксидной смолы)
 * Содержит полную информацию о продукте и методы для агрегации данных
 */

class Product {
    /**
     * Конструктор класса Product
     * @param {Object} productData - Данные товара
     */
    constructor(productData = {}) {
        this.id = productData.id || null;
        this.name = productData.name || '';
        this.description = productData.description || '';
        this.price = productData.price || 0;
        this.oldPrice = productData.oldPrice || null; // Для скидок
        this.category = productData.category || 'other';
        this.subcategory = productData.subcategory || '';
        
        // Пр5. Aggregation - поля для агрегации
        this.material = productData.material || 'эпоксидная смола';
        this.designer = productData.designer || 'Veresk';
        this.inStock = productData.inStock !== undefined ? productData.inStock : true;
        this.quantity = productData.quantity || 0;
        this.orders = productData.orders || 0; // Количество заказов
        this.views = productData.views || 0; // Просмотры
        this.rating = productData.rating || 0;
        this.reviews = productData.reviews || [];
        
        // Характеристики товара
        this.attributes = {
            weight: productData.attributes?.weight || null,
            size: productData.attributes?.size || null,
            color: productData.attributes?.color || [],
            style: productData.attributes?.style || 'классический',
            isHandmade: productData.attributes?.isHandmade !== false
        };
        
        // Медиа
        this.images = productData.images || [];
        this.mainImage = productData.mainImage || null;
        this.video = productData.video || null;
        
        // Даты
        this.createdAt = productData.createdAt || new Date().toISOString();
        this.updatedAt = productData.updatedAt || new Date().toISOString();
        this.releaseDate = productData.releaseDate || null;
        
        // Метаданные для SEO
        this.seo = {
            title: productData.seo?.title || '',
            description: productData.seo?.description || '',
            keywords: productData.seo?.keywords || []
        };
        
        // Статус
        this.isActive = productData.isActive !== undefined ? productData.isActive : true;
        this.isFeatured = productData.isFeatured || false;
        this.isNew = productData.isNew || false;
        this.isOnSale = productData.isOnSale || false;
    }

    /**
     * Валидация данных товара
     * @returns {Object} - Результат валидации
     */
    validate() {
        const errors = [];

        // Проверка названия
        if (!this.name || this.name.trim().length < 3) {
            errors.push('Название товара должно содержать минимум 3 символа');
        } else if (this.name.length > 100) {
            errors.push('Название товара не должно превышать 100 символов');
        }

        // Проверка цены
        if (this.price === undefined || this.price === null) {
            errors.push('Цена обязательна для заполнения');
        } else if (isNaN(this.price) || this.price <= 0) {
            errors.push('Цена должна быть положительным числом');
        } else if (this.price > 1000000) {
            errors.push('Цена не может превышать 1,000,000 ₽');
        }

        // Проверка старой цены
        if (this.oldPrice !== null) {
            if (isNaN(this.oldPrice) || this.oldPrice <= 0) {
                errors.push('Старая цена должна быть положительным числом');
            } else if (this.oldPrice <= this.price) {
                errors.push('Старая цена должна быть больше текущей');
            }
        }

        // Проверка категории
        const validCategories = ['кулоны', 'серьги', 'браслеты', 'кольца', 'комплекты', 'other'];
        if (!validCategories.includes(this.category)) {
            errors.push(`Категория должна быть одной из: ${validCategories.join(', ')}`);
        }

        // Проверка количества
        if (this.quantity < 0) {
            errors.push('Количество не может быть отрицательным');
        }

        // Проверка рейтинга
        if (this.rating < 0 || this.rating > 5) {
            errors.push('Рейтинг должен быть от 0 до 5');
        }

        // Проверка изображений
        if (this.images.length === 0) {
            errors.push('Добавьте хотя бы одно изображение товара');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Создание товара из данных формы
     * @param {Object} formData - Данные из формы
     * @returns {Product} - Новый экземпляр товара
     */
    static fromForm(formData) {
        // Парсинг характеристик
        const attributes = {};
        if (formData.weight) attributes.weight = parseFloat(formData.weight);
        if (formData.size) attributes.size = formData.size;
        if (formData.color) {
            attributes.color = Array.isArray(formData.color) 
                ? formData.color 
                : [formData.color];
        }
        if (formData.style) attributes.style = formData.style;

        // Парсинг изображений
        const images = [];
        if (formData.mainImage) images.push(formData.mainImage);
        if (formData.images) {
            if (Array.isArray(formData.images)) {
                images.push(...formData.images);
            } else {
                images.push(formData.images);
            }
        }

        return new Product({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
            category: formData.category,
            subcategory: formData.subcategory,
            material: formData.material,
            designer: formData.designer,
            inStock: formData.inStock === 'true' || formData.inStock === true,
            quantity: parseInt(formData.quantity) || 0,
            attributes: attributes,
            images: images,
            mainImage: formData.mainImage || images[0],
            isFeatured: formData.isFeatured === 'true' || formData.isFeatured === true,
            isNew: formData.isNew === 'true' || formData.isNew === true,
            isOnSale: formData.isOnSale === 'true' || formData.isOnSale === true
        });
    }

    /**
     * Преобразование товара в JSON для отправки клиенту
     * @returns {Object} - Объект для отправки
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            oldPrice: this.oldPrice,
            category: this.category,
            subcategory: this.subcategory,
            material: this.material,
            designer: this.designer,
            inStock: this.inStock,
            quantity: this.quantity,
            orders: this.orders,
            views: this.views,
            rating: this.rating,
            reviewsCount: this.reviews.length,
            attributes: this.attributes,
            images: this.images,
            mainImage: this.mainImage || this.images[0],
            isNew: this.isNew,
            isOnSale: this.isOnSale,
            isFeatured: this.isFeatured,
            createdAt: this.createdAt,
            releaseDate: this.releaseDate || this.createdAt
        };
    }

    /**
     * Пр5. Aggregation - Получение статистики по товару
     * @returns {Object} - Статистика
     */
    getStats() {
        const totalReviews = this.reviews.length;
        const averageRating = totalReviews > 0
            ? this.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

        // Распределение оценок
        const ratingDistribution = {
            5: this.reviews.filter(r => r.rating === 5).length,
            4: this.reviews.filter(r => r.rating === 4).length,
            3: this.reviews.filter(r => r.rating === 3).length,
            2: this.reviews.filter(r => r.rating === 2).length,
            1: this.reviews.filter(r => r.rating === 1).length
        };

        return {
            productId: this.id,
            productName: this.name,
            totalOrders: this.orders,
            totalViews: this.views,
            conversionRate: this.views > 0 ? (this.orders / this.views * 100).toFixed(2) + '%' : '0%',
            revenue: this.price * this.orders,
            rating: {
                average: averageRating.toFixed(1),
                total: totalReviews,
                distribution: ratingDistribution
            },
            popularity: this.calculatePopularity(),
            stockStatus: this.getStockStatus()
        };
    }

    /**
     * Расчет популярности товара (Пр5. Aggregation)
     * @returns {string} - Уровень популярности
     */
    calculatePopularity() {
        const score = this.views * 0.3 + this.orders * 2 + this.reviews.length * 5;
        
        if (score > 100) return 'хит продаж';
        if (score > 50) return 'популярный';
        if (score > 20) return 'обычный';
        return 'новинка';
    }

    /**
     * Получение статуса наличия
     * @returns {Object} - Статус наличия
     */
    getStockStatus() {
        if (!this.inStock || this.quantity === 0) {
            return { status: 'out_of_stock', label: 'Нет в наличии' };
        }
        if (this.quantity < 3) {
            return { status: 'low_stock', label: 'Заканчивается' };
        }
        if (this.quantity < 10) {
            return { status: 'few_left', label: 'Осталось немного' };
        }
        return { status: 'in_stock', label: 'В наличии' };
    }

    /**
     * Обновление статистики при просмотре
     */
    incrementViews() {
        this.views++;
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Обновление статистики при заказе
     * @param {number} quantity - Количество заказанных единиц
     */
    addOrder(quantity = 1) {
        this.orders += quantity;
        this.quantity -= quantity;
        this.updatedAt = new Date().toISOString();
        
        if (this.quantity <= 0) {
            this.inStock = false;
        }
    }

    /**
     * Добавление отзыва
     * @param {Object} review - Отзыв {userId, rating, comment, date}
     */
    addReview(review) {
        const newReview = {
            id: this.reviews.length + 1,
            ...review,
            date: new Date().toISOString()
        };
        
        this.reviews.push(newReview);
        this.updateRating();
        this.updatedAt = new Date().toISOString();
        
        return newReview;
    }

    /**
     * Обновление рейтинга на основе отзывов
     */
    updateRating() {
        if (this.reviews.length === 0) {
            this.rating = 0;
            return;
        }
        
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.rating = sum / this.reviews.length;
    }

    /**
     * Пр5. Aggregation - Сравнение с другими товарами категории
     * @param {Array} categoryProducts - Товары из той же категории
     * @returns {Object} - Сравнительная статистика
     */
    compareWithCategory(categoryProducts) {
        const categoryStats = categoryProducts.reduce((acc, p) => {
            acc.totalPrice += p.price;
            acc.totalOrders += p.orders;
            acc.totalViews += p.views;
            return acc;
        }, { totalPrice: 0, totalOrders: 0, totalViews: 0 });

        const avgPrice = categoryStats.totalPrice / categoryProducts.length;
        const avgOrders = categoryStats.totalOrders / categoryProducts.length;
        const avgViews = categoryStats.totalViews / categoryProducts.length;

        return {
            priceComparison: {
                average: avgPrice,
                difference: this.price - avgPrice,
                percentDifference: ((this.price - avgPrice) / avgPrice * 100).toFixed(1) + '%',
                isAboveAverage: this.price > avgPrice
            },
            ordersComparison: {
                average: avgOrders,
                difference: this.orders - avgOrders,
                isAboveAverage: this.orders > avgOrders
            },
            popularityComparison: {
                average: avgViews,
                viewsDifference: this.views - avgViews,
                isMorePopular: this.views > avgViews
            },
            rankInCategory: categoryProducts
                .sort((a, b) => b.orders - a.orders)
                .findIndex(p => p.id === this.id) + 1
        };
    }

    /**
     * Применение скидки к товару
     * @param {number} discountPercent - Процент скидки
     */
    applyDiscount(discountPercent) {
        if (discountPercent < 0 || discountPercent > 100) {
            throw new Error('Скидка должна быть от 0 до 100%');
        }
        
        this.oldPrice = this.price;
        this.price = this.price * (1 - discountPercent / 100);
        this.isOnSale = true;
        this.updatedAt = new Date().toISOString();
    }
}

// Пр5. Aggregation - дополнительные статические методы для агрегации
Product.aggregateByCategory = function(products) {
    // Группировка товаров по категориям
    return products.reduce((acc, product) => {
        const category = product.category;
        
        if (!acc[category]) {
            acc[category] = {
                category: category,
                count: 0,
                totalValue: 0,
                totalOrders: 0,
                averagePrice: 0,
                items: []
            };
        }
        
        acc[category].count++;
        acc[category].totalValue += product.price;
        acc[category].totalOrders += product.orders;
        acc[category].items.push(product);
        
        return acc;
    }, {});
};

Product.getTopProducts = function(products, limit = 5, sortBy = 'orders') {
    // Получение топ товаров по различным критериям
    return [...products]
        .sort((a, b) => b[sortBy] - a[sortBy])
        .slice(0, limit)
        .map(p => ({
            id: p.id,
            name: p.name,
            value: p[sortBy],
            price: p.price
        }));
};

Product.getPriceRange = function(products) {
    // Получение диапазона цен
    const prices = products.map(p => p.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: prices.reduce((a, b) => a + b, 0) / prices.length
    };
};

module.exports = Product;
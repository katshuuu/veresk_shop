// Пр2. Node.js + Express: базовая настройка сервера
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Пр3. JSON + внешние API

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Хранилище данных (в реальном проекте здесь была бы БД)
let users = [
    { id: 1, name: 'Анна', email: 'anna@email.com', orders: [1, 3] },
    { id: 2, name: 'Мария', email: 'maria@email.com', orders: [2] }
];

let products = [
    { id: 1, name: 'Кулон "Просто супер"', price: 2500, category: 'кулоны', inStock: true, orders: 15 },
    { id: 2, name: 'Серьги "Супер класс"', price: 3200, category: 'серьги', inStock: true, orders: 8 },
    { id: 3, name: 'Браслет "Мегахороший"', price: 1800, category: 'браслеты', inStock: false, orders: 23 },
    { id: 4, name: 'Кольцо "Пушка"', price: 1500, category: 'кольца', inStock: true, orders: 12 }
];

// Пр4. REST API CRUD (User)

// GET all users
app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        orders: []
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body, id };
    res.status(200).json(users[userIndex]);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    res.status(204).send();
});

// Пр5. REST API расширенный (Relations + Aggregation)

// GET products with aggregation
app.get('/api/products/aggregated', (req, res) => {
    // Агрегация: группировка по категориям и подсчет статистики
    const aggregatedData = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = {
                category: product.category,
                totalProducts: 0,
                totalOrders: 0,
                averagePrice: 0,
                products: []
            };
        }
        
        acc[product.category].totalProducts++;
        acc[product.category].totalOrders += product.orders;
        acc[product.category].products.push(product);
        
        return acc;
    }, {});
    
    // Вычисляем среднюю цену по категориям
    Object.values(aggregatedData).forEach(cat => {
        cat.averagePrice = cat.products.reduce((sum, p) => sum + p.price, 0) / cat.totalProducts;
        delete cat.products; // Убираем детальную информацию для чистоты агрегации
    });
    
    res.status(200).json(Object.values(aggregatedData));
});

// GET user with populated orders (relations)
app.get('/api/users/:id/with-orders', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Связь: находим заказы пользователя (в данном случае просто фильтруем продукты по ID заказов)
    const userOrders = products.filter(p => user.orders.includes(p.id));
    
    res.status(200).json({
        ...user,
        orderDetails: userOrders
    });
});

// Пр3. JSON + внешние API (интеграция, парсинг)
app.get('/api/external-joke', async (req, res) => {
    try {
        // Получаем шутку с внешнего API для развлечения
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        
        // Парсим и трансформируем данные
        const jokeData = {
            setup: response.data.setup,
            punchline: response.data.punchline,
        };
        
        res.status(200).json(jokeData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching external API', error: error.message });
    }
});

// GET all products
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// GET products by category (фильтрация)
app.get('/api/products/category/:category', (req, res) => {
    const categoryProducts = products.filter(p => p.category === req.params.category);
    res.status(200).json(categoryProducts);
});

// GET products statistics (еще одна агрегация)
app.get('/api/products/statistics', (req, res) => {
    const stats = {
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + p.price, 0),
        averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
        inStock: products.filter(p => p.inStock).length,
        outOfStock: products.filter(p => !p.inStock).length,
        mostOrdered: products.reduce((max, p) => p.orders > max.orders ? p : max, products[0])
    };
    
    res.status(200).json(stats);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
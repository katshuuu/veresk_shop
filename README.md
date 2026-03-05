# Veresk - Магазин украшений из эпоксидной смолы

## 📋 Описание проекта
Веб-приложение для магазина украшений из эпоксидной смолы "Veresk" с функционалом управления пользователями и товарами.

## 🛠️ _Технологии и реализованные практики:_

### Пр1. CSS-препроцессоры (SASS)
- Использованы переменные для цветов, отступов и теней
- Применены миксины для переиспользуемых стилей
- Вложенные стили для лучшей организации кода
- Файлы: `frontend/src/styles/_variables.scss`, `frontend/src/styles/main.scss`

### Пр2. Node.js + Express: базовая настройка сервера
- Настроен Express сервер с middleware (cors, body-parser)
- Обработка маршрутов и middleware цепочек
- Файл: `backend/app.js`

### Пр3. JSON + внешние API (интеграция, парсинг)
- Интеграция с внешним API шуток
- Парсинг и трансформация полученных данных
- Эндпоинт: `GET /api/external-joke`

### Пр4. REST API CRUD (User) + простой React-интерфейс
- Полноценный CRUD для пользователей (GET, POST, PUT, DELETE)
- Корректные HTTP коды ответов (200, 201, 204, 400, 404, 500)
- React компоненты для взаимодействия с API
- Файлы: `backend/app.js`, `frontend/src/components/UserForm.js`, `frontend/src/components/UserList.js`

### Пр5. REST API расширенный (Relations + Aggregation)
- Агрегирующие запросы для статистики товаров
- Связи между пользователями и их заказами
- Группировка товаров по категориям
- Эндпоинты: `GET /api/products/aggregated`, `GET /api/users/:id/with-orders`, `GET /api/products/statistics`

## 🚀 Запуск проекта

### Backend
```bash
cd backend
npm install
npm start
# Сервер запустится на http://localhost:5001
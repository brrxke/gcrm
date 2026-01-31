# Gym CRM Backend API

REST API backend для системы управления фитнес-клубом, построенный на **Python Flask + MongoDB**.

## 🚀 Возможности

- ✅ **JWT Аутентификация** - Безопасная авторизация с токенами
- ✅ **Управление пользователями** - Клиенты и администраторы
- ✅ **Абонементы** - Управление тарифными планами
- ✅ **Бронирование** - Запись на пробные занятия
- ✅ **Аналитика** - Статистика посещений и доходов
- ✅ **Отзывы** - Система обратной связи
- ✅ **Чат** - Сообщения между клиентами и тренерами
- ✅ **Загрузка файлов** - Фото профиля с автоматическим ресайзом
- ✅ **Валидация данных** - Marshmallow schemas

## 📋 Требования

- Python 3.8+
- MongoDB 4.4+
- pip (Python package manager)

## 🛠️ Установка

### 1. Клонируйте проект (или используйте существующую папку)

```bash
cd gym-crm-backend
```

### 2. Создайте виртуальное окружение

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Установите зависимости

```bash
pip install -r requirements.txt
```

### 4. Настройте переменные окружения

Отредактируйте файл `.env`:

```env
# Server Configuration
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gym_crm
# Или MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym_crm

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
JWT_ACCESS_TOKEN_EXPIRES=3600

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,pdf
```

### 5. Установите и запустите MongoDB

#### Windows:
```bash
# Скачайте с https://www.mongodb.com/try/download/community
# Установите и запустите MongoDB
mongod
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Mac:
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Или используйте MongoDB Atlas (облако):
1. Зарегистрируйтесь на https://www.mongodb.com/cloud/atlas
2. Создайте кластер
3. Получите connection string
4. Вставьте в `.env` как `MONGODB_URI`

### 6. Инициализируйте базу данных тестовыми данными

```bash
python seed.py
```

Это создаст:
- 3 тарифных плана (Starter, Premium, Elite)
- 6 пользователей (1 admin, 5 clients)
- Данные посещений
- Отзывы

**Тестовые учетные данные:**
```
Admin:  admin@gym.com / admin123
Client: john@example.com / password123
```

### 7. Запустите сервер

```bash
python app.py
```

Сервер запустится на `http://localhost:5000`

## 📚 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register      - Регистрация нового пользователя
POST   /api/auth/login         - Вход в систему
GET    /api/auth/me            - Получить текущего пользователя
POST   /api/auth/change-password - Изменить пароль
```

### Users (`/api/users`)
```
GET    /api/users              - Получить всех клиентов (admin)
GET    /api/users/:id          - Получить пользователя по ID
PUT    /api/users/:id          - Обновить пользователя
DELETE /api/users/:id          - Удалить пользователя (admin)
POST   /api/users/:id/upload-photo - Загрузить фото профиля
GET    /api/users/stats        - Статистика пользователей (admin)
```

### Memberships (`/api/memberships`)
```
GET    /api/memberships        - Получить все абонементы
GET    /api/memberships/:id    - Получить абонемент по ID
POST   /api/memberships        - Создать абонемент (admin)
PUT    /api/memberships/:id    - Обновить абонемент (admin)
DELETE /api/memberships/:id    - Удалить абонемент (admin)
GET    /api/memberships/distribution - Распределение абонементов (admin)
```

### Bookings (`/api/bookings`)
```
POST   /api/bookings           - Создать бронирование
GET    /api/bookings/my-bookings - Мои бронирования
GET    /api/bookings           - Все бронирования (admin)
GET    /api/bookings/:id       - Получить бронирование
PATCH  /api/bookings/:id/status - Обновить статус (admin)
DELETE /api/bookings/:id       - Удалить бронирование
POST   /api/bookings/check-availability - Проверить доступность
```

### Feedback (`/api/feedback`)
```
POST   /api/feedback           - Создать отзыв
GET    /api/feedback/my-feedback - Мои отзывы
GET    /api/feedback           - Все отзывы (admin)
GET    /api/feedback/average-rating - Средняя оценка
```

### Messages (`/api/messages`)
```
POST   /api/messages           - Отправить сообщение
GET    /api/messages/conversation/:userId - Получить диалог
POST   /api/messages/mark-read - Отметить как прочитанное
GET    /api/messages/unread-count - Количество непрочитанных
```

### Analytics (`/api/analytics`)
```
GET    /api/analytics/dashboard - Статистика дашборда (admin)
POST   /api/analytics/visits/record - Записать посещение
GET    /api/analytics/visits/today - Сегодняшние посещения (admin)
GET    /api/analytics/visits/weekly - Недельная статистика (admin)
GET    /api/analytics/visits/popular-hours - Популярные часы (admin)
GET    /api/analytics/visits/my-history - История моих посещений
GET    /api/analytics/revenue  - Статистика доходов (admin)
```

### Health Check
```
GET    /api/health             - Проверка работоспособности API
GET    /                       - Информация об API
```

## 🔑 Аутентификация

API использует JWT токены. Для доступа к защищенным endpoint'ам:

1. Получите токен через `/api/auth/login`
2. Добавьте в headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Пример с cURL:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/users/me
```

## 📝 Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Вход
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Получить абонементы
```bash
curl http://localhost:5000/api/memberships
```

### Создать бронирование
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2026-02-15",
    "time": "10:00"
  }'
```

## 🗄️ Структура базы данных

### Collections:
- **users** - Пользователи (клиенты и админы)
- **memberships** - Тарифные планы
- **bookings** - Бронирования пробных занятий
- **feedback** - Отзывы клиентов
- **messages** - Сообщения чата
- **visits** - Записи посещений для аналитики

## 📁 Структура проекта

```
gym-crm-backend/
├── app.py                      # Главный файл приложения
├── config.py                   # Конфигурация
├── database.py                 # Подключение к БД
├── schemas.py                  # Схемы валидации
├── seed.py                     # Скрипт инициализации БД
├── requirements.txt            # Зависимости
├── .env                        # Переменные окружения
├── models/                     # Модели данных
│   ├── user.py
│   ├── membership.py
│   ├── booking.py
│   ├── feedback.py
│   ├── message.py
│   └── visit.py
├── routes/                     # API endpoints
│   ├── auth.py
│   ├── users.py
│   ├── memberships.py
│   ├── bookings.py
│   ├── feedback_messages.py
│   └── analytics.py
├── middleware/                 # Middleware
│   └── auth.py
└── utils/                      # Утилиты
    └── file_handler.py
```

## 🔧 Разработка

### Запуск в режиме разработки
```bash
python app.py
```

### Использование с nodemon для auto-reload
```bash
pip install nodemon
nodemon app.py
```

## 🚢 Деплой

### Heroku
```bash
# Установите Heroku CLI
heroku login
heroku create gym-crm-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET_KEY=your_secret_key
git push heroku main
```

### Docker
```dockerfile
# Создайте Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

```bash
docker build -t gym-crm-api .
docker run -p 5000:5000 gym-crm-api
```

## 🔐 Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены для аутентификации
- Валидация всех входных данных
- CORS настроен для безопасности
- Ограничение размера загружаемых файлов

## 🤝 Подключение к Frontend

В вашем React frontend измените API URL:

```javascript
// src/config.js
export const API_URL = 'http://localhost:5000/api';

// Пример запроса
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте, что MongoDB запущен
2. Проверьте переменные окружения в `.env`
3. Убедитесь, что все зависимости установлены

## 📄 Лицензия

MIT License

---

**Создано для Gym CRM App** 🏋️‍♂️

# 🚀 Quick Start Guide

## Быстрый старт за 5 минут!

### 1️⃣ Установите Python и MongoDB

**Python**: https://www.python.org/downloads/ (версия 3.8+)

**MongoDB**:
- Windows/Mac: https://www.mongodb.com/try/download/community
- Linux: `sudo apt-get install mongodb`
- **Или используйте MongoDB Atlas** (бесплатный облачный MongoDB): https://www.mongodb.com/cloud/atlas

### 2️⃣ Установите зависимости

```bash
# Создайте виртуальное окружение
python -m venv venv

# Активируйте его
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Установите пакеты
pip install -r requirements.txt
```

### 3️⃣ Настройте .env файл

Отредактируйте `.env` и укажите ваш MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/gym_crm
# Или для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym_crm
```

### 4️⃣ Запустите MongoDB

```bash
# Windows: Откройте MongoDB Compass или
mongod

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb
```

**Для MongoDB Atlas**: Просто получите connection string из вашего кластера.

### 5️⃣ Запустите сервисы

```bash
python services/auth/app.py
python services/users/app.py
python services/memberships/app.py
python services/bookings/app.py
python services/feedback/app.py
python services/analytics/app.py
python services/telegram/app.py
```

Каждый сервис запускается на своём порту (5001-5007). Если используете gateway, он слушает `http://localhost:5008` ✅

### 6️⃣ Протестируйте API

Откройте браузер: http://localhost:5008

Или используйте cURL:
```bash
curl http://localhost:5008/api/health
```

## 🎯 Тестовые учетные данные

```
Admin:
  Email: admin@gym.com
  Password: admin123

Client:
  Email: john@example.com
  Password: password123
```

## 🧪 Как протестировать API?

### Вариант 1: Postman
1. Импортируйте `Gym_CRM_API.postman_collection.json`
2. Выполните запрос "Login" (это сохранит токен)
3. Тестируйте остальные endpoints!

### Вариант 2: cURL

```bash
# Login
curl -X POST http://localhost:5008/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"admin123"}'

# Это вернет токен, используйте его так:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5008/api/users/stats
```

### Вариант 3: Python requests

```python
import requests

# Login
response = requests.post('http://localhost:5008/api/auth/login', 
    json={'email': 'admin@gym.com', 'password': 'admin123'})
token = response.json()['access_token']

# Use token
headers = {'Authorization': f'Bearer {token}'}
stats = requests.get('http://localhost:5008/api/analytics/dashboard', 
    headers=headers)
print(stats.json())
```

## 🔗 Подключение к Frontend

В вашем React приложении:

```javascript
// config.js
export const API_URL = 'http://localhost:5008/api';

// Пример использования
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Authenticated request
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

## ⚠️ Troubleshooting

**Проблема**: `ModuleNotFoundError`
**Решение**: `pip install -r requirements.txt`

**Проблема**: `Could not connect to database`
**Решение**: Проверьте, что MongoDB запущен: `mongod` или используйте Atlas

**Проблема**: `Port 5008 already in use`
**Решение**: Освободите порт 5008 или измените порт gateway в `docker-compose.yaml`

**Проблема**: JWT токен не работает
**Решение**: Проверьте, что вы добавили `Authorization: Bearer TOKEN` в header

## 📱 Основные endpoints

```
POST   /api/auth/login           - Вход
POST   /api/auth/register        - Регистрация
GET    /api/memberships          - Получить тарифы
POST   /api/bookings             - Забронировать занятие
GET    /api/analytics/dashboard  - Статистика (admin)
```

## 🎓 Что дальше?

1. Прочитайте полный `README.md` для деталей
2. Изучите все endpoints в Postman коллекции
3. Подключите ваш React frontend
4. Настройте production deployment

## 💡 Советы

- Всегда активируйте виртуальное окружение перед работой
- Используйте `.env` для секретных ключей (НЕ коммитьте его в git!)
- Для production измените `JWT_SECRET_KEY` на надежный
- Настройте CORS для вашего frontend домена

---

**Готово! Теперь у вас работающий backend API! 🎉**

Нужна помощь? Проверьте `README.md` или документацию по endpoints.

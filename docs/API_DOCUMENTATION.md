# 📖 API Documentation

Полная документация всех API endpoints для Gym CRM Backend.

**Base URL**: `http://localhost:5001/api`

---

## 🔐 Authentication

Все защищенные endpoints требуют JWT токен в header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### POST `/auth/register`
Регистрация нового пользователя

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "client"  // optional: "client" or "admin"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_id": "507f1f77bcf86cd799439011"
}
```

### POST `/auth/login`
Вход в систему

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "membership": "Premium",
    "membership_status": "active"
  }
}
```

### GET `/auth/me`
Получить текущего пользователя

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

### POST `/auth/change-password`
Изменить пароль

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

---

## 👥 Users

### GET `/users`
Получить всех клиентов (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Query Parameters**:
- `status` (optional): "active" | "expired" | "trial" | "all"
- `search` (optional): поиск по имени/email

**Response** (200):
```json
{
  "clients": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "membership": "Premium",
      "membership_status": "active",
      "join_date": "2024-01-15T10:00:00Z",
      "expiry_date": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

### GET `/users/:id`
Получить пользователя по ID

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "membership": "Premium",
    "membership_status": "active"
  }
}
```

### PUT `/users/:id`
Обновить пользователя

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+9876543210",
  "membership": "Elite",
  "membership_status": "active",
  "expiry_date": "2025-12-31T23:59:59Z"
}
```

**Response** (200):
```json
{
  "message": "User updated successfully",
  "user": { /* updated user object */ }
}
```

### DELETE `/users/:id`
Удалить пользователя (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

### POST `/users/:id/upload-photo`
Загрузить фото профиля

**Headers**: `Authorization: Bearer TOKEN`

**Request**: multipart/form-data
- `file`: image file (jpg, png, jpeg)

**Response** (200):
```json
{
  "message": "Profile photo uploaded successfully",
  "filename": "abc123def456.jpg"
}
```

### GET `/users/stats`
Статистика пользователей (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "total_clients": 100,
  "active_members": 85,
  "expired_members": 10,
  "trial_members": 5
}
```

---

## 🏋️ Memberships

### GET `/memberships`
Получить все активные абонементы (public)

**Response** (200):
```json
{
  "memberships": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Premium",
      "price": 59.0,
      "duration": 1,
      "features": [
        "Gym Access",
        "All Equipment",
        "Group Classes",
        "Personal Trainer"
      ],
      "description": "Most popular choice",
      "is_active": true
    }
  ]
}
```

### GET `/memberships/:id`
Получить абонемент по ID (public)

**Response** (200):
```json
{
  "membership": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium",
    "price": 59.0,
    "duration": 1,
    "features": ["..."],
    "description": "Most popular choice"
  }
}
```

### POST `/memberships`
Создать абонемент (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Request Body**:
```json
{
  "name": "VIP",
  "price": 149.0,
  "duration": 1,
  "features": [
    "All Elite features",
    "Private training room",
    "Spa access"
  ],
  "description": "Ultimate experience",
  "is_active": true
}
```

**Response** (201):
```json
{
  "message": "Membership created successfully",
  "membership_id": "507f1f77bcf86cd799439011"
}
```

### PUT `/memberships/:id`
Обновить абонемент (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Request Body**: (все поля optional)
```json
{
  "price": 69.0,
  "features": ["Updated feature list"]
}
```

**Response** (200):
```json
{
  "message": "Membership updated successfully",
  "membership": { /* updated membership */ }
}
```

### DELETE `/memberships/:id`
Деактивировать абонемент (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "message": "Membership deactivated successfully"
}
```

### GET `/memberships/distribution`
Распределение абонементов (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "distribution": [
    { "_id": "Starter", "count": 120 },
    { "_id": "Premium", "count": 230 },
    { "_id": "Elite", "count": 85 }
  ]
}
```

---

## 📅 Bookings

### POST `/bookings`
Создать бронирование

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2026-02-15",
  "time": "10:00",
  "notes": "First time visitor"
}
```

**Response** (201):
```json
{
  "message": "Booking created successfully",
  "booking_id": "507f1f77bcf86cd799439011"
}
```

### GET `/bookings/my-bookings`
Получить свои бронирования

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "507f...",
      "name": "John Doe",
      "date": "2026-02-15",
      "time": "10:00",
      "status": "confirmed",
      "created_at": "2026-01-30T10:00:00Z"
    }
  ],
  "total": 1
}
```

### GET `/bookings`
Получить все бронирования (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Query Parameters**:
- `status` (optional): "pending" | "confirmed" | "completed" | "cancelled"
- `date` (optional): "2026-02-15"

**Response** (200):
```json
{
  "bookings": [ /* array of bookings */ ],
  "total": 10
}
```

### GET `/bookings/:id`
Получить бронирование по ID

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "booking": {
    "_id": "507f1f77bcf86cd799439011",
    "user_id": "507f...",
    "name": "John Doe",
    "date": "2026-02-15",
    "time": "10:00",
    "status": "confirmed"
  }
}
```

### PATCH `/bookings/:id/status`
Обновить статус бронирования (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Request Body**:
```json
{
  "status": "confirmed"  // "pending" | "confirmed" | "completed" | "cancelled"
}
```

**Response** (200):
```json
{
  "message": "Booking status updated successfully"
}
```

### DELETE `/bookings/:id`
Удалить бронирование

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "message": "Booking deleted successfully"
}
```

### POST `/bookings/check-availability`
Проверить доступность времени (public)

**Request Body**:
```json
{
  "date": "2026-02-15",
  "time": "10:00"
}
```

**Response** (200):
```json
{
  "available": true
}
```

---

## 💬 Feedback

### POST `/feedback`
Создать отзыв

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "rating": 5,
  "category": "equipment",
  "comment": "Great gym!",
  "suggestions": "More cardio machines"
}
```

**Response** (201):
```json
{
  "message": "Feedback submitted successfully",
  "feedback_id": "507f1f77bcf86cd799439011"
}
```

### GET `/feedback/my-feedback`
Получить свои отзывы

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "feedback": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "507f...",
      "rating": 5,
      "category": "equipment",
      "comment": "Great gym!",
      "created_at": "2026-01-30T10:00:00Z"
    }
  ],
  "total": 1
}
```

### GET `/feedback`
Получить все отзывы (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Query Parameters**:
- `rating` (optional): 1-5
- `category` (optional): string

**Response** (200):
```json
{
  "feedback": [ /* array of feedback */ ],
  "total": 50
}
```

### GET `/feedback/average-rating`
Получить среднюю оценку (public)

**Response** (200):
```json
{
  "average_rating": 4.5,
  "total_feedback": 50
}
```

---

## 💌 Messages

### POST `/messages`
Отправить сообщение

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "receiver_id": "507f1f77bcf86cd799439011",
  "message": "Hello, I have a question about my membership"
}
```

**Response** (201):
```json
{
  "message": "Message sent successfully",
  "message_id": "507f1f77bcf86cd799439011"
}
```

### GET `/messages/conversation/:other_user_id`
Получить диалог с пользователем

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sender_id": "507f...",
      "receiver_id": "507f...",
      "message": "Hello!",
      "is_read": true,
      "created_at": "2026-01-30T10:00:00Z"
    }
  ],
  "total": 10
}
```

### POST `/messages/mark-read`
Отметить сообщения как прочитанные

**Headers**: `Authorization: Bearer TOKEN`

**Request Body**:
```json
{
  "message_ids": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

**Response** (200):
```json
{
  "message": "2 messages marked as read"
}
```

### GET `/messages/unread-count`
Количество непрочитанных сообщений

**Headers**: `Authorization: Bearer TOKEN`

**Response** (200):
```json
{
  "unread_count": 3
}
```

---

## 📊 Analytics

### GET `/analytics/dashboard`
Получить статистику дашборда (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "user_stats": {
    "total_clients": 100,
    "active_members": 85,
    "expired_members": 10,
    "trial_members": 5
  },
  "visit_stats": {
    "today_visits": 45,
    "weekly_visits": [
      { "date": "2026-01-24", "visits": 120 },
      { "date": "2026-01-25", "visits": 145 }
    ],
    "popular_hours": [
      { "hour": 6, "count": 45 },
      { "hour": 18, "count": 89 }
    ]
  },
  "membership_distribution": [
    { "_id": "Starter", "count": 120 },
    { "_id": "Premium", "count": 230 }
  ]
}
```

### POST `/analytics/visits/record`
Записать посещение

**Headers**: `Authorization: Bearer TOKEN`

**Response** (201):
```json
{
  "message": "Visit recorded successfully",
  "visit_id": "507f1f77bcf86cd799439011"
}
```

### GET `/analytics/visits/today`
Сегодняшние посещения (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "today_visits": 45
}
```

### GET `/analytics/visits/weekly`
Недельная статистика (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "weekly_visits": [
    { "date": "2026-01-24", "visits": 120 },
    { "date": "2026-01-25", "visits": 145 }
  ]
}
```

### GET `/analytics/visits/popular-hours`
Популярные часы (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "popular_hours": [
    { "hour": 6, "count": 45 },
    { "hour": 18, "count": 89 }
  ]
}
```

### GET `/analytics/visits/my-history`
История моих посещений

**Headers**: `Authorization: Bearer TOKEN`

**Query Parameters**:
- `limit` (optional): default 30

**Response** (200):
```json
{
  "visits": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "507f...",
      "timestamp": "2026-01-30T10:00:00Z",
      "date": "2026-01-30",
      "hour": 10
    }
  ],
  "total": 15
}
```

### GET `/analytics/revenue`
Статистика доходов (только admin)

**Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Response** (200):
```json
{
  "monthly_revenue": 24580.0,
  "active_subscriptions": 85
}
```

---

## ❤️ Health Check

### GET `/health`
Проверка работоспособности API

**Response** (200):
```json
{
  "status": "healthy",
  "message": "Gym CRM API is running"
}
```

---

## 📝 Error Responses

Все ошибки возвращаются в формате:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Common Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

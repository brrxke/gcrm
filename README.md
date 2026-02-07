# Gym CRM 🚀

**Gym CRM** is a Customer Relationship Management application designed specifically for fitness centers and gyms.  
It helps gym owners and staff **track attendance, manage memberships, monitor gym usage statistics, and sell subscription plans** — all through an extensible API and web interface.

🔗 Repository: https://github.com/brrxke/gcrm

---

## 🚀 Features

Gym CRM includes the following capabilities:

- 🧑‍💼 **User Authentication & Authorization**  
  Secure login system with JWT tokens for client and admin roles.
  
- 📊 **Membership & Subscription Management**  
  Create, update, and delete subscription plans and assign them to members.

- 📅 **Bookings & Scheduling**  
  Book trial sessions or training slots and check availability via API.

- 📈 **Statistics & Analytics**  
  Track visits, revenue, and generate insights on gym usage.

- 💬 **Feedback & Messaging**  
  Built-in client feedback system and in-app messaging between trainers and members.

> This set of features provides a solid basis for managing gym operations and can be extended further to include class scheduling, trainer management, automated reminders, etc.

---

## 📦 Tech Stack

✅ **Backend:** Python + Flask (microservices)  
✅ **Database:** MongoDB  
✅ **Authentication:** JWT  
✅ **Frontend:** React + Vite  
✅ **Tools:** Docker & Docker Compose support included  

---

## 🧠 Motivation

Gym CRM was built to provide a **flexible, open source backend** for gym management systems — focused on core CRM needs like member tracking, subscription sales, visit statistics and communication.

---

## 📌 Installation & Quick Start

### Option 1: Docker Compose (Recommended)

1️⃣ Clone the Repository

```bash
git clone https://github.com/brrxke/gcrm.git
cd gcrm
```

2️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gym_crm

# JWT Secret Key (CHANGE THIS IN PRODUCTION!)
JWT_SECRET_KEY=dev-secret-key-12345

# JWT Token Expiration (in hours)
JWT_ACCESS_TOKEN_EXPIRES=1

# Flask Environment
FLASK_ENV=development

# Server Configuration
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGINS=http://localhost:8080,http://frontend:5173

# Frontend Configuration
FRONTEND_PORT=8080
FRONTEND_HOST=0.0.0.0
```

3️⃣ Start All Services

```bash
docker-compose up -d
```

This will start:
- **MongoDB** on port 27017
- **API Gateway** on port 5008 (routes to microservices)
- **Frontend** on port 8080
- **Mongo Express** on port 8081 (optional GUI for MongoDB)

4️⃣ Access the Application

- Frontend: http://localhost:8080
- API Gateway: http://localhost:5008
- Mongo Express: http://localhost:8081

### Option 2: Local Development

1️⃣ Clone and Install Backend Dependencies

```bash
git clone https://github.com/brrxke/gcrm.git
cd gcrm
pip install -r requirements.txt
```

2️⃣ Install Frontend Dependencies

```bash
npm install
```

3️⃣ Configure Environment

Create `.env` file as shown in Option 1.

4️⃣ Start MongoDB

```bash
mongod
```

Or use MongoDB Atlas for cloud database.

5️⃣ Start Services (pick one or all)

```bash
python services/auth/app.py
python services/users/app.py
python services/memberships/app.py
python services/bookings/app.py
python services/feedback/app.py
python services/analytics/app.py
python services/telegram/app.py
```

Each service runs on its own port (5001-5007 by default). The gateway aggregates them on http://localhost:5000.

6️⃣ Start Frontend

```bash
npm run dev
```

Frontend will be available at http://localhost:8080

---

## 📘 API Documentation

Full API specification can be found in:

➡️ **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Example Requests (cURL)

# Login
curl -X POST http://localhost:5008/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'

# Get memberships
curl http://localhost:5008/api/memberships

# Create booking
curl -X POST http://localhost:5008/api/bookings \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"date":"2026-02-15","time":"10:00"}'

---

## 🐳 Docker Services

### Services Included

- **mongodb**: MongoDB 7.0 database
- **gateway**: Nginx API gateway routing to microservices
- **auth-service**: Auth/JWT endpoints
- **users-service**: User management
- **memberships-service**: Membership plans
- **bookings-service**: Trial bookings
- **feedback-service**: Feedback + messaging
- **analytics-service**: Visits + dashboard stats
- **telegram-service**: Telegram bot management
- **frontend**: React frontend served via nginx
- **mongo-express**: Web-based MongoDB admin interface

### Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables

All configuration is managed through a single `.env` file:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `JWT_ACCESS_TOKEN_EXPIRES` - Token expiration time (hours)
- `FLASK_ENV` - Flask environment (development/production)
- `PORT` - Backend port
- `HOST` - Backend host
- `CORS_ORIGINS` - Allowed CORS origins
- `FRONTEND_PORT` - Frontend port

**Important:** Never commit `.env` files to version control (already in `.gitignore`)

---

## 🗄️ MongoDB Connection

The application automatically connects to MongoDB on startup using the `MONGODB_URI` from `.env` file. Connection features:

- ✅ Automatic connection on application start
- ✅ Automatic collection and index creation on first run
- ✅ Connection status logging
- ✅ Health check verification
- ✅ Graceful error handling

### Collections

The following collections are automatically created on first run:

- `users` - User accounts (admin and clients)
- `memberships` - Membership plans
- `bookings` - Booking reservations
- `feedback` - Customer feedback
- `messages` - Internal messaging
- `visits` - Visit tracking

### Database Initialization

**Automatic:** Collections and indexes are created automatically on the first run.

Manual initialization utilities were removed as part of the microservices cleanup.

The application automatically connects to MongoDB on startup using the `MONGODB_URI` from `.env` file. Connection features:

- ✅ Automatic connection on application start
- ✅ Automatic collection and index creation on first run
- ✅ Connection status logging
- ✅ Health check verification
- ✅ Graceful error handling

### Collections

The following collections are automatically created on first run:

- `users` - User accounts (admin and clients)
- `memberships` - Membership plans
- `bookings` - Booking reservations
- `feedback` - Customer feedback
- `messages` - Internal messaging
- `visits` - Visit tracking

### Database Initialization

**Automatic:** Collections and indexes are created automatically on the first run.

Manual initialization utilities were removed as part of the microservices cleanup.

---

## 🗺️ Roadmap

Planned enhancements may include:

- 📆 Class scheduling & reservations
- 📧 Email/SMS notifications
- 📌 Trainer management
- 📊 Enhanced metrics dashboards
- 💳 Payment integration
- 📱 Mobile app

---

## 🧩 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under MIT License — see the LICENSE file for details.

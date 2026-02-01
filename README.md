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

- 📁 **File Uploads**  
  Upload profile photos with automatic resizing and validation.

> This set of features provides a solid basis for managing gym operations and can be extended further to include class scheduling, trainer management, automated reminders, etc. :contentReference[oaicite:0]{index=0}

---

## 📦 Tech Stack

✅ **Backend:** Python + Flask  
✅ **Database:** MongoDB  
✅ **Authentication:** JWT  
✅ **Frontend:** (Separate SPA or integration – not included by default)  
✅ **Tools:** Docker support included  

---

## 🧠 Motivation

Gym CRM was built to provide a **flexible, open source backend** for gym management systems — focused on core CRM needs like member tracking, subscription sales, visit statistics and communication.

---

## 📌 Installation & Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/brrxke/gcrm.git
cd gcrm

2️⃣ Install Dependencies

pip install -r requirements.txt

3️⃣ Environment Setup

Configure your .env file:

FLASK_APP=app.py
FLASK_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/gcrm
JWT_SECRET_KEY=your_secret_key

4️⃣ Run MongoDB

Start a local MongoDB instance (or use MongoDB Atlas).
5️⃣ Start the Server

python app.py

The API will run at:

http://localhost:5000

📘 API Documentation

Full API specification can be found in:

➡️ API_DOCUMENTATION.md

Example:

# Register new user
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

🧪 Example Requests (cURL)

# Login
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'

# Get memberships
curl http://localhost:5000/api/memberships

# Create booking
curl -X POST http://localhost:5000/api/bookings \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"date":"2026-02-15","time":"10:00"}'

🛣️ Roadmap

Planned enhancements may include:

    📆 Class scheduling & reservations

    📧 Email/SMS notifications

    📲 Web or mobile frontend

    📌 Trainer management

    📊 Enhanced metrics dashboards

🧩 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
📄 License

This project is licensed under MIT License — see the LICENSE file for details.

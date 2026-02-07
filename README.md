# Gym CRM

Gym CRM is a lightweight microservices-based CRM for gyms with a React frontend and a Python/Flask backend.

## Architecture (Monorepo)
- `apps/` - runnable services (microservices)
- `shared/` - shared backend code (models, schemas, middleware, routes)
- `src/` - React frontend
- `infra/` - nginx configs
- `docs/` - API docs and Postman collection

## Quick Start (Docker)
```bash
docker-compose up -d --build
```

Open:
- Frontend (via gateway): http://localhost:5008
- Frontend (direct): http://localhost:8080
- Mongo Express: http://localhost:8081

## Environment
Create `.env` in the repo root:
```bash
MONGODB_URI=mongodb://mongodb:27017/gym_crm
JWT_SECRET_KEY=change-me
JWT_ACCESS_TOKEN_EXPIRES=1
FLASK_ENV=development
CORS_ORIGINS=http://localhost:8080
```

## Local Dev (without Docker)
```bash
# backend services
python apps/services/auth/app.py
python apps/services/users/app.py
python apps/services/memberships/app.py
python apps/services/bookings/app.py
python apps/services/feedback/app.py
python apps/services/analytics/app.py
python apps/services/telegram/app.py

# frontend
npm install
npm run dev
```

## Docs
- API: `docs/API_DOCUMENTATION.md`
- Postman: `docs/Gym_CRM_API.postman_collection.json`

## Notes
- No test credentials are bundled. Register a user via UI or API.
- Collections/indexes are created automatically on first run.

# Personal Expense Tracker — Backend API

Production-ready REST API built with Node.js, Express, MongoDB Atlas (Mongoose), and JWT auth.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env       # then fill in MONGO_URI and JWT_SECRET
npm run dev                # nodemon (development)
npm start                  # production
```

## 🔑 Environment Variables

| Var            | Description                                          |
| -------------- | ---------------------------------------------------- |
| `PORT`         | Server port (default `5000`)                         |
| `MONGO_URI`    | MongoDB Atlas connection string                      |
| `JWT_SECRET`   | Long random string for signing JWTs                  |
| `FRONTEND_URL` | Allowed origin(s), comma-separated. Use `*` for all. |

## 📦 Endpoints

All protected routes require header: `Authorization: Bearer <token>`.

### Auth

- `POST /api/auth/register` — `{ username, password }`
- `POST /api/auth/login` — `{ username, password }` → returns `{ token }`

### Expenses (protected)

- `POST /api/expenses` — `{ amount, category, notes?, date? }`
- `GET  /api/expenses?category=Food&page=1&limit=20`
- `GET  /api/expenses/monthly?year=2026&month=4`
- `PUT  /api/expenses/:id`
- `DELETE /api/expenses/:id`

Categories: `EMI | Investment | Food | Medical | Travel | Other`

### Borrow / Lending (protected)

- `POST /api/borrow` — `{ personName, type, amount, notes?, status?, date? }`
- `GET  /api/borrow?status=PENDING&type=RECEIVE`
- `PUT  /api/borrow/:id` — update including `{ status: "SETTLED" }`
- `DELETE /api/borrow/:id`

### Dashboard (protected)

- `GET /api/dashboard/summary` →
  ```json
  { "totalExpenses": 0, "totalToReceive": 0, "totalToPay": 0 }
  ```

## 📐 Response Shape

```json
{ "success": true, "data": {}, "message": "..." }
```

## ☁️ Deploy to Render

1. Push this `backend/` folder to a GitHub repo.
2. On Render → **New Web Service** → connect repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`.
6. In MongoDB Atlas → Network Access → allow `0.0.0.0/0` (or Render's IPs).

## 🔌 Connect from React frontend

```js
const API = import.meta.env.VITE_API_URL; // e.g. https://your-app.onrender.com
fetch(`${API}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
```

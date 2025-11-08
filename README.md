🛒 Mock E-Commerce Cart — Full Stack Coding Assignment

### Submission for: *Vibe Commerce Full Stack Screening*
*Tech Stack:* React (Frontend) · Node.js + Express (Backend) · SQLite (Database)

---

## 🚀 Overview
This is a *mock full-stack shopping cart application* built as part of the *Vibe Commerce* coding assignment.  
It demonstrates a complete *e-commerce cart workflow* including adding/removing items, viewing totals, and performing a mock checkout — with full frontend-backend integration.

The project follows a *REST API structure* and uses *SQLite* for lightweight local persistence.

---

## 🧩 Features

### 🖥 Frontend (React)
- Responsive product grid showing mock items  
- Add/Remove products from cart  
- View and update cart quantities  
- Display cart total in real-time  
- Checkout form (name, email) → generates a mock receipt  
- Clean, minimal, and mobile-friendly UI  

### ⚙ Backend (Node.js + Express)
- GET /api/products → Returns list of mock products  
- POST /api/cart → Add product to cart  
- DELETE /api/cart/:id → Remove product from cart  
- GET /api/cart → Fetch cart items and total  
- POST /api/checkout → Mock checkout → returns receipt with total & timestamp  
- SQLite database integration for persistent mock data  

---

## 🗂 Folder Structure

/project-root ├── /frontend     → React app (UI) ├── /backend      → Express server + SQLite DB ├── README.md ├── package.json

---

## 🧠 API Endpoints Summary

| Method | Endpoint             | Description |
|--------|----------------------|--------------|
| GET    | /api/products      | Fetch all available products |
| POST   | /api/cart          | Add an item to cart { productId, qty } |
| DELETE | /api/cart/:id      | Remove item from cart by ID |
| GET    | /api/cart          | Get all cart items and total |
| POST   | /api/checkout      | Mock checkout – returns total & timestamp |

---

## ⚡ Setup Instructions

### 🧩 Backend Setup
```bash
cd backend
npm install
npm start

This starts the Express server at http://localhost:4000.

Ensure sqlite3 is installed and a local database file (database.sqlite) exists or will be auto-created.


---

💻 Frontend Setup

cd frontend
npm install
npm run dev

This starts the React app at http://localhost:5173.


---

🔐 Environment Variables

Create a .env file in /backend:

PORT=4000
DB_FILE=./database.sqlite

✅ .env is ignored via .gitignore for security.


---

🧾 Mock Data Example

GET /api/products returns:

[
  { "id": 1, "name": "Urban Hoodie", "price": 1499 },
  { "id": 2, "name": "Streetwear Tee", "price": 899 },
  { "id": 3, "name": "Denim Jacket", "price": 2499 }
]


---

🧾 Checkout Response Example

POST /api/checkout

{
  "total": 3897,
  "timestamp": "2025-11-08T12:45:30.000Z",
  "message": "Checkout successful!"
}


---

🧰 Tools & Libraries Used

Frontend

React (Vite)

Axios

Lucide Icons

Tailwind / Custom CSS


Backend

Express.js

SQLite3

CORS

dotenv



---

📹 Demo Video

🎥 Watch the Demo: https://youtu.be/3HsiNeqQelw


---

🧑‍💻 Author

Aman
📍 Full Stack Developer | React · Node.js · SQLite
💼 GitHub Profile


---

📝 Notes

No real payment integration (mock checkout only)

Built for demonstration purposes — testing CRUD + REST + integration

Fully functional on localhost setup

Completed within 48-hour submission timeline



---

> © 2025 Vibe Commerce Full Stack Assignment — Developed by Aman



---

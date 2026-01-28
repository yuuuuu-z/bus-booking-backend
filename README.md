# 🚌 Bus Booking Backend API

A modern backend API for bus booking system built with Node.js, Express, and Prisma.

---

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL (Neon)** - Cloud database
- **Supabase** - File Storage
- **bcrypt** - Password hashing

---

## 📦 Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon account recommended)

### Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/yuuuuu-z/bus-booking-backend.git
cd bus-booking-backend
```

#### 2️⃣ Install dependencies

```bash
npm install
```

#### 3️⃣ Environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_neon_postgres_url
PORT=8000

```

#### 4️⃣ Prisma setup

Generate Prisma Client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

#### 5️⃣ Start the server

```bash
npm run dev
```

---

## 🌐 Server

The server will run at:

**http://localhost:8000**

---

## 📝 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if configured)

---

## 📚 Project Structure

```
bus-booking-backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── lib/
│   │   └── prisma.js
│   ├── app.js
│   └── server.js
└── package.json
```

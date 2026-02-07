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

## 💳 Bakong (KHQR) payment

The API integrates with [Bakong](https://bakong-api.online) for KHQR payments (Cambodia).

1. **Create booking with payment**  
   `POST /booking` with body including `amount` (USD). If `BAKONG_ID` and `BAKONG_MERCHANT_NAME` are set, the response includes `payment: { qr, md5, tran, amount }`. Show the `qr` URL as a QR code so the user can pay with their banking app.

2. **Check payment status**  
   `GET /booking/:id/payment-status` – calls Bakong; if the payment is confirmed, the booking is updated to `paymentStatus: "paid"`. Poll this from the frontend until `paymentStatus` is `"paid"`.

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

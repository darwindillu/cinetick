# CineTick 🎬

A full stack movie ticket booking platform. Users browse movies and theatres, pick a show, choose their seats and pay online. Admins manage theatres, movies, show times and users.

Built with **React (TypeScript)**, **Node.js**, **Express** and **MongoDB**, with **Razorpay** payments, **Socket.io** for live seat updates and an **OpenAI**-powered movie assistant.

<!-- Screenshots: add 2–3 images here, e.g. home page, seat selection, admin panel -->
<!-- ![Seat selection](docs/screenshots/seats.png) -->

## Features

### For users
- Passwordless sign-in with an **email OTP** (6 digits, expires in 5 minutes, single use, limited attempts)
- JWT authentication with refresh tokens and protected routes
- Browse movies and theatres, and view show times by date
- Interactive seat selection, with **live seat availability** over Socket.io
- Checkout with **Razorpay**: the server prices the order and verifies the payment signature before saving a booking
- Protection against double booking of the same seat
- **AI movie assistant** (OpenAI) that answers questions and recommends movies from what is currently showing
- Order details page for each booking

### For admins
- Separate admin login with email OTP
- Add theatres, movies and show times, with poster and image uploads (admin-only, JWT-protected API)
- View and manage users

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, React Router, Formik + Yup, Bootstrap, Axios, Socket.io client |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, Multer, Nodemailer, Socket.io |
| Payments | Razorpay |
| AI | OpenAI API |

## Project structure

```
client/   React + TypeScript frontend
server/   Express API (controllers, models, routes, utils)
```

## Getting started

Requirements: Node.js 18+ and a MongoDB database.

### 1. Backend

```bash
cd server
npm install
```

Copy the env template and fill in the values:

```bash
cp .env.example .env
```

`server/.env.example` explains every setting. In local development you can leave `EMAIL` empty: OTPs are then printed to the server console. The AI assistant needs `OPENAI_API_KEY`, and payments need Razorpay **test** keys.

```bash
npm start
```

The API runs on port `3001`.

### 2. Frontend

```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000`.

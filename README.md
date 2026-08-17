# Mulla Fresh Juices & Fried Chicken ordering website

A MERN stack restaurant ordering system for **Mulla Fresh Juices & Fried Chicken**, featuring dual-language localization (English / Urdu RTL), cart management, order placement, a protected admin dashboard, sales reporting, and real-time order alerts.

---

## Project Structure

- `/client` → React.js (Vite) frontend with Tailwind CSS, React Context, Recharts, and Socket.io-client.
- `/server` → Node.js + Express.js backend REST API, Socket.io server, and MongoDB (Mongoose).

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)

---

## Local Setup & Installation

### 1. Database Configuration
Make sure your MongoDB server is running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/mulla_db`), or prepare your MongoDB Atlas Connection String.

### 2. Backend Server Setup
Navigate to `/server` or modify the `/server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
```

Install server dependencies:
```bash
cd server
npm install
```

### 3. Seed Database
Extract and seed all menu items (including Urdu names and prices in PKR) directly from the restaurant menu boards:
```bash
npm run seed
# Or manually run: node scripts/seed.js
```
*Note: This creates the default admin user: Username: `admin` | Password: `admin123`.*

### 4. Frontend Client Setup
Navigate to `/client`:
Install client dependencies:
```bash
cd client
npm install
```

The client is configured to proxy requests to `http://localhost:5000`.

---

## Running the Application Locally

Start the backend API server (runs on `http://localhost:5000`):
```bash
cd server
npm start
# Or for development: npm run dev
```

Start the frontend Vite development server (runs on `http://localhost:3000`):
```bash
cd client
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## Testing & Verification

We have created an automated integration test script to verify all REST API routes (authentication, menu management, and order placement):
1. Ensure the backend server is running (`npm start` in `/server`).
2. Run the verification script:
   ```bash
   cd server
   node scripts/verify.js
   ```

---

## Features Walkthrough

### Customer Experience
- **Language Switcher**: Click the **اردو / English** toggle in the Navbar to instantly translate the UI. Urdu mode activates a Right-to-Left (RTL) layout, Noto Nastaliq Urdu font, and Urdu menu items. English mode switches to a Left-to-Right (LTR) layout and Poppins font.
- **Menu Filtering & Search**: Browse the menu using category tabs (Deals, Pizza, Burgers, Shakes, etc.). Search works instantly across both English and Urdu item names.
- **Pizza Sizes**: Support for multi-size item pricing (e.g., Pizza Small/Medium/Large).
- **Persistent Cart**: Items and sizes in your cart persist in `localStorage` until check out.
- **Order Tracking**: Places a Cash-on-Delivery (COD) order. The confirmation page receives real-time updates when an admin alters the order state.

### Administrator Experience
- **Login Securely**: Access `/admin` and log in with user credentials (`admin` / `admin123`).
- **Real-Time Notification Chimes**: When a customer places a new order, the admin dashboard plays an instant double-tone chime and shows a visual popup.
- **Order Management**: Change order states (Pending → Preparing → Out for Delivery → Completed) using the dropdown menus. Click the eye icon to view order details.
- **Menu Management**: Create, update, or delete menu items. Toggle item stock availability or mark items as "Special" to show a Best Seller badge on the frontend.
- **Sales Reporting**: Dynamic visual charts using Recharts displaying daily order counts and revenue.

---

## Production Deployment Guide

### MongoDB Atlas Setup
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and set up database access credentials (username and password).
3. Whitelist IP access (set `0.0.0.0/30` to allow access from any server instance).
4. Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/mulla_db?retryWrites=true&w=majority`).

### Deploying Backend Server to Render
1. Create a new Web Service on [Render](https://render.com).
2. Link your Git repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the environment variables:
   - `MONGO_URI`: (Your MongoDB Atlas connection URI)
   - `JWT_SECRET`: (A secure random string)
   - `PORT`: `10000` (Render allocates this automatically)

### Deploying Frontend Client to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Link your Git repository.
3. Set the root directory to `client`.
4. Configure Build & Development settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Deploy. (Optional: Configure Vercel rewrites to proxy `/api` routes if utilizing custom domains, or update the api URLs in `/client/src/pages/Menu.jsx` etc. to target the Render service URL directly instead of relative routes).

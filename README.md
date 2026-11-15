# HotelPro - Hotel Room Management & Reservation System

A clean, modern, and complete web project built with **HTML5, CSS3, Vanilla JavaScript, and Supabase / Backend Database**.

Designed specifically for college submissions, academic demonstrations, and practical vivas.

---

## 🚀 How to Run the Project

### Option 1: Direct Double-Click (Zero Setup Required)
1. Double-click **`index.html`** in this folder.
2. It opens directly in Google Chrome, Microsoft Edge, or Firefox.
3. Everything works out-of-the-box (5 Rooms, Search Bar, Booking Modal with Live Price Calculation, Google Maps, Login/Register, My Bookings, and Admin Dashboard).

### Option 2: Run with Backend Server
1. Open PowerShell in this folder:
   ```powershell
   node server.js
   ```
2. Open your browser to: **`http://localhost:5000`**
3. Data is synchronized live with **`database.json`**.

---

## ⚡ Supabase Cloud Database Setup (3 Quick Steps)

Your project is pre-configured with **Supabase Cloud PostgreSQL** support!

### Step 1: Create a Free Project on Supabase
1. Go to [https://supabase.com](https://supabase.com) and sign up / log in.
2. Click **"New Project"**, give it a name (e.g. `HotelPro`), and set a database password.

### Step 2: Run the SQL Schema
1. In your Supabase Dashboard: click **"SQL Editor"** in the left menu.
2. Open **`schema.sql`** from your project folder, copy all contents, paste it into the SQL Editor, and click **"RUN"**.
3. This creates all 3 tables (`rooms`, `users`, `bookings`) and seeds the initial 5 hotel rooms and admin user!

### Step 3: Add Your Keys to `supabaseConfig.js`
1. In your Supabase Dashboard: click **Project Settings** (gear icon) -> **API**.
2. Copy **Project URL** and paste it into `SUPABASE_URL` in `supabaseConfig.js`.
3. Copy **Project API keys (anon public)** and paste it into `SUPABASE_ANON_KEY` in `supabaseConfig.js`.
4. Done! Your website is now connected live to a Cloud PostgreSQL database!

---

## 📁 Project Structure & File Guide

| File Name | Category | Function & Description |
|---|---|---|
| **`index.html`** | Frontend (HTML) | Main website landing page: Navigation Bar, Hero Banner, Search Filter, 5 Rooms Showcase, Resident Reviews, Interactive FAQ Accordion, Contact details, 3 Indore Property Locations, and Embedded Google Maps. |
| **`room-details.html`** | Frontend (HTML) | Dedicated Room & Booking Interface matching user layout: 3-Image Photo Gallery, Occupancy & Availability badges, Detailed Description, Included Amenities grid, House Rules list, Resident Reviews with Review submission, and Sticky Pricing Breakdown Card with "Book a Visit" and "Call for Enquiry". |
| **`login.html`** | Frontend (HTML) | User Authentication portal: Sign In and Registration forms connected to Supabase / Backend. |
| **`my-bookings.html`** | Frontend (HTML) | Customer Self-Service page: View booking reference IDs, dates, total price, status badges, and booking cancellation button. |
| **`admin.html`** | Frontend (HTML) | Management Dashboard: View all customer reservations, manage registered users, update booking status, and Add/Edit/Delete hotel rooms. |
| **`style.css`** | Styling (CSS) | Master stylesheet: Responsive grid layouts, typography, color palette (Forest Green & Gold), modal overlays, card hover effects, and mobile media queries. |
| **`app.js`** | Logic (JavaScript) | Master frontend logic: Room rendering, search filter, booking calculations, Google Maps location switcher, authentication state, and database sync. |
| **`supabaseConfig.js`** | Database Config | Stores your Supabase URL & Anon Key, and initializes the Supabase Cloud Client. |
| **`schema.sql`** | SQL Script | Supabase PostgreSQL schema to create `rooms`, `users`, and `bookings` tables with seed data. |
| **`server.js`** | Backend (Node.js) | Lightweight HTTP backend server built using Node's native `http`, `fs`, and `path` modules (zero external npm packages needed). |
| **`database.json`** | Local Database (JSON) | Structured file database storing rooms, registered users, and active customer reservations as a local fallback. |

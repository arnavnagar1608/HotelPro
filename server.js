/**
 * ==========================================================================
 * HotelPro - Complete Backend Server & REST API (Node.js Vanilla)
 * ==========================================================================
 * Built with native Node.js 'http', 'fs', and 'path' modules.
 * Zero external npm packages required!
 *
 * Starts a complete HTTP REST API server connected to 'database.json'.
 * Serves index.html, login.html, my-bookings.html, admin.html, style.css, app.js.
 * 
 * How to run:
 *   node server.js
 * Access in browser:
 *   http://localhost:5000
 * ==========================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, "database.json");

const SEED_DATA = {
  rooms: [
    {
      id: 1,
      name: "Cozy Single Suite",
      price: 3500,
      type: "single",
      occupancy: "SINGLE OCC.",
      location: "Pardesipura",
      rating: 5.0,
      reviewsCount: 12,
      description: "Private furnished single room with dedicated work desk, high-speed Wi-Fi, wall storage racks, and complete privacy for students and working professionals.",
      image: "images/room-doorway-2.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Electricity Included"]
    },
    {
      id: 2,
      name: "Double Comfort Room",
      price: 3200,
      type: "double",
      occupancy: "DOUBLE OCC.",
      location: "Pardesipura",
      rating: 4.8,
      reviewsCount: 9,
      description: "Spacious double-occupancy room ideal for two residents. Each resident gets their own bed and storage space. Well-ventilated with natural light.",
      image: "images/room-double-3.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Housekeeping", "Furnished", "Electricity Included"]
    },
    {
      id: 3,
      name: "Triple Sharing Room",
      price: 2800,
      type: "triple",
      occupancy: "TRIPLE OCC.",
      location: "Pardesipura",
      rating: 4.7,
      reviewsCount: 15,
      description: "Affordable triple sharing setup with individual storage racks, shared desk, regular housekeeping, and 24/7 water supply.",
      image: "images/room-single-1.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Water Included"]
    },
    {
      id: 4,
      name: "Budget Triple Room",
      price: 2500,
      type: "budget",
      occupancy: "BUDGET OCC.",
      location: "Pardesipura",
      rating: 4.5,
      reviewsCount: 20,
      description: "Economical budget triple sharing room with clean surroundings, RO water, security cameras, and electricity included.",
      image: "images/room-shelves.jpg",
      amenities: ["CCTV", "RO Water", "Housekeeping", "Furnished", "Electricity Included"]
    },
    {
      id: 5,
      name: "Premium Single Room",
      price: 3500,
      type: "single",
      occupancy: "SINGLE OCC.",
      location: "Near Aurobindo",
      rating: 5.0,
      reviewsCount: 8,
      description: "Quiet and comfortable single room near Aurobindo Hospital / College, equipped with desk shelves, high-speed Wi-Fi, and 24/7 power backup.",
      image: "images/room-study-4.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Electricity Included"]
    },
    {
      id: 6,
      name: "Deluxe Double Occupancy",
      price: 3200,
      type: "double",
      occupancy: "DOUBLE OCC.",
      location: "Near Aurobindo",
      rating: 4.9,
      reviewsCount: 11,
      description: "Bright and airy double room near Aurobindo campus, featuring individual beds, ceiling fan, storage racks, and daily maintenance.",
      image: "images/room-double-5.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Furnished"]
    },
    {
      id: 7,
      name: "Standard Triple Sharing",
      price: 2800,
      type: "triple",
      occupancy: "TRIPLE OCC.",
      location: "Pardesipura",
      rating: 4.6,
      reviewsCount: 17,
      description: "Standard triple room with spacious layout, tiled flooring, natural airflow, and proximity to coaching institutes & Pardesipura IT hub.",
      image: "images/room-bed.jpg",
      amenities: ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Water Included"]
    },
    {
      id: 8,
      name: "Economy Budget Room",
      price: 2500,
      type: "budget",
      occupancy: "BUDGET OCC.",
      location: "Near Aurobindo",
      rating: 4.4,
      reviewsCount: 14,
      description: "Lowest cost budget accommodation near Aurobindo with essential utilities, clean drinking RO water, and safe CCTV premises.",
      image: "images/room-balcony.jpg",
      amenities: ["CCTV", "RO Water", "Housekeeping", "Furnished", "Electricity Included"]
    }
  ],
  users: [
    { name: "Hotel Admin", email: "admin@hotelpro.com", password: "adminpassword", role: "admin" },
    { name: "Rajat Yadav", email: "rajatyadav25009@gmail.com", password: "password123", role: "customer" }
  ],
  bookings: [
    {
      id: "BK-829103",
      roomId: 1,
      roomName: "Cozy Single Suite",
      guestName: "Rajat Yadav",
      guestEmail: "rajatyadav25009@gmail.com",
      userId: "rajatyadav25009@gmail.com",
      checkIn: "2026-11-20",
      checkOut: "2026-11-22",
      guests: 1,
      nights: 2,
      totalPrice: 7000,
      status: "confirmed",
      createdAt: "2026-11-14T02:00:00.000Z"
    }
  ]
};

// Helper: Read database from database.json with auto-seed fallback
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      return SEED_DATA;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed.rooms || parsed.rooms.length === 0) {
      parsed.rooms = SEED_DATA.rooms;
    }
    return parsed;
  } catch (err) {
    console.error("Database read error:", err.message);
    return SEED_DATA;
  }
}

// Ensure database file exists on startup
readDatabase();

// Helper: Write updated database back to database.json
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Database write error:", err.message);
    return false;
  }
}

// Helper: Parse JSON body from incoming request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

// MIME types for static files
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  // CORS Pre-flight Handling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(`[${req.method}] ${pathname}`);

  // =========================================================================
  // 1. REST API: /api/rooms
  // =========================================================================

  // GET /api/rooms - Retrieve all hotel rooms
  if (req.method === "GET" && pathname === "/api/rooms") {
    const db = readDatabase();
    return sendJson(res, 200, db.rooms || []);
  }

  // POST /api/rooms - Add a new room (Admin)
  if (req.method === "POST" && pathname === "/api/rooms") {
    try {
      const body = await parseBody(req);
      if (!body.name || !body.price) {
        return sendJson(res, 400, { message: "Name and price are required." });
      }
      const db = readDatabase();
      let newId = body.id ? Number(body.id) : null;
      if (!newId || db.rooms.some(r => r.id === newId)) {
        newId = db.rooms.length > 0 ? Math.max(...db.rooms.map(r => Number(r.id) || 0)) + 1 : 1;
      }
      const newRoom = {
        id: newId,
        name: body.name.trim(),
        price: Number(body.price),
        description: (body.description || "").trim(),
        image: body.image || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        amenities: Array.isArray(body.amenities) && body.amenities.length > 0 ? body.amenities : [
          "📶 High-Speed Wi-Fi",
          "💡 24/7 Power Backup",
          "🅿️ Free Parking",
          "🍽️ Restaurant Nearby",
          "💧 24/7 Hot Water",
          "❄️ Air Conditioning"
        ]
      };
      db.rooms.push(newRoom);
      writeDatabase(db);
      console.log(`✓ New room created: ${newRoom.name} (ID: ${newRoom.id})`);
      return sendJson(res, 201, { message: "Room added successfully!", room: newRoom });
    } catch (err) {
      return sendJson(res, 400, { message: "Invalid JSON data" });
    }
  }

  // DELETE /api/rooms/:id - Delete a room
  if (req.method === "DELETE" && pathname.startsWith("/api/rooms/")) {
    const roomId = Number(pathname.split("/").pop());
    const db = readDatabase();
    const index = db.rooms.findIndex(r => r.id === roomId);
    if (index === -1) {
      return sendJson(res, 404, { message: "Room not found." });
    }
    const deleted = db.rooms.splice(index, 1);
    writeDatabase(db);
    console.log(`✓ Room deleted: ID ${roomId}`);
    return sendJson(res, 200, { message: "Room deleted successfully!", room: deleted[0] });
  }

  // PUT /api/rooms/:id - Update / Edit an existing room
  if ((req.method === "PUT" || req.method === "PATCH") && pathname.startsWith("/api/rooms/")) {
    try {
      const roomId = Number(pathname.split("/").pop());
      const body = await parseBody(req);
      const db = readDatabase();
      const room = db.rooms.find(r => r.id === roomId);
      if (!room) {
        return sendJson(res, 404, { message: "Room not found." });
      }

      if (body.name !== undefined) room.name = body.name.trim();
      if (body.price !== undefined) room.price = Number(body.price);
      if (body.description !== undefined) room.description = body.description.trim();
      if (body.image !== undefined) room.image = body.image.trim();
      if (body.amenities !== undefined && Array.isArray(body.amenities)) room.amenities = body.amenities;

      writeDatabase(db);
      console.log(`✓ Room updated: ${room.name} (ID: ${roomId})`);
      return sendJson(res, 200, { message: "Room updated successfully!", room });
    } catch (err) {
      return sendJson(res, 400, { message: "Error updating room." });
    }
  }

  // =========================================================================
  // 2. REST API: /api/bookings
  // =========================================================================

  // GET /api/bookings - Retrieve bookings
  if (req.method === "GET" && pathname === "/api/bookings") {
    const db = readDatabase();
    const userEmail = parsedUrl.searchParams.get("email");
    if (userEmail) {
      // Filter for specific user
      const userBookings = db.bookings.filter(b => b.guestEmail === userEmail || b.userId === userEmail);
      return sendJson(res, 200, userBookings);
    }
    return sendJson(res, 200, db.bookings || []);
  }

  // POST /api/bookings - Create a new booking
  if (req.method === "POST" && pathname === "/api/bookings") {
    try {
      const body = await parseBody(req);
      if (!body.roomId || !body.checkIn || !body.checkOut || !body.guestName || !body.guestEmail) {
        return sendJson(res, 400, { message: "Please fill in all booking fields." });
      }

      const db = readDatabase();
      const room = db.rooms.find(r => r.id === Number(body.roomId));
      const roomName = room ? room.name : body.roomName || "Standard Room";
      const roomPrice = room ? room.price : (body.price || 2500);

      const d1 = new Date(body.checkIn);
      const d2 = new Date(body.checkOut);
      const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      const totalPrice = nights * roomPrice;

      const bookingReference = (body.id && typeof body.id === "string" && body.id.trim())
        ? body.id.trim()
        : ("BK-" + Math.floor(100000 + Math.random() * 900000));

      const newBooking = {
        id: bookingReference,
        roomId: Number(body.roomId),
        roomName: roomName,
        guestName: body.guestName.trim(),
        guestEmail: body.guestEmail.trim().toLowerCase(),
        userId: (body.userId || body.guestEmail).trim().toLowerCase(),
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: Number(body.guests) || 2,
        nights: nights,
        totalPrice: totalPrice,
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      db.bookings.unshift(newBooking);
      writeDatabase(db);
      console.log(`✓ New booking created: ${bookingReference} for ${newBooking.guestName} (${roomName})`);

      return sendJson(res, 201, {
        message: "Booking confirmed successfully!",
        booking: newBooking
      });
    } catch (err) {
      return sendJson(res, 400, { message: "Invalid booking data" });
    }
  }

  // PATCH /api/bookings/:id/status - Update booking status (confirmed / cancelled)
  if ((req.method === "PATCH" || req.method === "PUT") && pathname.includes("/api/bookings/") && pathname.endsWith("/status")) {
    try {
      const parts = pathname.split("/");
      const bookingId = parts[3];
      const body = await parseBody(req);
      const db = readDatabase();
      const booking = db.bookings.find(b => b.id === bookingId);
      if (!booking) {
        return sendJson(res, 404, { message: "Booking not found." });
      }
      booking.status = body.status || "cancelled";
      writeDatabase(db);
      console.log(`✓ Booking ${bookingId} status updated to: ${booking.status}`);
      return sendJson(res, 200, { message: `Booking status updated to ${booking.status}`, booking });
    } catch (err) {
      return sendJson(res, 400, { message: "Error updating booking." });
    }
  }

  // =========================================================================
  // 3. REST API: /api/auth & /api/users (Login, Registration, Admin Users)
  // =========================================================================

  // GET /api/users - Retrieve all registered users for Admin panel
  if (req.method === "GET" && pathname === "/api/users") {
    const db = readDatabase();
    const safeUsers = (db.users || []).map(u => ({
      name: u.name,
      email: u.email,
      role: u.role || "customer"
    }));
    return sendJson(res, 200, safeUsers);
  }

  // POST /api/auth/register
  if (req.method === "POST" && pathname === "/api/auth/register") {
    try {
      const body = await parseBody(req);
      const { name, email, password, role } = body;
      if (!name || !email || !password) {
        return sendJson(res, 400, { message: "Name, email, and password are required." });
      }

      const db = readDatabase();
      const normalizedEmail = email.trim().toLowerCase();
      if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return sendJson(res, 409, { message: "An account with this email already exists." });
      }

      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: role === "admin" ? "admin" : "customer"
      };

      db.users.push(newUser);
      writeDatabase(db);
      console.log(`✓ New user registered: ${newUser.name} (${newUser.email})`);

      return sendJson(res, 201, { message: "Registration successful! You can now sign in.", user: { name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
      return sendJson(res, 400, { message: "Invalid registration data" });
    }
  }

  // POST /api/auth/login
  if (req.method === "POST" && pathname === "/api/auth/login") {
    try {
      const body = await parseBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return sendJson(res, 400, { message: "Email and password are required." });
      }

      const db = readDatabase();
      const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      if (!user) {
        return sendJson(res, 401, { message: "Invalid email or password." });
      }

      console.log(`✓ User logged in: ${user.name} (${user.role})`);
      return sendJson(res, 200, {
        message: "Login successful!",
        user: { name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      return sendJson(res, 400, { message: "Invalid login data" });
    }
  }

  // =========================================================================
  // 4. Static File Server (Serving index.html, CSS, JS, etc.)
  // =========================================================================
  let cleanRelPath = pathname.replace(/^[\/\\]+/, "").replace(/^[a-zA-Z]:[\\\/]/, "").replace(/\.\.[\/\\]/g, "");
  if (!cleanRelPath || cleanRelPath === "") {
    cleanRelPath = "index.html";
  }
  let filePath = path.join(__dirname, cleanRelPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`<h2>404 Not Found</h2><p>The requested file does not exist on HotelPro server.</p><p><a href="/">Return Home</a></p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`  ★ HOTELPRO BACKEND SERVER RUNNING ★`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Database File: ${DB_FILE}`);
  console.log(`  REST APIs: /api/rooms, /api/bookings, /api/auth`);
  console.log(`========================================================\n`);
});

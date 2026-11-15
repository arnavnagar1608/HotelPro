/* ==========================================================================
   HotelPro - Master Client Controller (Vanilla JavaScript)
   Connects to Backend REST API (server.js) & Database (database.json)
   With automatic fallback to localStorage if running standalone!
   ========================================================================== */

const API_BASE = "http://localhost:5000/api";

// --- 1. Master Data: 5 Hotel Rooms (Client Cache) ---
const DEFAULT_ROOMS = [
  {
    id: 1,
    name: "Deluxe King Room",
    price: 2800,
    description: "Spacious room featuring a plush king-sized bed, city skyline view, workstation, and marble ensuite bathroom.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    amenities: [
      "📶 High-Speed Wi-Fi",
      "💡 24/7 Power & Light Backup",
      "🅿️ Free On-Site Parking",
      "🍽️ Restaurants Nearby",
      "💧 24/7 Hot & Cold Water",
      "❄️ Air Conditioning"
    ]
  },
  {
    id: 2,
    name: "Executive Luxury Suite",
    price: 5500,
    description: "Opulent suite with a separate master bedroom, elegant living lounge, mini-bar, and panoramic city vistas.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    amenities: [
      "📶 Ultra-Fast 5G Wi-Fi",
      "💡 24/7 Power & Light Backup",
      "🅿️ Valet & Reserved Parking",
      "🍽️ In-House Dining & Cafes Nearby",
      "💧 24/7 RO & Hot Water",
      "❄️ Central Climate Control"
    ]
  },
  {
    id: 3,
    name: "Family Garden Haven",
    price: 4200,
    description: "Generously sized family room equipped with two queen beds, garden patio access, and kid-friendly amenities.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    amenities: [
      "📶 High-Speed Wi-Fi",
      "💡 24/7 Power & Light Backup",
      "🅿️ Spacious Family Parking",
      "🍽️ Family Restaurants Nearby",
      "💧 24/7 Hot & Purified Water",
      "🌿 Private Garden Patio"
    ]
  },
  {
    id: 4,
    name: "Ocean Vista Penthouse",
    price: 8500,
    description: "Top-floor penthouse with breathtaking ocean panorama, private jacuzzi terrace, and complimentary gourmet breakfast.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    amenities: [
      "📶 Ultra-Fast Wi-Fi",
      "💡 24/7 Power & Light Backup",
      "🅿️ Reserved VIP Parking",
      "🍽️ Rooftop Dining & Restaurants Nearby",
      "💧 Jacuzzi & 24/7 Hot Water",
      "❄️ Premium Climate Control"
    ]
  },
  {
    id: 5,
    name: "Cozy Studio Single",
    price: 1800,
    description: "Modern, streamlined room perfect for solo travelers and business professionals needing quiet comfort and fast Wi-Fi.",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    amenities: [
      "📶 High-Speed Wi-Fi",
      "💡 24/7 Power & Light Backup",
      "🅿️ Two-Wheeler & Car Parking",
      "🍽️ Food Joints & Cafes Nearby",
      "💧 24/7 Running Hot & Cold Water",
      "💻 Dedicated Work Desk"
    ]
  }
];

// --- 2. Master Data: 3 Property Locations ---
const PROPERTY_LOCATIONS = [
  {
    name: "Plot 97/4, Ganesh Nagar, Pardesipura",
    landmark: "Pardesipura Main Area",
    city: "Indore, Madhya Pradesh",
    mapQuery: "Plot 97/4, Ganesh Nagar, Pardesipura, Indore",
    link: "https://raj-pg-service.vercel.app/listings.html"
  },
  {
    name: "Plot 103/4, Ganesh Nagar, Pardesipura",
    landmark: "Ganesh Nagar Residential Hub",
    city: "Indore, Madhya Pradesh",
    mapQuery: "Plot 103/4, Ganesh Nagar, Pardesipura, Indore",
    link: "https://raj-pg-service.vercel.app/listings.html"
  },
  {
    name: "Plot 259, Lemon City",
    landmark: "Near Sri Aurobindo Hospital, Sanwer Road",
    city: "Indore, Madhya Pradesh",
    mapQuery: "Lemon City Near Aurobindo Hospital Indore",
    link: "https://raj-pg-service.vercel.app/listings.html"
  }
];

// --- 3. Database Initialization (Browser Storage) ---
function initDatabase() {
  if (!localStorage.getItem("hp_rooms")) {
    localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
  }
  if (!localStorage.getItem("hp_users")) {
    const seedUsers = [
      { name: "Hotel Admin", email: "admin@hotelpro.com", password: "adminpassword", role: "admin" },
      { name: "Rajat Yadav", email: "rajatyadav25009@gmail.com", password: "password123", role: "customer" }
    ];
    localStorage.setItem("hp_users", JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem("hp_bookings")) {
    const seedBookings = [
      {
        id: "BK-829103",
        roomId: 1,
        roomName: "Deluxe King Room",
        guestName: "Rajat Yadav",
        guestEmail: "rajatyadav25009@gmail.com",
        userId: "rajatyadav25009@gmail.com",
        checkIn: "2026-11-20",
        checkOut: "2026-11-22",
        guests: 2,
        nights: 2,
        totalPrice: 5600,
        status: "confirmed",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem("hp_bookings", JSON.stringify(seedBookings));
  }
}

// Helper: Get cached rooms from localStorage with fallback to DEFAULT_ROOMS
function getStoredRooms() {
  try {
    const raw = localStorage.getItem("hp_rooms");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading hp_rooms:", e);
  }
  return DEFAULT_ROOMS;
}

// Helper: Get cached bookings from localStorage
function getStoredBookings() {
  try {
    const raw = localStorage.getItem("hp_bookings");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Helper: Get cached users from localStorage
function getStoredUsers() {
  try {
    const raw = localStorage.getItem("hp_users");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Helper: Get today's date formatted as YYYY-MM-DD
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// --- 4. User Session Helpers ---
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("hp_active_user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("hp_active_user");
  window.location.href = "index.html";
}

function updateNavigation() {
  const user = getCurrentUser();
  const navAuthContainer = document.getElementById("navAuthContainer");
  if (!navAuthContainer) return;

  if (user) {
    navAuthContainer.innerHTML = `
      <div class="user-badge">
        <a href="my-bookings.html">My Bookings</a>
        ${user.role === "admin" ? '<a href="admin.html" style="color:var(--accent-gold);font-weight:700;">Admin</a>' : ''}
        <span style="color:#888;">Hi, ${user.name.split(" ")[0]}</span>
        <button class="logout-btn" onclick="logout()">Log out</button>
      </div>
    `;
  } else {
    navAuthContainer.innerHTML = `
      <a class="nav-button" href="login.html">Login / Register</a>
    `;
  }
}

// --- 5. Room Retrieval: Connects to Backend REST API with Local Fallback ---
let loadedRooms = DEFAULT_ROOMS;

async function fetchRooms() {
  // 1. Try Supabase Cloud Database first
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.from("rooms").select("*").order("room_id", { ascending: true });
      if (!error && data && data.length > 0) {
        loadedRooms = data.map(r => ({
          id: r.room_id || r.id,
          name: r.name,
          price: Number(r.price),
          description: r.description,
          image: r.image,
          amenities: Array.isArray(r.amenities) && r.amenities.length > 0 ? r.amenities : [
            "📶 High-Speed Wi-Fi",
            "💡 24/7 Power Backup",
            "🅿️ Free Parking",
            "🍽️ Restaurant Nearby",
            "💧 24/7 Hot Water",
            "❄️ Air Conditioning"
          ]
        }));
        localStorage.setItem("hp_rooms", JSON.stringify(loadedRooms));
        console.log("✓ Rooms loaded live from Supabase Cloud Database!");
        renderRooms(loadedRooms);
        return;
      }
    } catch (sbErr) {
      console.warn("Supabase rooms fetch error:", sbErr.message);
    }
  }

  // 2. Try Node.js Backend Server REST API
  try {
    const res = await fetch(`${API_BASE}/rooms`, { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        loadedRooms = data;
        localStorage.setItem("hp_rooms", JSON.stringify(data));
        console.log("✓ Rooms loaded live from backend database (database.json)");
      }
    }
  } catch (err) {
    console.log("Backend server offline, using local cached rooms:", err.message);
    try {
      loadedRooms = JSON.parse(localStorage.getItem("hp_rooms")) || DEFAULT_ROOMS;
    } catch {
      loadedRooms = DEFAULT_ROOMS;
    }
  }
  renderRooms(loadedRooms);
}

function renderRooms(rooms) {
  const container = document.getElementById("roomGrid");
  if (!container) return;

  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === "admin";

  container.innerHTML = rooms.map(room => {
    const amenities = room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0
      ? room.amenities
      : [
          "📶 High-Speed Wi-Fi",
          "💡 24/7 Power Backup",
          "🅿️ Free Parking",
          "🍽️ Restaurant Nearby",
          "💧 24/7 Hot Water",
          "❄️ Air Conditioning"
        ];

    return `
    <article class="room-card" id="room-${room.id}">
      <a href="room-details.html?id=${room.id}" style="display:block;cursor:pointer;">
        <img src="${room.image}" alt="${room.name}" loading="lazy">
      </a>
      <div class="room-details">
        <h3><a href="room-details.html?id=${room.id}" style="color:inherit;text-decoration:none;">${room.name}</a></h3>
        <p>${room.description}</p>
        
        <!-- Room Amenities -->
        <div class="room-amenities">
          ${amenities.map(a => `<span class="amenity-pill">${a}</span>`).join("")}
        </div>

        <div class="room-footer">
          <div>
            <strong>₹${Number(room.price).toLocaleString("en-IN")}</strong>
            <span> / night</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            ${isAdmin ? `
              <button type="button" class="action-btn-success" onclick="event.stopPropagation(); openHomeEditRoom(${room.id})" style="font-size:12px;padding:6px 10px;" title="Admin: Edit this room">✏️ Edit</button>
            ` : ''}
            <a href="room-details.html?id=${room.id}" class="book-btn" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
              Book Now →
            </a>
          </div>
        </div>
      </div>
    </article>
    `;
  }).join("");
}

// --- Admin Quick Edit from Home ---
function openHomeEditRoom(roomId) {
  const room = loadedRooms.find(r => r.id === roomId);
  if (!room) return;

  document.getElementById("homeEditRoomId").value = room.id;
  document.getElementById("homeEditRoomName").value = room.name;
  document.getElementById("homeEditRoomPrice").value = room.price;
  document.getElementById("homeEditRoomImage").value = room.image;
  document.getElementById("homeEditRoomDesc").value = room.description;
  document.getElementById("homeEditImagePreview").src = room.image;
  document.getElementById("homeEditModalTitle").textContent = `Edit Room: ${room.name}`;

  const amenitiesInput = document.getElementById("homeEditRoomAmenities");
  if (amenitiesInput) {
    amenitiesInput.value = (room.amenities || []).join(", ");
  }

  document.getElementById("homeEditRoomModal").classList.add("active");
}

function closeHomeEditModal() {
  const modal = document.getElementById("homeEditRoomModal");
  if (modal) modal.classList.remove("active");
}

async function handleSaveHomeEditRoom(e) {
  e.preventDefault();
  const id = Number(document.getElementById("homeEditRoomId").value);
  const name = document.getElementById("homeEditRoomName").value.trim();
  const price = Number(document.getElementById("homeEditRoomPrice").value);
  const image = document.getElementById("homeEditRoomImage").value.trim();
  const description = document.getElementById("homeEditRoomDesc").value.trim();

  let amenities = [
    "📶 High-Speed Wi-Fi",
    "💡 24/7 Power Backup",
    "🅿️ Free Parking",
    "🍽️ Restaurant Nearby",
    "💧 24/7 Hot Water"
  ];
  const amenitiesInput = document.getElementById("homeEditRoomAmenities");
  if (amenitiesInput && amenitiesInput.value.trim()) {
    amenities = amenitiesInput.value.split(",").map(s => s.trim()).filter(Boolean);
  }

  const updatedData = { name, price, image, description, amenities };

  // 1. Try Supabase Cloud Database first
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from("rooms").update({
        name, price, image, description, amenities
      }).eq("room_id", id);
      console.log("✓ Room updated live in Supabase Cloud PostgreSQL!");
    } catch (sbErr) {
      console.warn("Supabase room update error:", sbErr.message);
    }
  }

  // 2. Send update to Backend REST API (server.js & database.json)
  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    if (res.ok) {
      console.log("✓ Room updated in backend database.json");
    }
  } catch (err) {
    console.log("Server offline, saving locally...");
  }

  // 3. Sync locally
  const idx = loadedRooms.findIndex(r => r.id === id);
  if (idx !== -1) {
    loadedRooms[idx] = { ...loadedRooms[idx], ...updatedData };
    localStorage.setItem("hp_rooms", JSON.stringify(loadedRooms));
  }

  closeHomeEditModal();
  renderRooms(loadedRooms);
  alert(`Room "${name}" updated successfully!`);
}

// --- 6. Booking Modal & Calculations ---
let currentSelectedRoom = null;

function openBookingModal(roomIdOrRoom) {
  if (roomIdOrRoom && typeof roomIdOrRoom === "object" && roomIdOrRoom.name) {
    currentSelectedRoom = roomIdOrRoom;
  } else {
    const targetId = Number(roomIdOrRoom);
    const pool = (loadedRooms && loadedRooms.length > 0 ? loadedRooms : getStoredRooms());
    currentSelectedRoom = pool.find(r => Number(r.id) === targetId)
      || DEFAULT_ROOMS.find(r => Number(r.id) === targetId)
      || DEFAULT_ROOMS[0];
  }

  if (!currentSelectedRoom) return;

  const modal = document.getElementById("bookingOverlay");
  const modalTitle = document.getElementById("modalRoomTitle");
  const modalPrice = document.getElementById("modalRoomPrice");
  const checkInInput = document.getElementById("modalCheckIn");
  const checkOutInput = document.getElementById("modalCheckOut");
  const guestNameInput = document.getElementById("modalGuestName");
  const guestEmailInput = document.getElementById("modalGuestEmail");

  if (modalTitle) modalTitle.textContent = currentSelectedRoom.name;
  if (modalPrice) modalPrice.textContent = `₹${Number(currentSelectedRoom.price).toLocaleString("en-IN")} per night`;

  // Display included amenities in modal
  const modalAmenities = document.getElementById("modalRoomAmenities");
  if (modalAmenities) {
    const amenities = currentSelectedRoom.amenities && currentSelectedRoom.amenities.length > 0
      ? currentSelectedRoom.amenities
      : [
          "📶 High-Speed Wi-Fi",
          "💡 24/7 Power Backup",
          "🅿️ Free Parking",
          "🍽️ Restaurant Nearby",
          "💧 24/7 Hot Water",
          "❄️ Air Conditioning"
        ];
    modalAmenities.innerHTML = `
      <strong>Included Amenities & Facilities:</strong>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
        ${amenities.map(a => `<span class="amenity-pill">${a}</span>`).join("")}
      </div>
    `;
  }

  const today = getTodayString();
  if (checkInInput) checkInInput.min = today;
  if (checkOutInput) checkOutInput.min = today;

  // Pre-fill user details if logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (guestNameInput) guestNameInput.value = currentUser.name || "";
    if (guestEmailInput) guestEmailInput.value = currentUser.email || "";
  }

  // Pre-fill from top search bar if user selected dates
  const searchCheckIn = document.getElementById("searchCheckIn");
  const searchCheckOut = document.getElementById("searchCheckOut");
  const searchGuests = document.getElementById("searchGuests");

  if (searchCheckIn && searchCheckIn.value && checkInInput) checkInInput.value = searchCheckIn.value;
  if (searchCheckOut && searchCheckOut.value && checkOutInput) checkOutInput.value = searchCheckOut.value;
  if (searchGuests && document.getElementById("modalGuests")) document.getElementById("modalGuests").value = searchGuests.value;

  recalculateTotal();
  if (modal) modal.classList.add("active");
}

function closeBookingModal() {
  const modal = document.getElementById("bookingOverlay");
  if (modal) modal.classList.remove("active");
  currentSelectedRoom = null;
}

function recalculateTotal() {
  const checkInInput = document.getElementById("modalCheckIn");
  const checkOutInput = document.getElementById("modalCheckOut");
  const totalBox = document.getElementById("modalTotalBox");

  if (!checkInInput || !checkOutInput || !totalBox) return;

  const checkInVal = checkInInput.value;
  const checkOutVal = checkOutInput.value;

  if (!currentSelectedRoom || !checkInVal || !checkOutVal || checkOutVal <= checkInVal) {
    totalBox.innerHTML = "Select valid check-in and check-out dates to calculate total.";
    return;
  }

  const d1 = new Date(checkInVal);
  const d2 = new Date(checkOutVal);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

  if (nights > 0) {
    const total = nights * Number(currentSelectedRoom.price);
    totalBox.innerHTML = `<strong>${nights} night(s)</strong> · Total: <strong>₹${total.toLocaleString("en-IN")}</strong>`;
  }
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  if (!currentSelectedRoom) {
    alert("Please select a room to book.");
    return;
  }

  const checkInInput = document.getElementById("modalCheckIn");
  const checkOutInput = document.getElementById("modalCheckOut");
  const guestsInput = document.getElementById("modalGuests");
  const guestNameInput = document.getElementById("modalGuestName");
  const guestEmailInput = document.getElementById("modalGuestEmail");

  const checkIn = checkInInput ? checkInInput.value : "";
  const checkOut = checkOutInput ? checkOutInput.value : "";
  const guests = guestsInput ? guestsInput.value : "2";
  const guestName = guestNameInput ? guestNameInput.value.trim() : "";
  const guestEmail = guestEmailInput ? guestEmailInput.value.trim() : "";

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    alert("Please select a valid check-in and check-out date.");
    return;
  }

  if (!guestName || !guestEmail) {
    alert("Please provide guest full name and email.");
    return;
  }

  // Safely capture room details before any modal close or async state change
  const selectedRoomId = Number(currentSelectedRoom.id) || 1;
  const selectedRoomName = currentSelectedRoom.name || "Standard Room";
  const selectedRoomPrice = Number(currentSelectedRoom.price) || 2500;

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
  const totalPrice = nights * selectedRoomPrice;
  const currentUser = getCurrentUser();

  const bookingReference = "BK-" + Math.floor(100000 + Math.random() * 900000);

  const bookingPayload = {
    id: bookingReference,
    roomId: selectedRoomId,
    roomName: selectedRoomName,
    price: selectedRoomPrice,
    guestName: guestName,
    guestEmail: guestEmail,
    userId: currentUser ? currentUser.email : guestEmail,
    checkIn: checkIn,
    checkOut: checkOut,
    guests: Number(guests) || 2,
    nights: nights,
    totalPrice: totalPrice,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Booking...";
  }

  try {
    // 1. Try Supabase Cloud Database first
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { error: sbErr } = await sb.from("bookings").insert([{
          id: bookingReference,
          room_id: selectedRoomId,
          room_name: selectedRoomName,
          guest_name: guestName,
          guest_email: guestEmail,
          user_id: currentUser ? currentUser.email : guestEmail,
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(guests) || 2,
          nights: nights,
          total_price: totalPrice,
          status: "confirmed"
        }]);
        if (sbErr) {
          console.warn("Supabase booking insert warning:", sbErr.message);
        } else {
          console.log("✓ Booking saved directly into Supabase Cloud 'bookings' table!");
        }
      } catch (sbEx) {
        console.warn("Supabase booking exception:", sbEx.message);
      }
    }

    // 2. Send HTTP POST to Backend REST API (server.js & database.json)
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      if (res.ok) {
        console.log("✓ Booking saved directly into backend database.json!");
      }
    } catch (err) {
      console.log("Server offline, saving booking to browser storage fallback.");
    }

    // 3. Always sync to local storage immediately
    const bookings = getStoredBookings();
    bookings.unshift(bookingPayload);
    localStorage.setItem("hp_bookings", JSON.stringify(bookings));
    console.log("✓ Booking saved to localStorage!");

    // Close modal safely now
    closeBookingModal();

    const goToBookings = confirm(
      `✓ Booking Confirmed Successfully!\n\n` +
      `Reference Number: ${bookingReference}\n` +
      `Room: ${selectedRoomName}\n` +
      `Dates: ${checkIn} → ${checkOut} (${nights} night${nights > 1 ? 's' : ''})\n` +
      `Total Amount: ₹${totalPrice.toLocaleString("en-IN")}\n\n` +
      `Your reservation has been recorded in the database.\n\n` +
      `Click OK to view your reservation in 'My Bookings', or Cancel to stay on this page.`
    );

    if (goToBookings) {
      window.location.href = "my-bookings.html";
    }
  } catch (submitErr) {
    console.error("Booking error:", submitErr);
    alert("Could not complete booking: " + submitErr.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm & Book Room";
    }
  }
}

// --- 7. Interactive Google Maps Controller ---
function initMapLocations() {
  const container = document.getElementById("locationsList");
  if (!container) return;

  container.innerHTML = PROPERTY_LOCATIONS.map((loc, idx) => `
    <div class="location-card ${idx === 0 ? 'active-location' : ''}" onclick="selectLocation(${idx})" id="loc-card-${idx}">
      <div class="location-details">
        <span class="loc-pin">📍</span>
        <div>
          <strong>${loc.name}</strong>
          <p>${loc.landmark} · ${loc.city}</p>
        </div>
      </div>
      <a href="${loc.link}" target="_blank" rel="noopener noreferrer" class="loc-link-btn" onclick="event.stopPropagation()">
        View Listings ↗
      </a>
    </div>
  `).join("");

  updateMapIframe(PROPERTY_LOCATIONS[0].mapQuery);
}

function selectLocation(index) {
  const loc = PROPERTY_LOCATIONS[index];
  if (!loc) return;

  document.querySelectorAll(".location-card").forEach(el => el.classList.remove("active-location"));
  const activeEl = document.getElementById(`loc-card-${index}`);
  if (activeEl) activeEl.classList.add("active-location");

  updateMapIframe(loc.mapQuery);
}

function updateMapIframe(query) {
  const iframe = document.getElementById("gmapIframe");
  const label = document.getElementById("mapHeaderLabel");
  const gmapsLink = document.getElementById("openGmapsLink");

  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  if (label) {
    label.textContent = query;
  }
  if (gmapsLink) {
    gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
}

// --- 8. Interactive FAQ Accordion ---
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  if (!item) return;
  const wasActive = item.classList.contains("active");
  document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("active"));
  if (!wasActive) {
    item.classList.add("active");
  }
}

// --- 9. Page Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  updateNavigation();
  if (document.getElementById("roomGrid")) {
    fetchRooms();
  }
  if (document.getElementById("locationsList")) {
    initMapLocations();
  }

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    const today = getTodayString();
    const searchCheckIn = document.getElementById("searchCheckIn");
    const searchCheckOut = document.getElementById("searchCheckOut");
    if (searchCheckIn) searchCheckIn.min = today;
    if (searchCheckOut) searchCheckOut.min = today;

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const roomsSection = document.getElementById("rooms");
      if (roomsSection) roomsSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  const modalCheckIn = document.getElementById("modalCheckIn");
  const modalCheckOut = document.getElementById("modalCheckOut");
  if (modalCheckIn && modalCheckOut) {
    modalCheckIn.addEventListener("change", () => {
      modalCheckOut.min = modalCheckIn.value;
      recalculateTotal();
    });
    modalCheckOut.addEventListener("change", recalculateTotal);
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }
});

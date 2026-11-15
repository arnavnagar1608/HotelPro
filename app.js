/* ==========================================================================
   Room Rental - Master Client Controller (Vanilla JavaScript)
   Connects to Backend REST API (server.js) & Database (database.json)
   With automatic fallback to localStorage if running standalone!
   ========================================================================== */

const API_BASE = "http://localhost:5000/api";

// --- 1. Master Data: Active PG Rooms in Indore (Client Cache) ---
const DEFAULT_ROOMS = [
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
  const currentStored = localStorage.getItem("hp_rooms");
  // Automatically migrate from legacy mock rooms or deleted rooms (4, 7, 8) to active rooms
  if (!currentStored 
      || currentStored.includes("Deluxe King Room") 
      || currentStored.includes("svdzfg x") 
      || currentStored.includes("Budget Triple Room") 
      || currentStored.includes("Standard Triple Sharing") 
      || currentStored.includes("Economy Budget Room")) {
    localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
  } else {
    try {
      const parsed = JSON.parse(currentStored);
      if (!Array.isArray(parsed) || parsed.length !== 5) {
        localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
      }
    } catch {
      localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
    }
  }
  if (!localStorage.getItem("hp_users")) {
    const seedUsers = [
      { name: "Room Rental Admin", email: "admin@roomrental.com", password: "adminpassword", role: "admin" },
      { name: "Rajat Yadav", email: "rajatyadav25009@gmail.com", password: "password123", role: "customer" }
    ];
    localStorage.setItem("hp_users", JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem("hp_bookings")) {
    const seedBookings = [
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
      if (Array.isArray(parsed) && parsed.length === 5 && !parsed.some(r => [4, 7, 8].includes(Number(r.id)) || r.name === 'Deluxe King Room' || r.name === 'svdzfg x')) {
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

// Filter state
let activeFilters = {
  search: "",
  locations: [],
  maxPrice: 3500,
  types: [],
  amenities: [],
  minRating: 0,
  sortBy: "recommended",
  viewMode: "grid"
};

async function fetchRooms() {
  // 1. Try Supabase Cloud Database first
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.from("rooms").select("*").order("room_id", { ascending: true });
      if (!error && data) {
        // Detect if Supabase contains old mock rooms, deleted rooms (4, 7, 8), or differs from the 5 active rooms
        const hasLegacy = data.length !== 5 || data.some(r => 
          r.name === 'Deluxe King Room' || r.name === 'svdzfg x' || r.name === 'Executive Luxury Suite' || r.name === 'Ocean Vista Penthouse'
          || r.name === 'Budget Triple Room' || r.name === 'Standard Triple Sharing' || r.name === 'Economy Budget Room'
          || [4, 7, 8].includes(Number(r.room_id || r.id))
        );

        if (hasLegacy) {
          console.log("Supabase contains old/deleted rooms. Auto-updating Supabase to the 5 official PG rooms with real photos...");
          try {
            await sb.from("rooms").delete().neq("room_id", 0);
            const rowsToInsert = DEFAULT_ROOMS.map(r => ({
              room_id: Number(r.id),
              name: r.name,
              price: Number(r.price),
              description: r.description,
              image: r.image,
              amenities: r.amenities
            }));
            await sb.from("rooms").insert(rowsToInsert);
            console.log("✓ Successfully upgraded Supabase rooms table!");
          } catch (upgErr) {
            console.warn("Could not auto-write to Supabase:", upgErr.message);
          }
          loadedRooms = DEFAULT_ROOMS;
          localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
          applyRoomFilters();
          return;
        } else if (data.length === 5) {
          loadedRooms = data.map(r => ({
            id: r.room_id || r.id,
            name: r.name,
            price: Number(r.price),
            type: r.type || (Number(r.price) >= 3500 ? 'single' : (Number(r.price) >= 3000 ? 'double' : 'triple')),
            occupancy: r.occupancy || (r.name.includes("Single") ? "SINGLE OCC." : (r.name.includes("Double") ? "DOUBLE OCC." : "TRIPLE OCC.")),
            location: r.location || (r.name.includes("Aurobindo") || r.id === 5 || r.id === 6 ? "Near Aurobindo" : "Pardesipura"),
            rating: Number(r.rating) || 4.8,
            reviewsCount: Number(r.reviews_count || r.reviewsCount) || 12,
            description: r.description,
            image: r.image || "images/room-double-3.jpg",
            amenities: Array.isArray(r.amenities) && r.amenities.length > 0 ? r.amenities : [
              "Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping", "Electricity Included"
            ]
          }));
          localStorage.setItem("hp_rooms", JSON.stringify(loadedRooms));
          console.log("✓ Rooms loaded live from Supabase Cloud Database!");
          applyRoomFilters();
          return;
        }
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
      if (Array.isArray(data) && data.length === 5 && !data.some(r => [4, 7, 8].includes(Number(r.id)))) {
        loadedRooms = data;
        localStorage.setItem("hp_rooms", JSON.stringify(data));
        console.log("✓ Rooms loaded live from backend database (database.json)");
        applyRoomFilters();
        return;
      }
    }
  } catch (err) {
    console.log("Backend server offline, using local cached rooms:", err.message);
  }

  // 3. Fallback to DEFAULT_ROOMS
  let localData = null;
  try {
    localData = JSON.parse(localStorage.getItem("hp_rooms"));
  } catch {}

  if (localData && Array.isArray(localData) && localData.length === 5 && !localData.some(r => [4, 7, 8].includes(Number(r.id)))) {
    loadedRooms = localData;
  } else {
    loadedRooms = DEFAULT_ROOMS;
    localStorage.setItem("hp_rooms", JSON.stringify(DEFAULT_ROOMS));
  }
  applyRoomFilters();
}

function handlePriceSlider(val) {
  activeFilters.maxPrice = Number(val);
  const badge = document.getElementById("maxPriceBadge");
  if (badge) badge.textContent = `Up to ₹${Number(val).toLocaleString("en-IN")}`;
  applyRoomFilters();
}

function toggleTypeFilter(btn, type) {
  const idx = activeFilters.types.indexOf(type);
  if (idx > -1) {
    activeFilters.types.splice(idx, 1);
    btn.classList.remove("active-type");
  } else {
    activeFilters.types.push(type);
    btn.classList.add("active-type");
  }
  applyRoomFilters();
}

function setRatingFilter(btn, rating) {
  activeFilters.minRating = Number(rating);
  document.querySelectorAll(".rating-pill").forEach(el => el.classList.remove("active"));
  btn.classList.add("active");
  applyRoomFilters();
}

function setRoomViewMode(mode) {
  activeFilters.viewMode = mode;
  const gridBtn = document.getElementById("viewBtnGrid");
  const listBtn = document.getElementById("viewBtnList");
  const container = document.getElementById("roomGrid");
  if (gridBtn && listBtn) {
    if (mode === "grid") {
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
    } else {
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
    }
  }
  if (container) {
    container.className = mode === "list" ? "room-grid list-view" : "room-grid";
  }
}

function clearSearchInput() {
  const input = document.getElementById("roomSearchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  if (input) input.value = "";
  if (clearBtn) clearBtn.style.display = "none";
  activeFilters.search = "";
  applyRoomFilters();
}

function resetAllFilters() {
  activeFilters = {
    search: "",
    locations: [],
    maxPrice: 3500,
    types: [],
    amenities: [],
    minRating: 0,
    sortBy: "recommended",
    viewMode: activeFilters.viewMode || "grid"
  };

  const searchInput = document.getElementById("roomSearchInput");
  if (searchInput) searchInput.value = "";
  const clearBtn = document.getElementById("searchClearBtn");
  if (clearBtn) clearBtn.style.display = "none";

  document.querySelectorAll(".filter-location-cb").forEach(cb => cb.checked = false);
  
  const slider = document.getElementById("priceRangeSlider");
  if (slider) slider.value = 3500;
  const badge = document.getElementById("maxPriceBadge");
  if (badge) badge.textContent = "Up to ₹3,500";

  document.querySelectorAll(".type-filter-card").forEach(c => c.classList.remove("active-type"));
  document.querySelectorAll(".filter-amenity-cb").forEach(cb => cb.checked = false);
  
  document.querySelectorAll(".rating-pill").forEach((p, idx) => {
    if (idx === 0) p.classList.add("active");
    else p.classList.remove("active");
  });

  const sortSelect = document.getElementById("roomSortSelect");
  if (sortSelect) sortSelect.value = "recommended";

  applyRoomFilters();
}

function applyRoomFilters() {
  // Read search input
  const searchInput = document.getElementById("roomSearchInput");
  if (searchInput) {
    activeFilters.search = searchInput.value.trim().toLowerCase();
    const clearBtn = document.getElementById("searchClearBtn");
    if (clearBtn) clearBtn.style.display = activeFilters.search ? "block" : "none";
  }

  // Location checkboxes
  const locCbs = Array.from(document.querySelectorAll(".filter-location-cb:checked")).map(cb => cb.value);
  activeFilters.locations = locCbs;

  // Amenities checkboxes
  const amCbs = Array.from(document.querySelectorAll(".filter-amenity-cb:checked")).map(cb => cb.value);
  activeFilters.amenities = amCbs;

  // Sort
  const sortSelect = document.getElementById("roomSortSelect");
  if (sortSelect) activeFilters.sortBy = sortSelect.value;

  const sourceRooms = (loadedRooms && loadedRooms.length > 0) ? loadedRooms : DEFAULT_ROOMS;

  let filtered = sourceRooms.filter(room => {
    // 1. Search text
    if (activeFilters.search) {
      const q = activeFilters.search;
      const matchName = (room.name || "").toLowerCase().includes(q);
      const matchLoc = (room.location || "").toLowerCase().includes(q);
      const matchType = (room.type || "").toLowerCase().includes(q);
      const matchDesc = (room.description || "").toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchType && !matchDesc) return false;
    }

    // 2. Location
    if (activeFilters.locations.length > 0) {
      const loc = (room.location || "").toLowerCase();
      const match = activeFilters.locations.some(l => loc.includes(l.toLowerCase()));
      if (!match) return false;
    }

    // 3. Max Price
    if (Number(room.price) > activeFilters.maxPrice) {
      return false;
    }

    // 4. Room Type
    if (activeFilters.types.length > 0) {
      const rType = (room.type || "").toLowerCase();
      if (!activeFilters.types.includes(rType)) return false;
    }

    // 5. Amenities
    if (activeFilters.amenities.length > 0) {
      const roomAms = (room.amenities || []).map(a => a.toLowerCase());
      const hasAll = activeFilters.amenities.every(req => 
        roomAms.some(a => a.includes(req.toLowerCase()))
      );
      if (!hasAll) return false;
    }

    // 6. Min Rating
    const roomRating = Number(room.rating) || 4.5;
    if (roomRating < activeFilters.minRating) {
      return false;
    }

    return true;
  });

  // Sorting
  if (activeFilters.sortBy === "price-asc") {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (activeFilters.sortBy === "price-desc") {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (activeFilters.sortBy === "rating-desc") {
    filtered.sort((a, b) => (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5));
  }

  // Update room count text
  const countEl = document.getElementById("roomsCountText");
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} room${filtered.length === 1 ? '' : 's'} found`;
  }

  // Render rooms or empty state
  const noMatchBox = document.getElementById("noRoomsMatch");
  const container = document.getElementById("roomGrid");
  if (filtered.length === 0) {
    if (container) container.innerHTML = "";
    if (noMatchBox) noMatchBox.style.display = "block";
  } else {
    if (noMatchBox) noMatchBox.style.display = "none";
    renderRooms(filtered);
  }
}

function renderRooms(rooms) {
  const container = document.getElementById("roomGrid");
  if (!container) return;

  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === "admin";

  container.innerHTML = rooms.map(room => {
    const rawAmenities = room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0
      ? room.amenities
      : ["Wi-Fi", "CCTV", "RO Water", "Parking", "Housekeeping"];

    const cleanAmenities = rawAmenities.map(a => a.replace(/^[^\w\s]+/, '').trim());
    const displayPills = cleanAmenities.slice(0, 4);
    const extraCount = cleanAmenities.length - 4;

    return `
    <article class="room-card" id="room-${room.id}">
      <div class="room-card-media">
        <a href="room-details.html?id=${room.id}" style="display:block;">
          <img src="${room.image}" alt="${room.name}" loading="lazy" onerror="this.src='images/room-double-3.jpg'">
        </a>
        <div class="room-media-badges">
          <span class="badge-occupancy-pill">${room.occupancy || 'COMFORT OCC.'}</span>
          <span class="badge-available-pill">🟢 Available</span>
        </div>
      </div>
      <div class="room-details">
        <h3 class="room-card-title">
          <a href="room-details.html?id=${room.id}">${room.name}</a>
        </h3>
        <div class="room-card-location">
          <span class="loc-pin-icon">📍</span> ${room.location || 'Pardesipura'}
        </div>
        
        <div class="room-amenities-tags">
          ${displayPills.map(p => `<span class="room-amenity-tag">${p}</span>`).join("")}
          ${extraCount > 0 ? `<span class="room-amenity-tag extra">+${extraCount} more</span>` : ''}
        </div>

        <div class="room-card-footer">
          <div class="room-rating-info">
            <span class="stars-gold">⭐⭐⭐⭐⭐</span>
            <strong class="rating-num">${room.rating ? Number(room.rating).toFixed(1) : '4.8'}</strong>
            <span class="reviews-count">(${room.reviewsCount || 10} reviews)</span>
          </div>
          <div class="room-price-info">
            <strong>₹${Number(room.price).toLocaleString("en-IN")}</strong>
            <span class="price-cycle">/month</span>
          </div>
        </div>

        <div class="room-card-actions">
          ${isAdmin ? `
            <button type="button" class="action-btn-success" onclick="event.stopPropagation(); openHomeEditRoom(${room.id})" style="font-size:12px;padding:6px 10px;" title="Admin: Edit this room">✏️ Edit</button>
          ` : ''}
          <a href="room-details.html?id=${room.id}" class="btn-card-view">
            Book a Visit / View →
          </a>
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

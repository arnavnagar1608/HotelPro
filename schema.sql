-- =========================================================================
-- HotelPro - Supabase PostgreSQL Database Setup Script
-- =========================================================================
-- How to run this:
-- 1. Log in to your Supabase account: https://supabase.com
-- 2. Open your project -> Click "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire file, and click "RUN"
-- =========================================================================

-- 1. Create 'rooms' table
CREATE TABLE IF NOT EXISTS rooms (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  room_id INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  amenities TEXT[] DEFAULT ARRAY['📶 High-Speed Wi-Fi', '💡 24/7 Power Backup', '🅿️ Free Parking', '🍽️ Restaurant Nearby', '💧 24/7 Hot Water', '❄️ Air Conditioning'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'users' table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'bookings' table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  room_id INT NOT NULL,
  room_name TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  user_id TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT DEFAULT 2,
  nights INT DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) with full public access for your college demo
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for rooms" ON rooms;
CREATE POLICY "Public access for rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for users" ON users;
CREATE POLICY "Public access for users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for bookings" ON bookings;
CREATE POLICY "Public access for bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed initial 8 PG Rooms into Supabase
INSERT INTO rooms (room_id, name, price, description, image, amenities)
VALUES
  (1, 'Cozy Single Suite', 3500, 'Private furnished single room with dedicated work desk, high-speed Wi-Fi, wall storage racks, and complete privacy for students and working professionals.', 'images/room-doorway-2.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🅿️ Parking', '🧹 Housekeeping', '⚡ Electricity Included']),
  (2, 'Double Comfort Room', 3200, 'Spacious double-occupancy room ideal for two residents. Each resident gets their own bed and storage space. Well-ventilated with natural light.', 'images/room-double-3.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🧹 Housekeeping', '🪑 Furnished', '⚡ Electricity Included']),
  (3, 'Triple Sharing Room', 2800, 'Affordable triple sharing setup with individual storage racks, shared desk, regular housekeeping, and 24/7 water supply.', 'images/room-single-1.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🅿️ Parking', '🧹 Housekeeping', '🚰 Water Included']),
  (4, 'Budget Triple Room', 2500, 'Economical budget triple sharing room with clean surroundings, RO water, security cameras, and electricity included.', 'images/room-shelves.jpg', ARRAY['📹 CCTV', '💧 RO Water', '🧹 Housekeeping', '🪑 Furnished', '⚡ Electricity Included']),
  (5, 'Premium Single Room', 3500, 'Quiet and comfortable single room near Aurobindo Hospital / College, equipped with desk shelves, high-speed Wi-Fi, and 24/7 power backup.', 'images/room-study-4.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🅿️ Parking', '🧹 Housekeeping', '⚡ Electricity Included']),
  (6, 'Deluxe Double Occupancy', 3200, 'Bright and airy double room near Aurobindo campus, featuring individual beds, ceiling fan, storage racks, and daily maintenance.', 'images/room-double-5.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🅿️ Parking', '🧹 Housekeeping', '🪑 Furnished']),
  (7, 'Standard Triple Sharing', 2800, 'Standard triple room with spacious layout, tiled flooring, natural airflow, and proximity to coaching institutes & Pardesipura IT hub.', 'images/room-bed.jpg', ARRAY['📶 Wi-Fi', '📹 CCTV', '💧 RO Water', '🅿️ Parking', '🧹 Housekeeping', '🚰 Water Included']),
  (8, 'Economy Budget Room', 2500, 'Lowest cost budget accommodation near Aurobindo with essential utilities, clean drinking RO water, and safe CCTV premises.', 'images/room-balcony.jpg', ARRAY['📹 CCTV', '💧 RO Water', '🧹 Housekeeping', '🪑 Furnished', '⚡ Electricity Included'])
ON CONFLICT (room_id) DO NOTHING;

-- 6. Seed initial Admin & Customer accounts
INSERT INTO users (name, email, password, role)
VALUES
  ('Hotel Admin', 'admin@hotelpro.com', 'adminpassword', 'admin'),
  ('Rajat Yadav', 'rajatyadav25009@gmail.com', 'password123', 'customer')
ON CONFLICT (email) DO NOTHING;


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

-- 5. Seed initial 5 Hotel Rooms into Supabase
INSERT INTO rooms (room_id, name, price, description, image, amenities)
VALUES
  (1, 'Deluxe King Room', 2800, 'Spacious room featuring a plush king-sized bed, city skyline view, workstation, and marble ensuite bathroom.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', ARRAY['📶 High-Speed Wi-Fi', '💡 24/7 Power & Light Backup', '🅿️ Free On-Site Parking', '🍽️ Restaurants Nearby', '💧 24/7 Hot & Cold Water', '❄️ Air Conditioning']),
  (2, 'Executive Luxury Suite', 5500, 'Opulent suite with a separate master bedroom, elegant living lounge, mini-bar, and panoramic city vistas.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', ARRAY['📶 Ultra-Fast 5G Wi-Fi', '💡 24/7 Power & Light Backup', '🅿️ Valet & Reserved Parking', '🍽️ In-House Dining & Cafes Nearby', '💧 24/7 RO & Hot Water', '❄️ Central Climate Control']),
  (3, 'Family Garden Haven', 4200, 'Generously sized family room equipped with two queen beds, garden patio access, and kid-friendly amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', ARRAY['📶 High-Speed Wi-Fi', '💡 24/7 Power & Light Backup', '🅿️ Spacious Family Parking', '🍽️ Family Restaurants Nearby', '💧 24/7 Hot & Purified Water', '🌿 Private Garden Patio']),
  (4, 'Ocean Vista Penthouse', 8500, 'Top-floor penthouse with breathtaking ocean panorama, private jacuzzi terrace, and complimentary gourmet breakfast.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', ARRAY['📶 Ultra-Fast Wi-Fi', '💡 24/7 Power & Light Backup', '🅿️ Reserved VIP Parking', '🍽️ Rooftop Dining & Restaurants Nearby', '💧 Jacuzzi & 24/7 Hot Water', '❄️ Premium Climate Control']),
  (5, 'Cozy Studio Single', 1800, 'Modern, streamlined room perfect for solo travelers and business professionals needing quiet comfort and fast Wi-Fi.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', ARRAY['📶 High-Speed Wi-Fi', '💡 24/7 Power & Light Backup', '🅿️ Two-Wheeler & Car Parking', '🍽️ Food Joints & Cafes Nearby', '💧 24/7 Running Hot & Cold Water', '💻 Dedicated Work Desk'])
ON CONFLICT (room_id) DO NOTHING;

-- 6. Seed initial Admin & Customer accounts
INSERT INTO users (name, email, password, role)
VALUES
  ('Hotel Admin', 'admin@hotelpro.com', 'adminpassword', 'admin'),
  ('Rajat Yadav', 'rajatyadav25009@gmail.com', 'password123', 'customer')
ON CONFLICT (email) DO NOTHING;


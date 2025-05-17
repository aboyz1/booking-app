/*
  # Initial schema setup for transport booking system

  1. New Tables
    - stations
      - id (uuid, primary key)
      - name (text)
      - city (text)
      - address (text)
      - latitude (float)
      - longitude (float)
      - created_at (timestamp)
      - updated_at (timestamp)

    - buses
      - id (uuid, primary key)
      - code (text, unique)
      - type (text)
      - total_seats (integer)
      - luggage_capacity (float)
      - amenities (text[])
      - active (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - routes
      - id (uuid, primary key)
      - name (text)
      - origin_id (uuid, references stations)
      - destination_id (uuid, references stations)
      - distance (float)
      - duration (float)
      - created_at (timestamp)
      - updated_at (timestamp)

    - route_stops
      - id (uuid, primary key)
      - route_id (uuid, references routes)
      - station_id (uuid, references stations)
      - stop_order (integer)
      - created_at (timestamp)

    - route_buses
      - id (uuid, primary key)
      - route_id (uuid, references routes)
      - bus_id (uuid, references buses)
      - created_at (timestamp)

    - luggage_types
      - id (uuid, primary key)
      - name (text)
      - max_weight (float)
      - max_size (text)
      - additional_cost (float)
      - created_at (timestamp)
      - updated_at (timestamp)

    - bookings
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - route_id (uuid, references routes)
      - bus_id (uuid, references buses)
      - departure_date (date)
      - departure_time (time)
      - total_price (float)
      - status (text)
      - ticket_code (text)
      - created_at (timestamp)
      - updated_at (timestamp)

    - booking_seats
      - id (uuid, primary key)
      - booking_id (uuid, references bookings)
      - seat_number (text)
      - price (float)
      - created_at (timestamp)

    - booking_luggage
      - id (uuid, primary key)
      - booking_id (uuid, references bookings)
      - luggage_type_id (uuid, references luggage_types)
      - quantity (integer)
      - weight (float)
      - description (text)
      - image_url (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for staff/admin roles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stations table
CREATE TABLE stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stations ENABLE ROW LEVEL SECURITY;

-- Buses table
CREATE TABLE buses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('standard', 'luxury')),
  total_seats integer NOT NULL,
  luggage_capacity float NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

-- Routes table
CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  origin_id uuid REFERENCES stations NOT NULL,
  destination_id uuid REFERENCES stations NOT NULL,
  distance float NOT NULL,
  duration float NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Route stops table
CREATE TABLE route_stops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id uuid REFERENCES routes NOT NULL,
  station_id uuid REFERENCES stations NOT NULL,
  stop_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

-- Route buses table
CREATE TABLE route_buses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id uuid REFERENCES routes NOT NULL,
  bus_id uuid REFERENCES buses NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE route_buses ENABLE ROW LEVEL SECURITY;

-- Luggage types table
CREATE TABLE luggage_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  max_weight float NOT NULL,
  max_size text NOT NULL,
  additional_cost float NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE luggage_types ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  route_id uuid REFERENCES routes NOT NULL,
  bus_id uuid REFERENCES buses NOT NULL,
  departure_date date NOT NULL,
  departure_time time NOT NULL,
  total_price float NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  ticket_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Booking seats table
CREATE TABLE booking_seats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings NOT NULL,
  seat_number text NOT NULL,
  price float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_seats ENABLE ROW LEVEL SECURITY;

-- Booking luggage table
CREATE TABLE booking_luggage (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings NOT NULL,
  luggage_type_id uuid REFERENCES luggage_types NOT NULL,
  quantity integer NOT NULL,
  weight float,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_luggage ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Stations: Everyone can read, only staff/admin can modify
CREATE POLICY "Stations are viewable by everyone"
  ON stations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Stations are editable by staff and admin"
  ON stations FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Buses: Everyone can read, only staff/admin can modify
CREATE POLICY "Buses are viewable by everyone"
  ON buses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Buses are editable by staff and admin"
  ON buses FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Routes: Everyone can read, only staff/admin can modify
CREATE POLICY "Routes are viewable by everyone"
  ON routes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Routes are editable by staff and admin"
  ON routes FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Route stops: Everyone can read, only staff/admin can modify
CREATE POLICY "Route stops are viewable by everyone"
  ON route_stops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Route stops are editable by staff and admin"
  ON route_stops FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Route buses: Everyone can read, only staff/admin can modify
CREATE POLICY "Route buses are viewable by everyone"
  ON route_buses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Route buses are editable by staff and admin"
  ON route_buses FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Luggage types: Everyone can read, only staff/admin can modify
CREATE POLICY "Luggage types are viewable by everyone"
  ON luggage_types FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Luggage types are editable by staff and admin"
  ON luggage_types FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Bookings: Users can read their own bookings, staff/admin can read all
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('staff', 'admin'));

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('staff', 'admin'));

-- Booking seats: Same policies as bookings
CREATE POLICY "Users can view their own booking seats"
  ON booking_seats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND (bookings.user_id = auth.uid() OR auth.jwt() ->> 'role' IN ('staff', 'admin'))
    )
  );

CREATE POLICY "Users can create booking seats"
  ON booking_seats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Booking luggage: Same policies as bookings
CREATE POLICY "Users can view their own booking luggage"
  ON booking_luggage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND (bookings.user_id = auth.uid() OR auth.jwt() ->> 'role' IN ('staff', 'admin'))
    )
  );

CREATE POLICY "Users can create booking luggage"
  ON booking_luggage FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_stations_city ON stations(city);
CREATE INDEX idx_buses_code ON buses(code);
CREATE INDEX idx_routes_origin_destination ON routes(origin_id, destination_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_ticket_code ON bookings(ticket_code);
CREATE INDEX idx_booking_seats_booking ON booking_seats(booking_id);
CREATE INDEX idx_booking_luggage_booking ON booking_luggage(booking_id);
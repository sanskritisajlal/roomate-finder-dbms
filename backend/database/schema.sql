DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@vitstudent\.ac\.in$'),
  reg_no VARCHAR(20) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  gender VARCHAR(6) NOT NULL CHECK (gender IN ('male','female')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listings (
  listing_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  block VARCHAR(50) NOT NULL,
  room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('AC','NON-AC')),
  bed_count INT NOT NULL CHECK (bed_count IN (2,3,4,6)),
  roommates_remaining INT NOT NULL CHECK (roommates_remaining >= 0),
  cgpa_preference FLOAT,
  keywords TEXT,
  origin VARCHAR(100),
  gender VARCHAR(6) NOT NULL CHECK (gender IN ('male','female')),
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending','Completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, block)
);

CREATE TABLE requests (
  request_id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL REFERENCES listings(listing_id) ON DELETE CASCADE,
  requester_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending','Accepted','Rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (listing_id, requester_id)
);

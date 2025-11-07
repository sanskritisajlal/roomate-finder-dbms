import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// 🟩 SIGNUP
export const signup = async (req, res) => {
  const { first_name, last_name, email, reg_no, phone, gender, password } = req.body;

  try {
    // 1️⃣ Validate fields
    if (!/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/.test(email))
      return res.status(400).json({ message: "Invalid VIT email" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    // 2️⃣ Check if user exists
    const exists = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR reg_no=$2",
      [email, reg_no]
    );
    if (exists.rows.length)
      return res.status(409).json({ message: "User already exists. Please login." });

    // 3️⃣ Hash password
    const hash = await bcrypt.hash(password, 10);

    // 4️⃣ Insert into DB
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, reg_no, phone, gender, password_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [first_name, last_name, email, reg_no, phone, gender, hash]
    );

    res.status(201).json({ message: "Signup successful. Please login." });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed. Please try again." });
  }
};

// 🟦 LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];

    // 2️⃣ Compare password (bcrypt)
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ message: "Wrong password" });

    // 3️⃣ Generate token including reg_no
    const token = jwt.sign(
      {
        user_id: user.user_id,
        gender: user.gender,
        name: user.first_name,
        reg_number: user.reg_no, // ✅ correct DB field
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4️⃣ Return response
    res.status(200).json({
      message: "Login successful",
      token,
      name: user.first_name,
      reg_number: user.reg_no,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

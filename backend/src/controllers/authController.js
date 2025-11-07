import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const signup = async (req, res) => {
  const { first_name, last_name, email, reg_no, phone, gender, password } = req.body;
  try {
    if (!/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/.test(email))
      return res.status(400).json({ message: "Invalid VIT email" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be ≥ 8 characters" });

    const exists = await pool.query("SELECT * FROM users WHERE email=$1 OR reg_no=$2", [email, reg_no]);
    if (exists.rows.length)
      return res.status(409).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (first_name,last_name,email,reg_no,phone,gender,password_hash) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [first_name, last_name, email, reg_no, phone, gender, hash]
    );

    res.status(201).json({ message: "Signup successful. Please login." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!result.rows.length)
      return res.status(404).json({ message: "Account not found" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { user_id: user.user_id, name: user.first_name, gender: user.gender },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, name: user.first_name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "riffe_dev_jwt_secret";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1d";

// --- REGISTER ---
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Does user already exist?
    const checkUser = await query("SELECT * FROM users WHERE email = $1 OR username = $2", [
      email,
      username,
    ]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ error: "Username or Email already exists." });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Save to database
    const newUser = await query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, passwordHash]
    );

    // 5. Create a token (Auto-login)
    // Keep newUser.rows[0].id for registered user ID
    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = username OR email

  if (!identifier || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Find user (by email or username)
    const userResult = await query("SELECT * FROM users WHERE email = $1 OR username = $1", [
      identifier,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userResult.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Create JWT token
    // Keep user.id for logged in user ID
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    // Respond (excluding password)
    delete user.password_hash;

    res.json({
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

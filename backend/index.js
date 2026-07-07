const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const propertiesRouter = require("./routes/properties");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());        // allow the React dev server (port 3000) to call this API
app.use(express.json()); // parse JSON request bodies

// Health check: verifies the API is up AND the database is reachable.
app.get("/api/health", async (req, res) => {
  try {
    // A trivial query just to confirm the DB answers.
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    // DB unreachable -> 500 (server-side failure), but we respond
    // gracefully instead of letting the process crash.
    console.error("Health check failed:", err.message);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/properties", propertiesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

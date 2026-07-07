const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/properties
router.get("/", async (req, res) => {
  try {
    const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;

    let limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
    let offset = req.query.offset === undefined ? 0 : Number(req.query.offset);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
    }
    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ error: "offset must be an integer >= 0" });
    }

    const conditions = [];
    const values = [];

    if (city !== undefined) {
      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(city);
    }
    if (zipcode !== undefined) {
      conditions.push("L_Zip = ?");
      values.push(zipcode);
    }
    if (minPrice !== undefined) {
      const n = Number(minPrice);
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({ error: "minPrice must be a non-negative number" });
      }
      conditions.push("L_SystemPrice >= ?");
      values.push(n);
    }
    if (maxPrice !== undefined) {
      const n = Number(maxPrice);
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({ error: "maxPrice must be a non-negative number" });
      }
      conditions.push("L_SystemPrice <= ?");
      values.push(n);
    }
    if (beds !== undefined) {
      const n = Number(beds);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: "beds must be a non-negative integer" });
      }
      conditions.push("L_Keyword2 >= ?");
      values.push(n);
    }
    if (baths !== undefined) {
      const n = Number(baths);
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({ error: "baths must be a non-negative number" });
      }
      conditions.push("LM_Dec_3 >= ?");
      values.push(n);
    }

    const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

    const countSql = `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`;
    const [countRows] = await pool.query(countSql, values);
    const total = countRows[0].total;

    const dataSql = `
      SELECT
        L_ListingID, L_Address, L_City, L_State, L_Zip,
        L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
        L_Photos, LMD_MP_Latitude, LMD_MP_Longitude, YearBuilt
      FROM rets_property
      ${whereClause}
      ORDER BY L_ListingID
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataSql, [...values, limit, offset]);

    res.json({ total, limit, offset, results: rows });
  } catch (err) {
    console.error("GET /api/properties failed:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db");

// -------- GET /api/properties (Week 3) --------
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

// -------- Helper: validate a listing ID --------
function validateListingId(id) {
  if (typeof id !== "string" || id.length === 0 || id.length > 64) return false;
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return false;
  return true;
}

// -------- GET /api/properties/:id/openhouses (Week 4) --------
// Must be registered BEFORE /:id or Express matches "abc/openhouses" as :id.
router.get("/:id/openhouses", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateListingId(id)) {
      return res.status(400).json({ error: "invalid listing id" });
    }

    const [propRows] = await pool.query(
      "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );
    if (propRows.length === 0) {
      return res.status(404).json({ error: "property not found" });
    }

    const [ohRows] = await pool.query(
      `SELECT L_ListingID, OpenHouseDate, OH_StartTime, OH_EndTime, all_data
         FROM rets_openhouse
        WHERE L_ListingID = ?
        ORDER BY OpenHouseDate ASC, OH_StartTime ASC`,
      [id]
    );

    res.json(ohRows);
  } catch (err) {
    console.error(`GET /api/properties/${req.params.id}/openhouses failed:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------- GET /api/properties/:id (Week 4) --------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateListingId(id)) {
      return res.status(400).json({ error: "invalid listing id" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "property not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(`GET /api/properties/${req.params.id} failed:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (so Apps Script/frontend can access it)
app.use(cors());

// Logging
app.use(morgan("combined"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "PIB Proxy Server running" });
});

// Proxy route
app.get("/fetch", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url= parameter" });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const html = await response.text();
    res.set("Content-Type", "text/html; charset=UTF-8");
    res.send(html);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Failed to fetch content", details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ PIB Proxy running on http://localhost:${PORT}`);
});

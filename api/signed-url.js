// Vercel serverless function: returns a Cloudinary URL for a PUBLIC asset
// POST /api/signed-url  body: { "public_id": "premium/test-breath-2min", "format": "mp3" }

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-App-Key");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { public_id, format = "mp3" } = req.body || {};
    if (!public_id) return res.status(400).json({ error: "public_id required" });

    const url = cloudinary.url(public_id, {
      resource_type: "video", // audio via video pipeline
      type: "upload",         // correct for PUBLIC assets
      format
    });

    return res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

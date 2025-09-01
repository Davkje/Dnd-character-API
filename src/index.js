import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import charactersRouter from "./routes/characters.js";

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/", (req, res) => res.json({ ok: true, service: "ttrpg-api" }));

// Routes
app.use("/characters", charactersRouter);

// Global error handler (enkel)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Start
const { MONGODB_URI, PORT = 3000 } = process.env;
if (!MONGODB_URI) {
  console.error("Saknar MONGODB_URI i .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API på http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });

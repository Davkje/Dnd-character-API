import { Router } from "express";
import Character from "../models/Character.js";

const router = Router();

// GET /characters -> alla
router.get("/", async (req, res, next) => {
  try {
    const items = await Character.find().lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// GET /characters/:id -> en specifik
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Character.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// POST /characters -> skapa ny karaktär
router.post("/", async (req, res, next) => {
  try {
    const { name, class: cls, race, level, hp, speed, armourClass, abilities } = req.body;

    if (!name || !level || !cls || !race || hp == null || !speed || armourClass == null) {
      return res.status(400).json({ error: "Fält saknas: name, class, race, hp, speed, armourClass krävs" });
    }

    const newChar = new Character({
      name,
      class: cls,
      race,
      hp,
      level,
      speed,
      armourClass,
      abilities: abilities || {}
    });

    const saved = await newChar.save();
    res.status(201).json(saved);
  } catch (e) {
    next(e);
  }
});

// PATCH /characters/:id -> uppdatera karaktär
router.patch("/:id", async (req, res, next) => {
  try {
    const updates = req.body;

    // Uppdatera bara tillåtna fält
    const allowed = ["name", "class", "level", "race", "hp", "speed", "armourClass", "abilities"];
    const filteredUpdates = {};
    for (let key of allowed) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    const updated = await Character.findByIdAndUpdate(req.params.id, filteredUpdates, { new: true });
    if (!updated) return res.status(404).json({ error: "Karaktär hittades inte" });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /characters/:id -> ta bort karaktär
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Karaktär hittades inte" });

    res.json({ message: `Karaktär '${deleted.name}' raderad` });
  } catch (e) {
    next(e);
  }
});

export default router;

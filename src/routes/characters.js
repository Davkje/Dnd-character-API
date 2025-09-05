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
    let {
      name, class: cls, race, level, hp, speed, armourClass,
      abilities, hitDie, primaryMeleeAbility, primarySpellAbility,
      proficiencyBonus, proficientSkills, proficientSavingThrows,
      items, features, spells
    } = req.body;

    if (!name || !cls || !race || hp == null || speed == null || armourClass == null || !hitDie) {
      return res.status(400).json({
        error: "Fält saknas: name, class, race, hp, speed, armourClass, hitDie krävs"
      });
    }

    const characterData = {
      name,
      class: cls,
      race,
      level: level != null ? level : 1,
      hp,
      speed,
      armourClass,
      hitDie,
      primaryMeleeAbility: primaryMeleeAbility || null,
      primarySpellAbility: primarySpellAbility || null,
      abilities: abilities || {},
      proficiencyBonus: proficiencyBonus != null ? proficiencyBonus : 2,
      proficientSkills: proficientSkills || [],
      proficientSavingThrows: proficientSavingThrows || [],
      items: items || [],
      features: features || [],
      spells: spells || []
    };

    const newChar = new Character(characterData);
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

    const allowed = [
      "name", "class", "race", "level", "hp", "speed", "armourClass",
      "abilities", "hitDie", "primaryMeleeAbility", "primarySpellAbility",
      "proficiencyBonus", "proficientSkills", "proficientSavingThrows",
      "items", "features", "spells"
    ];

    const filteredUpdates = {};
    for (let key of allowed) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    const existing = await Character.findById(req.params.id).lean();
    if (!existing) return res.status(404).json({ error: "Karaktär hittades inte" });

    // Slå ihop arrays istället för att skriva över
    ["spells", "features", "items"].forEach(field => {
      if (filteredUpdates[field]) {
        filteredUpdates[field] = [
          ...(existing[field] || []),
          ...filteredUpdates[field]
        ];
      }
    });

    const updated = await Character.findByIdAndUpdate(
      req.params.id,
      filteredUpdates,
      { new: true }
    );
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

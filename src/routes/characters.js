import { Router } from "express";
import Character from "../models/Character.js";

const router = Router();

// Hjälpfunktion för att applicera default spells, features och items
function applyDefaults(characterData) {
  const defaultSpell = { name: "Firebolt", description: "Deal 1d10 fire damage at range" };
  const defaultFeature = { name: "New adventurer", description: "You can roll with advantage on your first roll" };
  const defaultItems = ["Rope", "Rations"];

  if (!Array.isArray(characterData.spells)) characterData.spells = [];
  if (!Array.isArray(characterData.features)) characterData.features = [];
  if (!Array.isArray(characterData.items)) characterData.items = [];

  // Lägg till default spell om den inte finns
  if (!characterData.spells.some(s => s.name === defaultSpell.name)) {
    characterData.spells.push(defaultSpell);
  }

  // Lägg till default feature om den inte finns
  if (!characterData.features.some(f => f.name === defaultFeature.name)) {
    characterData.features.push(defaultFeature);
  }

  // Lägg till default items som saknas
  for (let item of defaultItems) {
    if (!characterData.items.includes(item)) {
      characterData.items.push(item);
    }
  }

  return characterData;
}

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
      abilities, hitDie, primaryAbility, proficiencyBonus, proficientSkills,
      proficientSavingThrows, items, features, spells
    } = req.body;

    if (!name || !cls || !race || hp == null || speed == null || armourClass == null || !primaryAbility || !hitDie) {
      return res.status(400).json({ error: "Fält saknas: name, class, race, hp, speed, armourClass, hitDie, primaryAbility krävs" });
    }

    let characterData = {
      name,
      class: cls,
      race,
      level: level != null ? level : 1,
      hp,
      speed,
      armourClass,
      hitDie,
      primaryAbility,
      abilities: abilities || {},
      proficiencyBonus: proficiencyBonus != null ? proficiencyBonus : 2,
      proficientSkills: proficientSkills || [],
      proficientSavingThrows: proficientSavingThrows || [],
      items,
      features,
      spells
    };

    characterData = applyDefaults(characterData);

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

    // Endast tillåtna fält
    const allowed = [
      "name", "class", "race", "level", "hp", "speed", "armourClass",
      "abilities", "hitDie", "primaryAbility", "proficiencyBonus", "proficientSkills",
      "proficientSavingThrows", "items", "features", "spells"
    ];
    const filteredUpdates = {};
    for (let key of allowed) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    // Hämta befintlig karaktär
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

    // Applicera default-fält
    const updatesWithDefaults = applyDefaults(filteredUpdates);

    const updated = await Character.findByIdAndUpdate(
      req.params.id,
      updatesWithDefaults,
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
export { applyDefaults };

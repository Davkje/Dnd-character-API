import mongoose from "mongoose";
import dotenv from "dotenv";
import Character from "../src/models/Character.js";
import { applyDefaults } from "../src/routes/characters.js";

dotenv.config();

const characters = [
  {
    name: "Oobi",
    class: "Ranger",
    race: "Elf",
    level: 3,
    hp: 13,
    speed: 25,
    armourClass: 14,
    abilities: {
      strength: 10,
      dexterity: 18,
      intellect: 12,
      wisdom: 13,
      charisma: 14,
      constitution: 11
    },
    proficientSkills: ["stealth", "acrobatics"],
    proficientSavingThrows: ["dexterity", "intelligence"],
    items: ["Dagger", "Cloak"],
    features: [{ name: "Sneak Attack", description: "Extra damage once per turn" }],
    spells: []
  },
  {
    name: "Max",
    class: "Wizard",
    race: "Human",
    level: 3,
    hp: 28,
    speed: 30,
    armourClass: 12,
    abilities: {
      strength: 8,
      dexterity: 14,
      intellect: 18,
      wisdom: 15,
      charisma: 10,
      constitution: 12
    },
    proficientSkills: ["arcana", "history"],
    proficientSavingThrows: ["intellect", "wisdom"],
    items: ["Spellbook", "Wand"],
    features: [{ name: "Arcane Recovery", description: "Recover spell slots once per day" }],
    spells: [{ name: "Magic Missile", description: "Create 3 darts of magical force" }]
  },
  {
    name: "Klingan",
    class: "Barbarian",
    race: "Human",
    level: 2,
    hp: 18,
    speed: 30,
    armourClass: 16,
    abilities: {
      strength: 12,
      dexterity: 10,
      intellect: 14,
      wisdom: 16,
      charisma: 12,
      constitution: 14
    },
    proficientSkills: ["medicine", "religion"],
    proficientSavingThrows: ["wisdom", "charisma"],
    items: ["Mace", "Shield", "Holy Symbol"],
    features: [{ name: "Divine Domain", description: "Choose a domain to gain powers" }],
    spells: [{ name: "Cure Wounds", description: "Heal a creature you touch" }]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    await Character.deleteMany({});
    console.log("🗑️  Cleared old characters");

    // Lägg till default spells, features och items automatiskt
    const charactersWithDefaults = characters.map(c => applyDefaults(c));

    const created = await Character.insertMany(charactersWithDefaults);
    console.log(`🌱 Seeded ${created.length} characters`);

    mongoose.disconnect();
  } catch (e) {
    console.error(e);
    mongoose.disconnect();
  }
}

seed();

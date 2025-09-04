import mongoose from "mongoose";
import dotenv from "dotenv";
import Character from "../src/models/Character.js";
import { applyDefaults } from "../src/routes/characters.js";

dotenv.config();

const characters = [
  {
    name: "Oobi Doobi",
    class: "Ranger",
    race: "Elf",
    level: 3,
    hp: 24,
    speed: 30,
    armourClass: 14,
    abilities: {
      strength: 13,
      dexterity: 19,
      constitution: 13,
      intelligence: 12,
      wisdom: 13,
      charisma: 9
    },
    proficientSkills: ["stealth", "athletics", "persuasions", "perception", "investigation", "history"],
    proficientSavingThrows: ["dexterity", "strength"],
    items: ["Bow", "Cloak", "Sword"],
    features: [
      { name: "Favored Enemy", description: "You have advantage on Survival checks to track your favored enemies, as well as on INT checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all." },
      { name: "Figting Style", description: "You gain a +2 bonus to attack rolls you make with ranged weapons" }
    ],
    spells: [{ name: "Hunters Mark", description: "Extra damage on marked target" }]
  },
  {
    name: "Max",
    class: "Wizard",
    race: "Human",
    level: 2,
    hp: 14,
    speed: 30,
    armourClass: 11,
    abilities: {
      strength: 10,
      dexterity: 13,
      constitution: 13,
      intelligence: 17,
      wisdom: 14,
      charisma: 13
    },
    proficientSkills: ["animal handling", "arcana", "history", "survival"],
    proficientSavingThrows: ["intelligence", "wisdom"],
    items: ["Spellbook", "Wand"],
    features: [{ name: "Arcane Recovery", description: "Recover spell slots once per day" }],
    spells: [{ name: "Magic Missile", description: "Create 3 darts of magical force" }]
  },
  {
    name: "Klingan",
    class: "Barbarian",
    race: "Human",
    level: 3,
    hp: 29,
    speed: 30,
    armourClass: 15,
    abilities: {
      strength: 13,
      dexterity: 14,
      constitution: 16,
      intelligence: 12,
      wisdom: 9,
      charisma: 10
    },
    proficientSkills: ["athletics", "perception"],
    proficientSavingThrows: ["strength", "constitution"],
    items: ["Weapon Bag of Holding", "Shield", "Helmet"],
    features: [{
      name: "Rage", description: "As a bonus action enter a rage for up to 1 minute (10 rounds). You gain advantage on STR checks and saving throws(not attacks), + 2 melee damage with STR weapons, resistance to bludgeoning, piercing, slashing damage.You can't cast or concentrate on spells while raging. Your rage ends early if you are knocked unconscious or if your turn ends and you haven’t attacked a hostile creature since your last turn or taken damage since then.You can also end your rage as a bonus action."
    }],
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

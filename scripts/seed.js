import mongoose from "mongoose";
import dotenv from "dotenv";
import Character from "../src/models/Character.js";

dotenv.config();

const characters = [
  {
    name: "Oobi Doobi",
    class: "Ranger",
    race: "Elf",
    level: 3,
    hp: 24,
    hitDie: "d10",
    speed: 30,
    armourClass: 14,
    primaryMeleeAbility: "dexterity",
    primarySpellAbility: "wisdom",
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
    items: [
      { name: "Bow", description: "A simple longbow, range 150/600" },
      { name: "Cloak", description: "Hooded cloak for stealth and warmth" },
      { name: "Sword", description: "Steel sword for melee combat" }
    ],
    features: [
      { name: "Favored Enemy", description: "Advantage on Survival checks against favored enemies" },
      { name: "Fighting Style", description: "+2 bonus to attack rolls with ranged weapons" }
    ],
    spells: [
      { name: "Hunter's Mark", description: "Deal extra damage to marked target" }
    ]
  },
  {
    name: "Max",
    class: "Wizard",
    race: "Human",
    level: 2,
    hp: 14,
    hitDie: "d6",
    speed: 30,
    armourClass: 11,
    primaryMeleeAbility: "strength",
    primarySpellAbility: "intelligence",
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
    items: [
      { name: "Spellbook", description: "Contains all known spells" },
      { name: "Wand", description: "Focus for casting spells" }
    ],
    features: [
      { name: "Arcane Recovery", description: "Recover spell slots once per day" }
    ],
    spells: [
      { name: "Magic Missile", description: "Create 3 darts of magical force" }
    ]
  },
  {
    name: "Klingan",
    class: "Barbarian",
    race: "Human",
    level: 3,
    hp: 29,
    hitDie: "d12",
    speed: 30,
    armourClass: 15,
    primaryMeleeAbility: "strength",
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
    items: [
      { name: "Weapon Bag of Holding", description: "Stores weapons securely" },
      { name: "Shield", description: "Provides +2 to AC" },
      { name: "Helmet", description: "Protects your head" }
    ],
    features: [
      { name: "Rage", description: "Gain advantage on STR checks and saving throws, +2 melee damage, resistance to bludgeoning/piercing/slashing, cannot cast spells while raging" }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    await Character.deleteMany({});
    console.log("🗑️  Cleared old characters");

    const created = await Character.insertMany(characters);
    console.log(`🌱 Seeded ${created.length} characters`);

    mongoose.disconnect();
  } catch (e) {
    console.error(e);
    mongoose.disconnect();
  }
}

seed();

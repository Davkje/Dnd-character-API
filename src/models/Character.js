import mongoose from "mongoose";

const abilitiesSchema = new mongoose.Schema(
  {
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    intellect: { type: Number, default: 10 },
    wisdom: { type: Number, default: 10 },
    charisma: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 }
  },
  { _id: false }
);

const featureSpellSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    race: { type: String, required: true, trim: true },
    level: { type: Number, default: 1, min: 1 },       // ← ny rad
    hp: { type: Number, required: true, min: 0 },
    speed: { type: Number, required: true, min: 0 },
    armourClass: { type: Number, required: true, min: 0 },
    abilities: { type: abilitiesSchema, default: () => ({}) },
    proficiencyBonus: { type: Number, default: 2 },
    proficientSkills: { type: [String], default: [] },
    proficientSavingThrows: { type: [String], default: [] },
    items: { type: [String], default: ["Rope", "Food"] },
    features: {
      type: [featureSpellSchema],
      default: [{ name: "Adventurer", description: "Excited for adventure. You can re-roll one die per game." }]
    },
    spells: {
      type: [featureSpellSchema],
      default: [{ name: "Firebolt", description: "Deal 1d10 fire damage at range" }]
    }
  },
  { timestamps: true }
);


export default mongoose.model("Character", characterSchema);

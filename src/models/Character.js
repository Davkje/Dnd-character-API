import mongoose from "mongoose";

const abilitiesSchema = new mongoose.Schema(
  {
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    wisdom: { type: Number, default: 10 },
    charisma: { type: Number, default: 10 },
  },
  { _id: false }
);

const objectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String }
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    race: { type: String, required: true, trim: true },
    level: { type: Number, default: 1, min: 1 },
    hp: { type: Number, required: true, min: 0 },
    speed: { type: Number, required: true, min: 0 },
    armourClass: { type: Number, required: true, min: 0 },
    abilities: { type: abilitiesSchema, default: () => ({}) },
    primaryWeaponAbility: {
      type: String,
      enum: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      default: null,
      trim: true
    },
    primarySpellAbility: {
      type: String,
      enum: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      default: null,
      trim: true
    },
    hitDie: { type: String, required: true, trim: true },
    proficiencyBonus: { type: Number, default: 2 },
    proficientSkills: { type: [String], default: [] },
    proficientSavingThrows: { type: [String], default: [] },
    items: {
      type: [objectSchema],
      default: [{ name: "Rations", description: "Simple travel food" }]
    },
    features: { type: [objectSchema], default: [] },
    spells: { type: [objectSchema], default: [] },
  },
  { timestamps: true }
);


export default mongoose.model("Character", characterSchema);

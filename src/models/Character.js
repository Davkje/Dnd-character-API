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

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    race: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    level: { type: Number, required: true, trim: true },
    hp: { type: Number, required: true, min: 0 },
    armourClass: { type: Number, required: true, min: 0 },
    speed: { type: Number, required: true, min: 0 },
    abilities: { type: abilitiesSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model("Character", characterSchema);

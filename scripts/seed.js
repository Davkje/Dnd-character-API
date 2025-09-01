import "dotenv/config";
import mongoose from "mongoose";
import Character from "../src/models/Character.js";

const seed = [
  {
    name: "Tharion",
    class: "Fighter",
    race: "Elf",
    level: 1,
    hp: 16,
    armourClass: 16,
    speed: 30,
    abilities: { strength: 18, dexterity: 14, intellect: 10, wisdom: 12, charisma: 8, constitution: 15 }
  },
  {
    name: "Mira",
    class: "Wizard",
    race: "Halfling",
    level: 2,
    hp: 16,
    armourClass: 16,
    speed: 25,
    abilities: { strength: 8, dexterity: 12, intellect: 18, wisdom: 14, charisma: 11, constitution: 10 }
  }
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("Saknar MONGODB_URI");
  await mongoose.connect(process.env.MONGODB_URI);
  await Character.deleteMany({});
  await Character.insertMany(seed);
  console.log("✅ Seed klar");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

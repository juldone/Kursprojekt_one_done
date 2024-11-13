// characterCreation.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Character from "../data/character.js"; // Dein Character-Modell

dotenv.config();

export async function createCharacter(req, res) {
  try {
    const { accountId, name, level = 1, stats, equipment } = req.body;

    const defaultStats = {
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 5,
      ...stats,
    };

    const defaultEquipment = {
      armor: { head: null, chest: null, hands: null, legs: null },
      weapon: equipment?.weapon || null,
    };

    const uniqueCharacterID = uuidv4();

    const newCharacter = new Character({
      _id: uniqueCharacterID,
      accountId,
      name,
      level,
      stats: defaultStats,
      equipment: defaultEquipment,
    });

    const savedCharacter = await newCharacter.save();
    return res.status(201).json(savedCharacter);
  } catch (error) {
    console.error("Fehler beim Erstellen des Charakters:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Erstellen des Charakters" });
  }
}

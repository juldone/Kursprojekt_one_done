// characterCreation.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Character from "./character.js";

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

    const uniqueCharacterID = uuidv4(); // Erzeuge eine UUID für den Charakter

    const newCharacter = new Character({
      characterId: uniqueCharacterID,
      accountId,
      name,
      level,
      stats: defaultStats,
      equipment: defaultEquipment,
    });

    // Validierung des Charakters
    await newCharacter.validate();

    const savedCharacter = await newCharacter.save();
    return res.status(201).json(savedCharacter);
  } catch (error) {
    console.error("Fehler beim Erstellen des Charakters:", error); // Vollständiger Fehler wird hier geloggt
    return res.status(500).json({
      message: "Fehler beim Erstellen des Charakters",
      error: error.message,
    });
  }
}
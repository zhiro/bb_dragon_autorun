#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");
const STATS_FILE_PATH = path.join(__dirname, "data", "questStats.json");

export async function attemptQuest(gameId: string, adId: string): Promise<boolean> {
    try {
        if (!fs.existsSync(SAVE_FILE_PATH)) {
            throw new Error("saveFile.json not found! Start the game first.");
        }

        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));


        if (!gameId || !adId) {
            throw new Error("Game ID or Quest ID is missing!");
        }

        console.log(`Attempting to solve quest: ${adId} for Game ID: ${gameId}`);

        const response = await axios.post(`https://dragonsofmugloar.com/api/v2/${gameId}/solve/${adId}`);
        const result = response.data;

        console.log("Response from API:", result);

        saveData.lives = result.lives;
        saveData.gold = result.gold;
        saveData.score = result.score;
        if (result.score > saveData.highScore) {
            saveData.highScore = result.score;
        }
        saveData.turn = result.turn;

        fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(saveData, null, 2));

        // console.log(`Quest ${adId} completed. Save file updated.`);
        return result.success;

    } catch (error: any) {
        // pole hetkel hea kuna failiga suurendab totalit
        return false;

        // console.error("Error solving quest:", error.message);
    }
}

if (require.main === module) {
    const saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
    const gameId = saveData.gameId;

    const bestQuestId = process.argv[2];
    if (!bestQuestId) {
        console.error("Please provide a quest ID.");
        process.exit(1);
    }

    attemptQuest(gameId, bestQuestId);
}

#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const SAVE_FILE_PATH = path.join(__dirname, "../data", "saveFile.json");

export async function attemptQuest(gameId: string, adId: string): Promise<boolean> {
    try {
        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));

        console.log(`Attempting to solve quest: ${adId}`);
        const response = await axios.post(`https://dragonsofmugloar.com/api/v2/${gameId}/solve/${adId}`);
        const result = response.data;

        console.log(result);

        saveData.lives = result.lives;
        saveData.gold = result.gold;
        saveData.score = result.score;
        if (result.score > saveData.highScore) {
            saveData.highScore = result.score;
        }
        saveData.turn = result.turn;

        fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(saveData, null, 2));

        return result.success;

    } catch (error: any) {
        console.error("Error solving quest:", error.message);
        return false;
    }
}
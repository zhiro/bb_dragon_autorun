#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const SAVE_FILE_PATH = path.join(__dirname, "../data", "saveFile.json");

export async function buyItemFromShop(gameId: string, itemId: string) {
    try {
        if (!fs.existsSync(SAVE_FILE_PATH)) {
            throw new Error("saveFile.json not found! Start the game first.");
        }

        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));


        const response = await axios.post(`https://dragonsofmugloar.com/api/v2/${gameId}/shop/buy/${itemId}`);
        const result = response.data;

        console.log(`Buying ${itemId}\n`, result);

        saveData.gold = result.gold;
        saveData.lives = result.lives;
        saveData.level = result.level;
        saveData.turn = result.turn;

        fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(saveData, null, 2));

    } catch (error: any) {
        console.error("Error buying items:", error.message);
    }
}


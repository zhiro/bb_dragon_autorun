#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const API_URL = "https://dragonsofmugloar.com/api/v2/game/start";
const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");


export async function startNewGame() {
    try {
        console.log("Starting the game...");

        const response = await axios.post(API_URL);
        const gameData = response.data;

        let previousHighScore = 0;
        if (fs.existsSync(SAVE_FILE_PATH)) {
            const existingData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
            previousHighScore = Math.max(existingData.highScore || 0, gameData.highScore || 0);
        }

        gameData.highScore = previousHighScore;

        console.log(JSON.stringify(gameData, null, 2));
        fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(gameData, null, 2));


    } catch (error: any) {
        console.error("Error starting the game:", error.message);
    }
}
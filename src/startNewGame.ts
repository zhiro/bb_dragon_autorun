#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const API_URL = "https://dragonsofmugloar.com/api/v2/game/start";
const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");


async function startNewGame() {
    try {
        console.log("Starting the game...");

        const response = await axios.post(API_URL);
        const gameData = response.data;

        console.log("Response from API:");
        console.log(JSON.stringify(gameData, null, 2));
        fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(gameData, null, 2));


    } catch (error: any) {
        console.error("Error starting the game:", error.message);
    }
}

startNewGame();

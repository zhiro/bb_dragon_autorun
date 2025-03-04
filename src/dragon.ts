import fs from "fs";
import path from "path";
import {startNewGame} from "./startNewGame";
import {findAndAttemptBestQuest} from "./questing/findAndAttemptBestQuest";

const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");

export async function runGame() {
    try {
        await startNewGame();

        if (!fs.existsSync(SAVE_FILE_PATH)) {
            throw new Error("saveFile.json not found! Re-start the game.");
        }

        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
        const gameId = saveData.gameId;

        let turnCounter = 0;

        if (!gameId) {
            throw new Error("Game ID not found in saveFile.json");
        }

        while (saveData.lives > 0) {

            turnCounter = await findAndAttemptBestQuest(gameId, turnCounter, saveData.gold, saveData.lives);

            saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));

            if (saveData.lives <= 0) {
                console.log("\n You have died. Try again!");
                console.log("\n Final stats:");
                console.log(JSON.stringify(saveData, null, 2));
                break;
            }
            console.log("########################################################################");
        }

    } catch (error) {
        console.error("Error running game:", error);
    }
}

runGame();
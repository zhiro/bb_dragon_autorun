import {fetchQuestList} from "./questList";
import {getBestQuest} from "./questFinder";
import {attemptQuest} from "./attemptQuest";
import {updateQuestStats} from "./updateQuestStats";
import fs from "fs";
import path from "path";

const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");

async function runGame() {
    try {
        if (!fs.existsSync(SAVE_FILE_PATH)) {
            throw new Error("saveFile.json not found! Start the game first.");
        }

        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
        const gameId = saveData.gameId;

        if (!gameId) {
            throw new Error("Game ID not found in saveFile.json");
        }

        if (saveData.lives == 0) {
            throw new Error("You have died. Try Again!");
        }

        while (saveData.lives > 0) {


            const questList = await fetchQuestList(gameId);

            if (questList.length === 0) {
                console.log("No quests available.");
                break;
            }

            const bestQuestId = getBestQuest(questList);
            if (!bestQuestId) {
                console.log("No suitable quest found.");
                break;
            }

            const bestQuest = questList.find(quest => quest.adId === bestQuestId);
            console.log(JSON.stringify(bestQuest, null, 2));


            const success = await attemptQuest(gameId, bestQuestId);

            await updateQuestStats(bestQuest.probability, success);

            saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));

            if (saveData.lives <= 0) {
                console.log("\n💀 You have died. Try again.!");
                break;
            }

        }

        // lisa poes vaatamine
        // lisa poest ostmine
        // returni questScore ja võrdle selle vastu kas on mõtet korda oodata
        // lisa puhkamine, et oodata paremaid queste


    } catch (error) {
        console.error("Error running game:", error);
    }
}

runGame();
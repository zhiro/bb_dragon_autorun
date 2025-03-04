import fs from "fs";
import path from "path";
import {fetchQuestList} from "./questing/fetchQuestList";
import {findAndAttemptBestQuest} from "./questing/findAndAttemptBestQuest";
import {attemptQuest} from "./questing/attemptQuest";
import {updateQuestStats} from "./questing/updateQuestStats";
import {startNewGame} from "./startNewGame";
import {getShopInventory} from "./shopping/viewShop";
import {buyItemFromShop} from "./shopping/buyItemFromShop";
import {restForATurn} from "./restForATurn";


const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");
const restDayLimit = 10;

export async function runGame() {
    try {

        await startNewGame();

        if (!fs.existsSync(SAVE_FILE_PATH)) {
            throw new Error("saveFile.json not found! Start the game first.");
        }

        let saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
        const gameId = saveData.gameId;

        let turnCounter = 0;

        if (!gameId) {
            throw new Error("Game ID not found in saveFile.json");
        }

        // If inventory changed after buying then would move within the loop
        const storeInventory = await getShopInventory(gameId);


        while (saveData.lives > 0) {

            turnCounter = await findAndAttemptBestQuest(gameId, turnCounter, saveData.gold);

            saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));

            if (saveData.lives <= 0) {
                console.log("\n You have died. Try again!");
                console.log("\n Final stats:");
                console.log(JSON.stringify(saveData, null, 2));
                break;
            }

            if (saveData.lives <= 1 && saveData.gold >= 50) {
                // make a func to check for healing pot availablilty
                // parse it from name "Healing potion" to get cost and id
                await buyItemFromShop(gameId, "hpot")
                turnCounter++;
            // } else if (saveData.gold >= 300) {
            //     await buyItemFromShop(gameId, "iron")
            //     turnCounter++;
            // } else if (saveData.gold >= 100) {
            //     await buyItemFromShop(gameId, "gas")
            //     turnCounter++;
            }
            console.log("########################################################################");
        }

        // lisa poes vaatamine
        // lisa poest ostmine
        // returni questScore ja võrdle selle vastu kas on mõtet korda oodata


    } catch (error) {
        console.error("Error running game:", error);
    }
}

runGame();
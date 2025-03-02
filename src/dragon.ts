import fs from "fs";
import path from "path";
import {fetchQuestList} from "./questing/fetchQuestList";
import {findBestQuest} from "./questing/findBestQuest";
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

        let restDayCounter = 0;

        if (!gameId) {
            throw new Error("Game ID not found in saveFile.json");
        }

        // If inventory changed after buying then would move within the loop
        const storeInventory = await getShopInventory(gameId);


        while (saveData.lives > 0) {

            const questList = await fetchQuestList(gameId);

            if (questList.length === 0) {
                console.log("No quests available.");
                break;
            }

            const bestQuestId = await findBestQuest(questList);
            if (!bestQuestId) {
                console.log("No suitable quest found.");
                break;
            }

            if (bestQuestId == "restForADay" && restDayCounter < restDayLimit) {
                await restForATurn(gameId);
                restDayCounter += 1;
            } else {

                // Only here to get probability name to update the stats - move this inside attemptQuest?
                const bestQuest = questList.find(quest => quest.adId === bestQuestId);
                console.log(JSON.stringify(bestQuest, null, 2));


                const success = await attemptQuest(gameId, bestQuestId);
                await updateQuestStats(bestQuest.probability, success);


                saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));

                if (saveData.lives <= 0) {
                    console.log("\n You have died. Try again!");
                    console.log(JSON.stringify(saveData, null, 2));
                    break;
                }
            }

            if (saveData.lives <= 1 && saveData.gold >= 50) {
                // make a func to check for healing pot availablilty
                // parse it from name "Healing potion" to get cost and id

                await buyItemFromShop(gameId, "hpot")
            } else if (saveData.gold >= 300) {
                await buyItemFromShop(gameId, "iron")
            } else if (saveData.gold >= 100) {
                await buyItemFromShop(gameId, "ch")
            }

            console.log("----------------------------------------------------------");
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
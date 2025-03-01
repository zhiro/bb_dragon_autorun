#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

const SAVE_FILE_PATH = path.join(__dirname, "data", "saveFile.json");

export async function fetchQuestList(gameId : string ) : Promise<any[]> {
    try {
        console.log(`Fetching quests for Game ID: ${gameId}...`);

        const response = await axios.get(`https://dragonsofmugloar.com/api/v2/${gameId}/messages`);
        const questList = response.data;

        // console.log(JSON.stringify(questList, null, 2));

        return questList;

    } catch (error: any) {
        console.error("Error fetching quests:", error.message);
        return [];
    }
}

if (require.main === module) {
    const saveData = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, "utf-8"));
    const gameId = saveData.gameId;

    fetchQuestList(gameId);
}

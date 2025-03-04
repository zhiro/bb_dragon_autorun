#!/usr/bin/env node

import axios from "axios";

export async function fetchQuestList(gameId : string ) : Promise<any[]> {
    try {
        console.log(`Fetching quests for Game ID: ${gameId}`);

        const response = await axios.get(`https://dragonsofmugloar.com/api/v2/${gameId}/messages`);

        return response.data;

    } catch (error: any) {
        console.error("Error fetching quests:", error.message);
        return [];
    }
}
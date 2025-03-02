#!/usr/bin/env node

import axios from "axios";

export async function checkReputation(gameId : string ) : Promise<any[]> {
    try {
        console.log(`Checking reputation for Game ID: ${gameId}...`);

        const response = await axios.get(`https://dragonsofmugloar.com/api/v2/${gameId}/investigate/reputation`);
        return response.data;

    } catch (error: any) {
        console.error("Error checking reputation:", error.message);
        return [];
    }
}


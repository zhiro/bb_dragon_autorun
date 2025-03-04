#!/usr/bin/env node

import axios from "axios";
import fs from "fs";
import path from "path";

export async function getShopInventory(gameId : string ) : Promise<any[]> {
    try {
        console.log("--------------------------------------------------");
        console.log(`Checking store inventory for Game ID: ${gameId}...`);

        const response = await axios.get(`https://dragonsofmugloar.com/api/v2/${gameId}/shop`);
        return response.data;

    } catch (error: any) {
        console.error("Error fetching inventory:", error.message);
        return [];
    }
}


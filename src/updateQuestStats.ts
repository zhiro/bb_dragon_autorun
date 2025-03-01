#!/usr/bin/env node

import fs from "fs";
import path from "path";

const STATS_FILE_PATH = path.join(__dirname, "data", "questStats.json");

export async function updateQuestStats(probability: string, success: boolean) {
    try {

        if (!fs.existsSync(STATS_FILE_PATH)) {
            fs.writeFileSync(STATS_FILE_PATH, JSON.stringify({}, null, 2));
        }

        let rawData = fs.readFileSync(STATS_FILE_PATH, "utf-8");
        let questStats = rawData ? JSON.parse(rawData) : {};

        if (!questStats[probability]) {
            questStats[probability] = { succeed: 0, total: 0, risk: 1 };
        }

        questStats[probability].total += 1;
        if (success) {
            questStats[probability].succeed += 1;
        }

        // try out more difficult ones to get some stats going for them before fully skipping them
        if (questStats[probability].total >= 100) {
            questStats[probability].risk = Number(
                (questStats[probability].succeed / questStats[probability].total).toFixed(2)
            );
        }

        fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(questStats, null, 2));

        console.log(`Updated quest stats:`, questStats[probability]);
    } catch (error) {
        console.error("Error updating quest stats:", error);
    }
}
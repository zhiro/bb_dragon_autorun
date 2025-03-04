import fs from "fs";
import path from "path";

const STATS_FILE_PATH = path.join(__dirname, "../data", "questStats.json");

export function getQuestDifficulty(risk: string): number {
    try {
        const difficultyMap = JSON.parse(fs.readFileSync(STATS_FILE_PATH, "utf-8"));

        return difficultyMap[risk] ? difficultyMap[risk].risk : 1;
    } catch (error) {
        console.error("Error reading difficulty file or finding risk value:", error);

        return 1;
    }
}

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


// const difficultyMap: { [key: string]: number } = {
//     "walk in the park": 0.9,
//     "piece of cake": 0.9,
//     "sure thing": 0.75,
//     "quite likely": 0.7,
//     "risky": 0.5,
//     "gamble": 0.5,
//     "playing with fire": 0.4,
//     "rather detrimental": 0.3,
//     "hmmm....": 0.1,
//     "suicide mission": 0.01,
// };

import { getQuestDifficulty } from "./getQuestDifficulty";
import {attemptQuest} from "./attemptQuest";
import {updateQuestStats} from "./updateQuestStats";
import {restForATurn} from "../restForATurn";


export async function findAndAttemptBestQuest(gameId : string, quests: any[], skippedTurns: number) : Promise<number> {
    try {
        if (!Array.isArray(quests) || quests.length === 0) {
            throw new Error("Invalid or empty quest data.");
        }

        let bestQuestId = "";
        let bestQuestDifficultyModifier = 0;
        let bestQuestProbability = "";
        let highestQuestScore = -Infinity;

        for (const quest of quests) {
            if (quest.encrypted == null) {
                if (quest.message.startsWith("Steal super awesome diamond")) {
                    continue;
                }

                if (quest.reward && quest.expiresIn) {
                    const difficulty = getQuestDifficulty(quest.probability);

                    const safetyBoost = difficulty >= 0.8 ? 2 : 1;
                    const penalty = (1 - difficulty) * 0.5;

                    const expirationWeight = 1 + (quest.expiresIn - 1) * 0.1;

                    const questScore = (quest.reward * difficulty * safetyBoost) / (expirationWeight + penalty);

                    console.log(`risk:${String(difficulty).padEnd(4)}|score:${String(questScore.toFixed(2)).padEnd(5)}|${quest.adId}`);

                    if (questScore > highestQuestScore) {
                        highestQuestScore = questScore;
                        bestQuestId = quest.adId;
                        bestQuestDifficultyModifier = difficulty;
                        bestQuestProbability = quest.probability;
                    }
                }
            }
        }

        console.log(`Best quest found: ${bestQuestId} (Ratio: ${highestQuestScore.toFixed(2)}) - (diff: ${bestQuestDifficultyModifier})`);

        if (bestQuestDifficultyModifier <= 0.5 && skippedTurns < 10) {
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            console.log(`No good quests. Resting turn ${skippedTurns + 1}/10...`);
            await restForATurn(gameId);
            return skippedTurns + 1;
        }

        const success = await attemptQuest(gameId, bestQuestId);
        // await updateQuestStats(bestQuestProbability, success);

        return 0;

    } catch (error: any) {
        console.error("Error parsing quests:", error.message);
        return 0;
    }




}

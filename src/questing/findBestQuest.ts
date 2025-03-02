import { getQuestDifficulty } from "./getQuestDifficulty";


export async function findBestQuest(quests: any[]): Promise<string | null> {
    try {
        if (!Array.isArray(quests) || quests.length === 0) {
            throw new Error("Invalid or empty quest data.");
        }

        let bestQuestId = null;
        let bestQuestDifficultyModifier = null;
        let highestQuestScore = -Infinity;

        for (const quest of quests) {
            if (quest.encrypted == null) {
                if (quest.message.startsWith("Steal super awesome diamond")) {
                    continue;
                }

                if (quest.reward && quest.expiresIn) {
                    const difficulty = getQuestDifficulty(quest.probability);

                    const safetyBoost = difficulty >= 0.7 ? 2 : 1;
                    const penalty = (1 - difficulty) * 0.5;

                    const expirationWeight = 1 + (quest.expiresIn - 1) * 0.1;

                    const questScore = (quest.reward * difficulty * safetyBoost) / (expirationWeight + penalty);

                    console.log(`|risk:${String(difficulty).padEnd(4)}|score:${String(questScore.toFixed(2)).padEnd(5)}|${quest.adId}`);

                    if (questScore > highestQuestScore) {
                        highestQuestScore = questScore;
                        bestQuestId = quest.adId;
                        bestQuestDifficultyModifier = quest.difficulty;
                    }
                }
            }
        }

        if (bestQuestDifficultyModifier <= 0.5) {
            bestQuestId = "restForADay";
        }

        if (!bestQuestId) {
            throw new Error("No valid quest found with reward and expiration values.");
            // if no good quest is found then wait 1 turn? Add counter to wait up to 10 turns?
        }

        console.log(`Best quest found: ${bestQuestId} (Ratio: ${highestQuestScore.toFixed(2)})`);
        return bestQuestId;
    } catch (error: any) {
        console.error("Error parsing quests:", error.message);
        return null;
    }
}

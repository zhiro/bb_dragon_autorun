import { getQuestDifficulty } from "./getQuestDifficulty";


export function getBestQuest(quests: any[]): string | null {
    try {
        if (!Array.isArray(quests) || quests.length === 0) {
            throw new Error("Invalid or empty quest data.");
        }

        let bestQuestId = null;
        let highestQuestScore = -Infinity;

        const difficultyModifier = 5;

        for (const quest of quests) {
            if (quest.encrypted !== 1) {
                if (quest.reward && quest.expiresIn) {
                    const difficulty = getQuestDifficulty(quest.probability);

                    const safetyBoost = difficulty >= 0.7 ? 2 : 1;

                    const questScore = (quest.reward * difficulty * safetyBoost) / Math.sqrt(quest.expiresIn);

                    if (questScore > highestQuestScore) {
                        highestQuestScore = questScore;
                        bestQuestId = quest.adId;
                    }
                }
            }
        }

        if (!bestQuestId) {
            throw new Error("No valid quest found with reward and expiration values.");
        }

        console.log(`Best quest found: ${bestQuestId} (Ratio: ${highestQuestScore.toFixed(2)})`);
        return bestQuestId;
    } catch (error: any) {
        console.error("Error parsing quests:", error.message);
        return null;
    }
}

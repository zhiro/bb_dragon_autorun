import { getQuestDifficulty } from "./getQuestDifficulty";
import { attemptQuest } from "./attemptQuest";
import { updateQuestStats } from "./updateQuestStats";
import { restForATurn } from "../shopping/restForATurn";
import { fetchQuestList } from "./fetchQuestList";
import { tryToImproveOdds } from "../shopping/tryToImproveOdds";


export async function findAndAttemptBestQuest(gameId : string, skippedTurns: number, gold: number, lives: number) : Promise<number> {
    try {
        const questList = await fetchQuestList(gameId);
        if (!Array.isArray(questList) || questList.length === 0) {
            throw new Error("Invalid or empty quest data. Please start a new game.");
        }

        let bestQuestId = "";
        let bestQuestDifficultyModifier = 0;
        let bestQuestProbability = "";
        let bestQuestScore = -Infinity;
        console.log(`id      |risk|score |exp|gold`)

        for (const quest of questList) {
            if (quest.encrypted == null) {
                // Ignores the trap quest
                if (quest.message.startsWith("Steal super awesome diamond")) {
                    continue;
                }

                if (quest.reward && quest.expiresIn) {
                    const difficulty = getQuestDifficulty(quest.probability);

                    const safetyBoost = difficulty >= 0.8 ? 2 : 1;
                    const penalty = (1 - difficulty) * 0.5;
                    const expirationWeight = 1 + (quest.expiresIn - 1) * 0.1;

                    const questScore = (quest.reward * difficulty * safetyBoost) / (expirationWeight + penalty);

                    console.log(`${quest.adId}|${String(difficulty).padEnd(4)}|${String(questScore.toFixed(2)).padEnd(6)}|${String(quest.expiresIn).padEnd(3)}|${quest.reward}`);
                    if (
                            (questScore > bestQuestScore + 10) ||
                            (Math.abs(questScore - bestQuestScore) < 10 && difficulty > bestQuestDifficultyModifier) ||
                            (questScore === bestQuestScore && difficulty > bestQuestDifficultyModifier)
                        ) {
                        bestQuestId = quest.adId;
                        bestQuestScore = questScore;
                        bestQuestDifficultyModifier = difficulty;
                        bestQuestProbability = quest.probability;
                    }
                }
            }
        }

        if (bestQuestId !== "") {
            console.log(`Best quest found: ${bestQuestId} (Ratio: ${bestQuestScore.toFixed(2)}) - (diff: ${bestQuestDifficultyModifier})`);
        }

        if (bestQuestDifficultyModifier < 0.9 && skippedTurns < 4) {
            console.log(`No good quests. Checking store or resting ${skippedTurns + 1}/4...`);

            const wentShopping = await tryToImproveOdds(gameId, gold, lives);

            if (wentShopping) {
                return skippedTurns + 1;
            } else {
                if (bestQuestDifficultyModifier < 0.5) {
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    await restForATurn(gameId);
                    return skippedTurns + 1;
                }
            }
        }

        console.log("--------------------------------------------------")
        const success = await attemptQuest(gameId, bestQuestId);
        await updateQuestStats(bestQuestProbability, success);
        return 0;

    } catch (error: any) {
        console.error("Error parsing quests:", error.message);
        return 0;
    }
}

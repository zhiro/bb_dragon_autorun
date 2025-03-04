import { getQuestDifficulty } from "./getQuestDifficulty";
import { attemptQuest } from "./attemptQuest";
import { updateQuestStats } from "./updateQuestStats";
import { restForATurn } from "../restForATurn";
import { fetchQuestList } from "./fetchQuestList";
import {buyItemFromShop} from "../shopping/buyItemFromShop";
import {tryToImproveOdds} from "../tryToImproveOdds";


export async function findAndAttemptBestQuest(gameId : string, skippedTurns: number, gold: number) : Promise<number> {
    try {

        const questList = await fetchQuestList(gameId);

        if (!Array.isArray(questList) || questList.length === 0) {
            throw new Error("Invalid or empty quest data.");
        }

        let bestQuestId = "";
        let bestQuestDifficultyModifier = 0;
        let bestQuestProbability = "";
        let bestQuestScore = -Infinity;


        console.log(`id      |risk|score |exp`)

        for (const quest of questList) {
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

                    console.log(`${quest.adId}|${String(difficulty).padEnd(4)}|${String(questScore.toFixed(2)).padEnd(6)}|${quest.expiresIn}`);

                    // prefer the easiest quests
                    // Logic goes to infinite loop if all quests are 0 (impossible)

                    // need to make this selection easier not this complicated

                    if (
                            (questScore > bestQuestScore + 10) || // Always pick the highest score if difference is big
                            (Math.abs(questScore - bestQuestScore) < 10 && difficulty > bestQuestDifficultyModifier) || // Prefer difficulty if scores are close
                            (questScore === bestQuestScore && difficulty > bestQuestDifficultyModifier) // Tie-breaker by difficulty
                        )

                    {
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

        // KUI MODIFIER ON SITT SIIS TEE PAREM OSTMINE, KUI OSTA EI SAA SIIS PUHKA NIISAMA
        // tryToImproveOdds()
        // PANE PUHKAMINE SHOPPING FUNCI SISSE


        // if (bestQuestDifficultyModifier <= 0.1 && skippedTurns < 7) {
        // if (bestQuestDifficultyModifier < 0.5 && skippedTurns < 7) {
        //     console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        //     console.log(`No good quests. Resting turn ${skippedTurns + 1}/7...`);
        //
        //     await restForATurn(gameId);
        //
        //     return skippedTurns + 1;
        // }
        if (bestQuestDifficultyModifier < 0.9 && skippedTurns < 7) {

            const wentShopping = await tryToImproveOdds(gameId, gold);

            if (wentShopping) {
                return skippedTurns + 1;
            } else {
                if (bestQuestDifficultyModifier < 0.5) {
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    console.log(`No good quests. Resting turn ${skippedTurns + 1}/7...`);
                    await restForATurn(gameId);
                    return skippedTurns + 1;
                }
            }
        }

        console.log("------------------")
        const success = await attemptQuest(gameId, bestQuestId);
        // await updateQuestStats(bestQuestProbability, success);
        return 0;


    } catch (error: any) {
        console.error("Error parsing quests:", error.message);
        return 0;
    }




}

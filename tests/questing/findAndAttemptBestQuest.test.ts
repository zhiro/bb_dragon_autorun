import { describe, expect, it, vi } from "vitest";
import { findAndAttemptBestQuest } from "../../src/questing/findAndAttemptBestQuest";

import { fetchQuestList } from "../../src/questing/fetchQuestList";
import { attemptQuest } from "../../src/questing/attemptQuest";
import { updateQuestStats } from "../../src/questing/updateQuestStats";
import { restForATurn } from "../../src/shopping/restForATurn";
import { tryToImproveOdds } from "../../src/shopping/tryToImproveOdds";
import { getQuestDifficulty } from "../../src/questing/getQuestDifficulty";

vi.mock("../../src/questing/fetchQuestList");
vi.mock("../../src/questing/attemptQuest");
vi.mock("../../src/questing/updateQuestStats");
vi.mock("../../src/shopping/restForATurn");
vi.mock("../../src/shopping/tryToImproveOdds");
vi.mock("../../src/questing/getQuestDifficulty");

describe("findAndAttemptBestQuest", () => {
    it("selects the best quest based on the new scoring system", async () => {
        vi.mocked(fetchQuestList).mockResolvedValue([
            { adId: "quest1", reward: 50, expiresIn: 10, probability: "Quite likely" },
            { adId: "quest2", reward: 100, expiresIn: 5, probability: "Piece of cake" },
            { adId: "quest3", reward: 30, expiresIn: 3, probability: "Risky" },
        ]);

        vi.mocked(getQuestDifficulty).mockImplementation((probability) => {
            const difficultyMap: Record<string, number> = {
                "Quite likely": 0.76,
                "Piece of cake": 0.96,
                "Risky": 0.45,
            };
            return difficultyMap[probability] || 1;
        });

        vi.mocked(attemptQuest).mockResolvedValue(true);
        vi.mocked(updateQuestStats).mockResolvedValue(undefined);

        const gameId = "testGame";
        const skippedTurns = 0;
        const gold = 100;
        const lives = 3;

        const newSkippedTurns = await findAndAttemptBestQuest(gameId, skippedTurns, gold, lives);

        expect(newSkippedTurns).toBe(0);
    });

    it("returns an error if quest list is empty", async () => {
        vi.mocked(fetchQuestList).mockResolvedValue([]);

        const gameId = "testGame";
        const skippedTurns = 0;
        const gold = 100;
        const lives = 3;

        await expect(findAndAttemptBestQuest(gameId, skippedTurns, gold, lives)).resolves.toBe(0);
    });

    it("avoids trap quests starting with 'Steal super awesome diamond'", async () => {
        vi.mocked(fetchQuestList).mockResolvedValue([
            { adId: "trap1", reward: 999, expiresIn: 1, probability: "Sure thing", message: "Steal super awesome diamond ring" },
            { adId: "valid1", reward: 50, expiresIn: 5, probability: "Piece of cake", message: "Help a merchant" },
        ]);

        vi.mocked(getQuestDifficulty).mockImplementation((probability) => {
            return probability === "Piece of cake" ? 0.96 : 1;
        });

        vi.mocked(attemptQuest).mockResolvedValue(true);

        const gameId = "testGame";
        const skippedTurns = 0;
        const gold = 100;
        const lives = 3;

        const newSkippedTurns = await findAndAttemptBestQuest(gameId, skippedTurns, gold, lives);


        expect(newSkippedTurns).toBe(0);
    });

    it("rests or shops if no good quests are available", async () => {
        vi.mocked(fetchQuestList).mockResolvedValue([
            { adId: "low1", reward: 10, expiresIn: 3, probability: "Risky", message: "Help a villager" },
            { adId: "low2", reward: 15, expiresIn: 5, probability: "Risky", message: "Help a merchant" },
        ]);

        vi.mocked(getQuestDifficulty).mockImplementation(() => 0.45);

        vi.mocked(tryToImproveOdds).mockResolvedValue(false);
        vi.mocked(restForATurn).mockResolvedValue(undefined);

        const gameId = "testGame";
        const skippedTurns = 2;
        const gold = 40;
        const lives = 2;

        const newSkippedTurns = await findAndAttemptBestQuest(gameId, skippedTurns, gold, lives);

        expect(newSkippedTurns).toBe(3);

        expect(restForATurn).toHaveBeenCalledWith(gameId);
    });
});

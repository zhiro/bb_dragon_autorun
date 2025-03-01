import { describe, expect, it } from "vitest";
import { findBestQuest } from "../src/findBestQuest";

describe("getBestQuest", () => {
    it("returns the quest with the highest reward-to-expiration ratio", () => {
        const sampleQuests = [
            { adId: "quest1", reward: 50, expiresIn: 10 },
            { adId: "quest2", reward: 100, expiresIn: 5 }, // Best: 100/5 = 20
            { adId: "quest3", reward: 30, expiresIn: 3 },
        ];

        expect(findBestQuest(sampleQuests)).toBe("quest2");
    });

    it("returns null for an empty quest list", () => {
        expect(findBestQuest([])).toBeNull();
    });

    it("ignores invalid quests", () => {
        const invalidQuests = [
            { adId: "quest1", reward: 50, expiresIn: 0 }, // Invalid (expiresIn = 0)
            { adId: "quest2", reward: 0, expiresIn: 5 },  // Invalid (reward = 0)
        ];

        expect(findBestQuest(invalidQuests)).toBeNull();
    });
});

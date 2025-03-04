import { describe, expect, it, vi, beforeEach } from "vitest";
import * as fs from "fs";
import { getQuestDifficulty } from "../../src/questing/getQuestDifficulty";

vi.mock("fs");

describe("getQuestDifficulty", () => {
    let mockStatsData: string;

    beforeEach(() => {
        vi.resetAllMocks();

        mockStatsData = JSON.stringify({
            "Sure thing": { "risk": 1 },
            "Piece of cake": { "risk": 0.96 },
            "Walk in the park": { "risk": 0.85 },
            "Quite likely": { "risk": 0.76 },
            "Hmmm....": { "risk": 0.68 },
            "Risky": { "risk": 0.45 },
            "Gamble": { "risk": 0.47 },
            "Rather detrimental": { "risk": 0.27 },
            "Playing with fire": { "risk": 0.18 },
            "Suicide mission": { "risk": 0.11 },
            "Impossible": { "risk": 0 }
        });

        vi.mocked(fs.readFileSync).mockReturnValue(mockStatsData);
    });

    it("returns correct risk value when risk is found", () => {
        expect(getQuestDifficulty("Sure thing")).toBe(1);
        expect(getQuestDifficulty("Risky")).toBe(0.45);
        expect(getQuestDifficulty("Suicide mission")).toBe(0.11);
    });

    it("returns default risk (1) when risk is not found", () => {
        expect(getQuestDifficulty("Unknown Risk")).toBe(1);
    });

    it("returns default risk (1) when file reading fails", () => {
        vi.mocked(fs.readFileSync).mockImplementation(() => {
            throw new Error("File read error");
        });

        expect(getQuestDifficulty("Sure thing")).toBe(1);
    });
});

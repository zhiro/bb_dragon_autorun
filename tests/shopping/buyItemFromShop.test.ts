import { describe, expect, it, vi, beforeEach } from "vitest";
import * as fs from "fs";
import axios from "axios";
import * as path from "path";

import { buyItemFromShop } from "../../src/shopping/buyItemFromShop";

vi.mock("fs");
vi.mock("axios");

const SAVE_FILE_PATH = path.join(__dirname, "../../src/data", "saveFile.json");

describe("buyItemFromShop", () => {
    beforeEach(() => {
        vi.resetAllMocks();

        vi.mocked(fs.existsSync).mockReturnValue(true);

        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
            gameId: "testGame123",
            gold: 100,
            lives: 3,
            level: 0,
            turn: 0
        }));

        vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it("buys an item successfully and updates saveFile.json", async () => {
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                shoppingSuccess: true,
                gold: 50,
                lives: 4,
                level: 1,
                turn: 1
            }
        });

        await buyItemFromShop("testGame123", "hpot");

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            SAVE_FILE_PATH,
            JSON.stringify({
                gameId: "testGame123",
                gold: 50,
                lives: 4,
                level: 1,
                turn: 1
            }, null, 2)
        );
    });

    it("handles failed purchases (`shoppingSuccess: false`) and updates saveFile.json", async () => {
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                shoppingSuccess: false,
                gold: 90,
                lives: 3,
                level: 0,
                turn: 1
            }
        });

        await buyItemFromShop("testGame123", "hpot");

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            SAVE_FILE_PATH,
            JSON.stringify({
                gameId: "testGame123",
                gold: 90,
                lives: 3,
                level: 0,
                turn: 1
            }, null, 2)
        );
    });

    it("throws an error when `saveFile.json` is missing", async () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);

        const consoleSpy = vi.spyOn(console, "error");

        await buyItemFromShop("testGame123", "hpot");

        expect(consoleSpy).toHaveBeenCalledWith("Error buying items:", "saveFile.json not found! Start the game first.");
    });

    it("handles API failures gracefully", async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));

        const consoleSpy = vi.spyOn(console, "error");

        await buyItemFromShop("testGame123", "hpot");

        expect(consoleSpy).toHaveBeenCalledWith("Error buying items:", "Network error");
    });
});

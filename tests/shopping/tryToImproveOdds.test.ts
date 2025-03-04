import { describe, expect, it, vi } from "vitest";
import {tryToImproveOdds} from "../../src/shopping/tryToImproveOdds";

import { getShopInventory } from "../../src/shopping/viewShop";
import { buyItemFromShop } from "../../src/shopping/buyItemFromShop";

vi.mock("../../src/shopping/viewShop");
vi.mock("../../src/shopping/buyItemFromShop");


describe("tryToImproveOdds", () => {
    it("returns false when shop inventory is empty", async () => {
        vi.mocked(getShopInventory).mockResolvedValue([]);

        const result = await tryToImproveOdds("testGame", 100, 3);
        expect(result).toBe(false);
    });

    it("returns false when no items are affordable", async () => {
        vi.mocked(getShopInventory).mockResolvedValue([
            { id: "iron", name: "Iron Plating", cost: 300 }
        ]);

        const result = await tryToImproveOdds("testGame", 100, 3);
        expect(result).toBe(false);
    });

    it("returns false when only affordable item is 'hpot' and lives >= 6", async () => {
        vi.mocked(getShopInventory).mockResolvedValue([
            { id: "hpot", name: "Healing potion", cost: 50 }
        ]);

        const result = await tryToImproveOdds("testGame", 100, 6);
        expect(result).toBe(false);
    });

    it("buys the best available item and returns true", async () => {
        vi.mocked(getShopInventory).mockResolvedValue([
            { id: "hpot", name: "Healing potion", cost: 50 },
            { id: "iron", name: "Iron Plating", cost: 300 },
            { id: "rf", name: "Rocket Fuel", cost: 300 }
        ]);

        vi.mocked(buyItemFromShop).mockResolvedValue(undefined);

        const result = await tryToImproveOdds("testGame", 300, 3);
        expect(result).toBe(true);

        expect(buyItemFromShop).toHaveBeenCalledWith("testGame", expect.stringMatching(/iron|rf/));
    });

    it("randomly picks one of multiple best-priced items", async () => {
        vi.mocked(getShopInventory).mockResolvedValue([
            { id: "rf", name: "Rocket Fuel", cost: 300 },
            { id: "iron", name: "Iron Plating", cost: 300 }
        ]);

        vi.mocked(buyItemFromShop).mockResolvedValue(undefined);

        const result = await tryToImproveOdds("testGame", 300, 3);
        expect(result).toBe(true);

        expect(buyItemFromShop).toHaveBeenCalledWith("testGame", expect.stringMatching(/iron|rf/));
    });
});

import {buyItemFromShop} from "./buyItemFromShop";
import {getShopInventory} from "./viewShop";


export async function tryToImproveOdds(gameId: string, gold: number, lives: number) {

    const storeInventory = await getShopInventory(gameId)

    const affordableItems = storeInventory.filter(item => item.cost <= gold);

    if (affordableItems.length === 0) {
        return false;
    }

    const maxAffordableCost = Math.max(...affordableItems.map(item => item.cost));
    const bestItems = affordableItems.filter(item => item.cost === maxAffordableCost);
    const itemId = bestItems[Math.floor(Math.random() * bestItems.length)].id;

    if (itemId == "hpot" && lives >= 6) {
        return false;
    }
    await buyItemFromShop(gameId, itemId);
    return true;
}
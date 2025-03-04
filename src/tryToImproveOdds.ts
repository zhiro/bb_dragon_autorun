import {buyItemFromShop} from "./shopping/buyItemFromShop";
import {getShopInventory} from "./shopping/viewShop";


export async function tryToImproveOdds(gameId: string, gold: number) {

    const storeInventory = await getShopInventory(gameId)


    const affordableItems = storeInventory.filter(item => item.cost <= gold);

    if (affordableItems.length === 0) {
        return false;
    }

    const maxAffordableCost = Math.max(...affordableItems.map(item => item.cost));

    const bestItems = affordableItems.filter(item => item.cost === maxAffordableCost);


    const itemId = bestItems[Math.floor(Math.random() * bestItems.length)].id;

    await buyItemFromShop(gameId, itemId);

    return true;

}
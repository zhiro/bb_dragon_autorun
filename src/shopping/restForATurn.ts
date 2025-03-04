import {buyItemFromShop} from "./buyItemFromShop";


export async function restForATurn(gameId: string) {

    // Skip a turn to refresh available quests
    await buyItemFromShop(gameId, "restForATurn");

}
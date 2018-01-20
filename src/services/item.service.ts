import { SetNames } from '../enums/set-names';
import { WarframeMarketService } from '../services/warframe-market.service';
import { Item } from '../models/item';

export class ItemService {
    public static async GetItems(): Promise<Item[]> {
        const items: Item[] = [];

        for (const set of SetNames) {
            const setItems = await WarframeMarketService.GetSetItems(set);
            for (const item of setItems) {
                const stats = await WarframeMarketService.GetItemStats(item);
                if (stats.volume > 0) {
                    item.Price = stats.avg_price;
                    items.push(item);
                }
            }
        }

        return items;
    }
}

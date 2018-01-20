import { Config, ConfigKeys } from '../config/config';
import { WarframeMarketService } from '../services/warframe-market.service';
import { Item } from '../models/item';

export class ItemService {
    public static async GetItems(): Promise<Item[]> {
        const items: Item[] = [];
        const setNames = Config.get(ConfigKeys.SetNames) as string[];

        for (const set of setNames) {
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

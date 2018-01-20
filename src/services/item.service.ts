import { Config, ConfigKeys } from '../config/config';
import { WarframeMarketService } from '../services/warframe-market.service';
import { Item } from '../models/item';

export class ItemService {
    public static async GetItems(progress?: (current: number, total: number) => void): Promise<Item[]> {
        const warframeMarketService = new WarframeMarketService();
        const items: Item[] = [];
        const setNames = Config.get(ConfigKeys.SetNames) as string[];

        if (typeof progress !== 'function') {
            progress = () => null;
        }

        let current = 0;
        let total = setNames.length;

        let setItems: Item[] = [];

        for (const set of setNames) {
            setItems = setItems.concat(await warframeMarketService.GetSetItems(set));
            current++;
            progress(current, total);
        }

        current = 0;
        total = setItems.length;

        for (const item of setItems) {
            const stats = await warframeMarketService.GetItemStats(item);
            current++;
            if (stats.volume > 0) {
                item.Price = stats.avg_price;
                items.push(item);
            }

            progress(current, total);
        }

        return items;
    }
}

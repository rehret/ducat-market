import { Config, ConfigKeys } from '../config/config';
import { WarframeMarketService } from '../services/warframe-market.service';
import { Item } from '../models/item';
import { Log } from '../log';
import { injectable, inject } from 'inversify';

@injectable()
export class ItemService {
    private warframeMarketService: WarframeMarketService;

    constructor(@inject(WarframeMarketService) warframeMarketService: WarframeMarketService) {
        this.warframeMarketService = warframeMarketService;
    }

    public async GetItems(): Promise<Item[]> {
        const items: Item[] = [];
        const setNames = Config.get(ConfigKeys.SetNames) as string[];

        let current = 0;
        let total = setNames.length;

        let setItems: Item[] = [];

        for (const set of setNames) {
            setItems = setItems.concat(await this.warframeMarketService.GetSetItems(set));
            current++;
            Log.debug(`Fetching sets: ${current} / ${total}`);
        }

        current = 0;
        total = setItems.length;

        for (const item of setItems) {
            const stats = await this.warframeMarketService.GetItemStats(item);
            current++;
            if (stats.volume > 0) {
                item.Price = stats.avg_price;
                items.push(item);
            }

            Log.debug(`Fetching items: ${current} / ${total}`);
        }

        return items;
    }
}

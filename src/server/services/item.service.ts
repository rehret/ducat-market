import * as Bunyan from 'bunyan';
import { WarframeMarketService } from '../services/warframe-market.service';
import { Item } from '../models/item';
import { injectable, inject } from 'inversify';

@injectable()
export class ItemService {
    private warframeMarketService: WarframeMarketService;
    private log: Bunyan;

    constructor(
        @inject(WarframeMarketService) warframeMarketService: WarframeMarketService,
        @inject(Bunyan) log: Bunyan
    ) {
        this.warframeMarketService = warframeMarketService;
        this.log = log;
    }

    public async GetItems(): Promise<Item[]> {
        const items: Item[] = [];

        this.log.debug('Fetching item manifest');
        const itemSetManifest = await this.warframeMarketService.GetItemManifest();

        const setNames = itemSetManifest
            .filter((manifest) => {
                return manifest.item_name.toLowerCase().indexOf('prime') > 1 &&
                    manifest.url_name.toLowerCase().endsWith('_set');
            })
            .map((manifest) => manifest.url_name);

        let current = 0;
        let total = setNames.length;

        let setItems: Item[] = [];

        for (const set of setNames) {
            current++;
            this.log.debug(`Fetching sets: ${current} / ${total}`);

            const itemsInSet = (await this.warframeMarketService.GetItemsInSet(set))
                .filter((i) => !i.set_root)
                .map((i) => new Item(i.en.item_name, i.url_name, i.ducats));

            setItems = setItems.concat(itemsInSet);
        }

        current = 0;
        total = setItems.length;

        for (const item of setItems) {
            current++;
            this.log.debug(`Fetching items: ${current} / ${total}`);

            const stats = await this.warframeMarketService.GetItemStats(item);

            if (stats.volume > 0) {
                item.Price = stats.avg_price;
                items.push(item);
            }
        }

        return items;
    }
}

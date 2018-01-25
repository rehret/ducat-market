import { Config, ConfigKeys } from '../config/config';
import { Item } from '../models/item';
import { ItemService } from './item.service';
import { ItemCacheService } from './item-cache.service';
import { Log } from '../log';
import { injectable, inject } from 'inversify';

@injectable()
export class ItemProvider {
    private itemCacheService: ItemCacheService;
    private itemService: ItemService;
    private itemPromise: Promise<Item[]>;

    constructor(
        @inject(ItemCacheService) itemCacheService: ItemCacheService,
        @inject(ItemService) itemService: ItemService
    ) {
        this.itemCacheService = itemCacheService;
        this.itemService = itemService;

        // begin prefetching items instead of waiting for the first request
        this.GetItems();
    }

    public get Items(): Promise<Item[]> {
        return this.itemPromise;
    }

    private async GetItems(): Promise<void> {
        // only run once (itemPromise is undefined at instantiation)
        if (this.itemPromise === undefined) {
            if (this.itemCacheService.HasCache()) {
                this.itemPromise = this.itemCacheService.GetItemsCache();
            } else {
                this.itemPromise = this.itemService.GetItems();
                this.itemPromise.then((items) => {
                    Log.info('Items fetched from Warframe.Market');
                    this.itemCacheService.CacheItems(items);
                });
            }

            setInterval(async () => {
                const tempPromise = this.itemService.GetItems();
                tempPromise.then((items) => {
                    this.itemPromise = tempPromise;
                    Log.info('Items updated from Warframe.Market');
                    this.itemCacheService.CacheItems(items);
                });
            }, Config.get(ConfigKeys.CacheTTL));
        }

        return;
    }
}

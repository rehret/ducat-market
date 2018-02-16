import * as Bunyan from 'bunyan';
import { Config, ConfigKeys } from '../config/config';
import { Item } from '../../shared/models/item';
import { ItemService } from './item.service';
import { ItemCacheService } from './item-cache.service';
import { injectable, inject } from 'inversify';

@injectable()
export class ItemProvider {
    private itemCacheService: ItemCacheService;
    private itemService: ItemService;
    private log: Bunyan;
    private itemPromise: Promise<Item[]>;

    constructor(
        @inject(ItemCacheService) itemCacheService: ItemCacheService,
        @inject(ItemService) itemService: ItemService,
        @inject(Bunyan) log: Bunyan
    ) {
        this.itemCacheService = itemCacheService;
        this.itemService = itemService;
        this.log = log;

        // begin prefetching items instead of waiting for the first request
        this.itemPromise = this.GetItems();
    }

    public get Items(): Promise<Item[]> {
        return this.itemPromise;
    }

    private async GetItems(): Promise<Item[]> {
        // only run once (itemPromise is undefined at instantiation)
        if (this.itemPromise === undefined) {
            if (this.itemCacheService.HasCache()) {
                this.itemPromise = this.itemCacheService.GetItemsCache();
            } else {
                this.itemPromise = this.itemService.GetItems();
                this.itemPromise.then((items) => {
                    this.log.info('Items fetched from Warframe.Market');
                    this.itemCacheService.CacheItems(items);
                });
            }

            setInterval(async () => {
                const tempPromise = this.itemService.GetItems();
                tempPromise.then((items) => {
                    this.itemPromise = tempPromise;
                    this.log.info('Items updated from Warframe.Market');
                    this.itemCacheService.CacheItems(items);
                });
            }, Config.get(ConfigKeys.CacheTTL));
        }

        return this.itemPromise;
    }
}

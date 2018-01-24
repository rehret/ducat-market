import { Config, ConfigKeys } from '../config/config';
import { Item } from '../models/item';
import { ItemService } from './item.service';
import { ItemCacheService } from './item-cache.service';
import { Log } from '../log';

export class ItemProvider {
    private static itemPromise: Promise<Item[]>;

    public static async GetItems(): Promise<Item[]> {
        if (ItemProvider.itemPromise === undefined) {
            if (ItemCacheService.HasCache()) {
                ItemProvider.itemPromise = ItemCacheService.GetItemsCache().then((cache) => {
                    if (!cache) {
                        return [];
                    } else {
                        return cache;
                    }
                });
            } else {
                ItemProvider.itemPromise = ItemService.GetItems();
                ItemProvider.itemPromise.then((items) => {
                    Log.info('Items fetched from Warframe.Market');
                    ItemCacheService.CacheItems(items);
                });
            }

            setInterval(async () => {
                const tempPromise = ItemService.GetItems();
                tempPromise.then((items) => {
                    ItemProvider.itemPromise = tempPromise;
                    Log.info('Items updated from Warframe.Market');
                    ItemCacheService.CacheItems(items);
                });
            }, Config.get(ConfigKeys.CacheTTL));
        }

        return ItemProvider.itemPromise;
    }
}

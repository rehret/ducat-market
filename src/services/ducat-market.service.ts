import { Config, ConfigKeys } from '../config/config';
import { ItemService } from './item.service';
import { Item } from '../models/item';
import { Log } from '../log';
import { ItemCacheService } from './item-cache.service';

export class DucatMarketService {
    private static itemPromise: Promise<Item[]>;

    private static get Items(): Promise<Item[]> {
        if (DucatMarketService.itemPromise === undefined) {
            if (ItemCacheService.HasCache()) {
                DucatMarketService.itemPromise = ItemCacheService.GetItemsCache().then((cache) => {
                    if (!cache) {
                        return [];
                    } else {
                        return cache;
                    }
                });
                DucatMarketService.itemPromise.then(() => {
                    Log.info('Warframe.Market items loaded from cache');
                });
            } else {
                DucatMarketService.itemPromise = ItemService.GetItems();
                DucatMarketService.itemPromise.then((items) => {
                    ItemCacheService.CacheItems(items);
                    Log.info('Warframe.Market items loaded');
                });
            }

            setInterval(async () => {
                const tempPromise = ItemService.GetItems();
                tempPromise.then((items) => {
                    ItemCacheService.CacheItems(items);
                    DucatMarketService.itemPromise = tempPromise;
                    Log.info('Warframe.Market items updated');
                });
            }, Config.get(ConfigKeys.CacheTTL));
        }

        return DucatMarketService.itemPromise;
    }

    public static async Init(): Promise<void> {
        DucatMarketService.Items;
    }

    public static async GetTopItems(limit: number = 5): Promise<Item[]> {
        return (await DucatMarketService.Items)
            .sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
            .slice(0, limit);
    }
}

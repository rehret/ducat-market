import { ItemService } from './item.service';
import { Item } from '../models/item';
import { Log } from '../log';

export class DucatMarketService {
    private static itemPromise: Promise<Item[]>;

    private static get Items(): Promise<Item[]> {
        if (DucatMarketService.itemPromise === undefined) {
            DucatMarketService.itemPromise = ItemService.GetItems();
            DucatMarketService.itemPromise.then(() => {
                Log.info('Warframe.Market items loaded');
            });

            setInterval(async () => {
                const tempPromise = ItemService.GetItems();
                tempPromise.then(() => {
                    DucatMarketService.itemPromise = tempPromise;
                    Log.info('Warframe.Market items updated');
                });
            }, 1 * 60 * 60 * 1000);
        }

        return DucatMarketService.itemPromise;
    }

    public static async Init(): Promise<void> {
        DucatMarketService.Items;
    }

    public static async GetTopItems(limit: number = 5, printProgress: boolean = true): Promise<Item[]> {
        return (await DucatMarketService.Items)
            .sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
            .slice(0, limit);
    }
}

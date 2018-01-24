import * as fs from 'fs';
import { Item } from '../models/item';
import { Log } from '../log';

export class ItemCacheService {
    private static cacheFileName = './item-cache.json';

    public static async CacheItems(items: Item[]): Promise<void> {
        fs.writeFile(ItemCacheService.cacheFileName, JSON.stringify(items), 'utf-8', (err) => {
            if (err) {
                Log.error(err, 'Failed to write item cache');
            }
        });
    }

    public static async GetItemsCache(): Promise<Item[] | undefined> {
        return new Promise<Item[] | undefined>((resolve, reject) => {
            if (!ItemCacheService.HasCache()) {
                resolve();
            } else {
                fs.readFile(ItemCacheService.cacheFileName, 'utf-8', (err, fileContents) => {
                    if (err) {
                        Log.error(err, 'Failed to retreive item cache');
                        reject(err);
                    }

                    resolve(JSON.parse(fileContents));
                });
            }
        });
    }

    public static HasCache(): boolean {
        return fs.existsSync(ItemCacheService.cacheFileName);
    }
}

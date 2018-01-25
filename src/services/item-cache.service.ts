import * as fs from 'fs';
import { Item } from '../models/item';
import { Log } from '../log';
import { injectable } from 'inversify';

@injectable()
export class ItemCacheService {
    private static cacheFileName = './item-cache.json';

    public async CacheItems(items: Item[]): Promise<void> {
        fs.writeFile(ItemCacheService.cacheFileName, JSON.stringify(items), 'utf-8', (err) => {
            if (err) {
                Log.error(err, 'Failed to write item cache');
            } else {
                Log.info('Item cache updated');
            }
        });
    }

    public async GetItemsCache(): Promise<Item[]> {
        return new Promise<Item[]>((resolve, reject) => {
            if (!this.HasCache()) {
                resolve([]);
            } else {
                fs.readFile(ItemCacheService.cacheFileName, 'utf-8', (err, fileContents) => {
                    if (err) {
                        Log.error(err, 'Failed to retreive item cache');
                        reject(err);
                    } else {
                        Log.info('Item cache loaded');
                        resolve(JSON.parse(fileContents).map((jsonItem: Item) => {
                            return new Item(jsonItem.Name, jsonItem.UrlName, jsonItem.Ducats, jsonItem.Price);
                        }));
                    }
                });
            }
        });
    }

    public HasCache(): boolean {
        return fs.existsSync(ItemCacheService.cacheFileName);
    }
}

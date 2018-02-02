import * as fs from 'fs';
import * as Bunyan from 'bunyan';
import { Item } from '../../shared/models/item';
import { injectable, inject } from 'inversify';

@injectable()
export class ItemCacheService {
    private static cacheFileName = './item-cache.json';
    private log: Bunyan;

    constructor(@inject(Bunyan) log: Bunyan) {
        this.log = log;
    }

    public async CacheItems(items: Item[]): Promise<void> {
        fs.writeFile(ItemCacheService.cacheFileName, JSON.stringify(items), 'utf-8', (err) => {
            if (err) {
                this.log.error(err, 'Failed to write item cache');
            } else {
                this.log.info('Item cache updated');
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
                        this.log.error(err, 'Failed to retreive item cache');
                        reject(err);
                    } else {
                        this.log.info('Item cache loaded');
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

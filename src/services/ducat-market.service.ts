import { Item } from '../models/item';
import { ItemProvider } from './item.provider';

export class DucatMarketService {
    public static async GetTopItems(limit: number = 5): Promise<Item[]> {
        return (await ItemProvider.GetItems())
            .sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
            .slice(0, limit);
    }
}

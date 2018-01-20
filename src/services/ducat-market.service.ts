import { ItemService } from './item.service';
import { Item } from '../models/item';

export class DucatMarketService {
    public static async GetTopItems(limit: number = 5): Promise<Item[]> {
        const items = await ItemService.GetItems();
        return items
            .sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
            .slice(0, limit);
    }
}

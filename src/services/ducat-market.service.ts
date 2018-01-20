import { ItemService } from './item.service';

export class DucatMarketService {
    public static async GetTopItems(limit: number = 5): Promise<Item[]> {
        const items = await ItemService.GetItems();
    }
}

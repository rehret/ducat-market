import axios from 'axios';
import { Config, ConfigKeys } from '../config/config';
import { Item } from '../models/item';

const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);

export class WarframeMarketService {

    public static async GetPricesForSet(setName: string): Promise<Item[]> {
        const items: Item[] = [];

        const setItems = await WarframeMarketService.GetSetItems(setName);
        for (const item of setItems) {
            const itemStats = await WarframeMarketService.GetItemStatistics(item);
            if (itemStats.volume > 0) {
                item.Price = itemStats.avg_price;
                items.push(item);
            }
        }

        return items;
    }

    private static async GetSetItems(setName: string): Promise<Item[]> {
        const url = `${baseUrl}/items/${setName}`;
        const setResponse = await axios.get<ItemSetResult>(url);
        if (setResponse.status !== 200) {
            throw new Error(setResponse.statusText);
        }

        const items = setResponse.data;
        return items.payload.item.items_in_set
            .filter((i) => !i.set_root)
            .map((i) => new Item(i.en.item_name, i.url_name, i.ducats));
    }

    private static async GetItemStatistics(item: Item): Promise<ItemStatistic> {
        const response = await axios.get<ItemStatisticsResult>(`${baseUrl}/items/${item.UrlName}/statistics`);
        const stats = response.data.payload.statistics['90days'];
        return stats.sort((a, b) => {
            const aDate = new Date(a.datetime);
            const bDate = new Date(b.datetime);
            return bDate.getTime() - aDate.getTime();
        })[0];
    }

}

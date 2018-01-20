import axios from 'axios';
import { Config, ConfigKeys } from '../config/config';
import { Item } from '../models/item';

const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);

export class WarframeMarketService {

    public static async GetSetItems(setName: string): Promise<Item[]> {
        const url = `${baseUrl}/items/${setName}`;
        console.log(url);
        const setResponse = await axios.get<ItemSetResult>(url);
        if (setResponse.status !== 200) {
            throw new Error(setResponse.statusText);
        }

        const items = setResponse.data;
        return items.payload.item.items_in_set
            .filter((i) => !i.set_root)
            .map((i) => new Item(i.en.item_name, i.url_name, i.ducats));
    }

    public static async GetItemStats(item: Item): Promise<ItemStatistic> {
        const url = `${baseUrl}/items/${item.UrlName}/statistics`;
        console.log(url);
        const statsResponse = await axios.get<ItemStatisticsResult>(url);
        if (statsResponse.status !== 200) {
            throw new Error(statsResponse.statusText);
        }

        const stats = statsResponse.data.payload.statistics['90days'];
        return stats.sort((a, b) => {
            const aDate = new Date(a.datetime);
            const bDate = new Date(b.datetime);
            return bDate.getTime() - aDate.getTime();
        })[0];
    }

}

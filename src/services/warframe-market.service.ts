import axios from 'axios';
import { Config, ConfigKeys } from '../config/config';
import { Item } from '../models/item';

const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);

export class WarframeMarketService {

    public static async GetPricesForSet(setName: string): Promise<Item[]> {
        const items: Item[] = [];

        const setItems = await WarframeMarketService.GetSetItems(setName);
        for (const item of setItems) {
            const prices = await WarframeMarketService.GetPricesForItem(item);
            if (prices.length > 0) {
                item.Price = await WarframeMarketService.GetAveragePrice(prices);
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

    private static async GetPricesForItem(item: Item): Promise<number[]> {
        const url = `${baseUrl}/items/${item.UrlName}/orders`;
        const ordersResponse = await axios.get<OrdersResult>(url);
        if (ordersResponse.status !== 200) {
            throw new Error(ordersResponse.statusText);
        }

        const orders = ordersResponse.data;
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);

        return orders.payload.orders
            .filter((o) => o.order_type === 'buy' && new Date(o.user.last_seen) >= cutoffDate)
            .map((o) => o.platinum);
    }

    private static async GetAveragePrice(prices: number[]): Promise<number> {
        return prices.reduce((sum, val) => sum + val, 0) / prices.length;
    }

}

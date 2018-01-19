import axios from 'axios';
import { Config, ConfigKeys } from '@config/config';
import { SetNames } from '../enums/set-names';
import { Item } from '../models/item';

const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);

export class WarframeMarketService {

    public static async GetPricesForSet(setName: SetNames): Promise<any> {
        const setResponse = await axios.get<ItemSetResult>(`${baseUrl}/items/${setName}/`);
        const items = setResponse.data;

        for (const item of items.payload.item.items_in_set) {
            if (!item.set_root) {
                const ordersResponse = await axios.get<OrdersResult>(`${baseUrl}/items/${item.url_name}/orders`);
                const orders = ordersResponse.data;
            }
        }

        return items;
    }

}

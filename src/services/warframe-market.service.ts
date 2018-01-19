import axios from 'axios';
import { Config, ConfigKeys } from '@config/config';
import { SetNames } from '../enums/set-names';

const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);

export class WarframeMarketService {

    public static async GetPricesForSet(setName: SetNames): Promise<any> {
        const response = await axios.get<ItemSetResult>(`${baseUrl}/items/${setName}/`);
        const items = response.data;
        return items;
    }
}

import Axios, { AxiosInstance, AxiosStatic } from 'axios';
import { Config, ConfigKeys } from '../config/config';
import { Item } from '../../shared/models/item';
import { injectable, inject } from 'inversify';

@injectable()
export class WarframeMarketService {

    private readonly http: AxiosInstance;

    constructor(@inject(Axios) axios: AxiosStatic) {
        const baseUrl = Config.get(ConfigKeys.WarframeMarketApiBaseUrl);
        this.http = axios.create({
            baseURL: `${baseUrl}/items`
        });
    }

    public async GetItemManifest(): Promise<ItemManifest[]> {
        return this.http.get<ItemManifestResult>('').then((manifestResult) => {
            if (manifestResult.status !== 200) {
                throw new Error(manifestResult.statusText);
            }

            const manifest = manifestResult.data;
            return manifest.payload.items.en;
        });
    }

    public async GetItemsInSet(setName: string): Promise<ItemInSet[]> {
        return this.http.get<ItemSetResult>(`/${setName}`).then((setResponse) => {
            if (setResponse.status !== 200) {
                throw new Error(setResponse.statusText);
            }

            const items = setResponse.data;
            return items.payload.item.items_in_set;
        });
    }

    public async GetItemStats(item: Item): Promise<ItemStatistic> {
        return this.http.get<ItemStatisticsResult>(`/${item.UrlName}/statistics`).then((statsResponse) => {
            if (statsResponse.status !== 200) {
                throw new Error(statsResponse.statusText);
            }

            const stats = statsResponse.data.payload.statistics['90days'];
            return stats.sort((a, b) => {
                const aDate = new Date(a.datetime);
                const bDate = new Date(b.datetime);
                return bDate.getTime() - aDate.getTime();
            })[0];
        });
    }

}

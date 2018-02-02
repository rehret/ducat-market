import { IPromise, IHttpService } from 'angular';
import { Item } from '../../shared/models/item';

export const DucatMarketServiceName = 'ducat-market.service';
export class DucatMarketService {
    public static $injects = [
        '$http'
    ];

    private static baseUrl = 'api';

    constructor(private $http: IHttpService) {}

    public GetItems(): IPromise<Item[]> {
        return this.$http.get<Item[]>(`${DucatMarketService.baseUrl}/items`)
            .then((response) => response.data.map((item) => {
                return new Item(item.Name, item.UrlName, item.Ducats, item.Price);
            }));
    }

    public GetTopItems(limit?: number): IPromise<Item[]> {
        return this.$http.get<Item[]>(`${DucatMarketService.baseUrl}/items/top/${limit ? limit : ''}`)
            .then((response) => response.data.map((item) => {
                return new Item(item.Name, item.UrlName, item.Ducats, item.Price);
            }));
    }
}

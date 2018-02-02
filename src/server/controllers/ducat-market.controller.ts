import { Controller, Get, Param } from 'routing-controllers';
import { injectable, inject } from 'inversify';
import { Item } from '../../shared/models/item';
import { DucatMarketService } from '../services/ducat-market.service';
import { ItemProvider } from '../services/item.provider';

@injectable()
@Controller('/api')
export class DucatMarketController {

    private itemProvider: ItemProvider;
    private ducatMarketService: DucatMarketService;

    constructor(
        @inject(ItemProvider) itemProvider: ItemProvider,
        @inject(DucatMarketService) ducatMarketService: DucatMarketService
    ) {
        this.itemProvider = itemProvider;
        this.ducatMarketService = ducatMarketService;
    }

    @Get('/items')
    public async GetItems(): Promise<Item[]> {
        return this.itemProvider.Items;
    }

    @Get('/items/top')
    public async GetTopItems(): Promise<Item[]> {
        return this.ducatMarketService.GetTopItems();
    }

    @Get('/items/top/:count')
    public async GetTopXItems(@Param('count') count: number): Promise<Item[]> {
        return this.ducatMarketService.GetTopItems(count);
    }

}

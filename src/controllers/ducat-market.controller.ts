import { Controller, Get, Param } from 'routing-controllers';
import { injectable } from 'inversify';
import { Item } from '../models/item';
import { DucatMarketService } from '../services/ducat-market.service';
import { ItemProvider } from '../services/item.provider';

@injectable()
@Controller('/api')
export class DucatMarketController {

    @Get('/items')
    public async GetItems(): Promise<Item[]> {
        return ItemProvider.GetItems();
    }

    @Get('/items/top')
    public async GetTopItems(): Promise<Item[]> {
        return DucatMarketService.GetTopItems();
    }

    @Get('/items/top/:count')
    public async GetTopXItems(@Param('count') count: number): Promise<Item[]> {
        return DucatMarketService.GetTopItems(count);
    }

}

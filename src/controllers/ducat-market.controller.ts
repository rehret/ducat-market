import { Controller, Get } from 'routing-controllers';
import { injectable } from 'inversify';
import { Item } from '../models/item';
import { DucatMarketService } from '../services/ducat-market.service';

@injectable()
@Controller('/api')
export class DucatMarketController {

    @Get('/')
    public async GetBestDeals(): Promise<Item[]> {
        return DucatMarketService.GetTopItems();
    }

}

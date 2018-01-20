import { DucatMarketService } from './services/ducat-market.service';

DucatMarketService.GetTopItems().then((topItems) => {
    console.log(topItems);
});

import { SetNames } from './enums/set-names';
import { WarframeMarketService } from './services/warframe-market.service';

for (const name of SetNames) {
    WarframeMarketService.GetPricesForSet(name).then((prices) => {
        console.log(prices);
    });
}

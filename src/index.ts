import { DucatMarketService } from './services/ducat-market.service';

function rightPad(str: string, length: number): string {
    let out = `${str}`;
    while (out.length !== length) {
        out += ' ';
    }
    return out;
}

DucatMarketService.GetTopItems().then((topItems) => {
    const maxItemNameLength = topItems.reduce((max, item) => item.Name.length > max ? item.Name.length : max, 0);
    topItems.forEach((item) => {
        // tslint:disable-next-line:max-line-length
        console.log(`${rightPad(`${item.Name},`, maxItemNameLength + 1)} Ducats: ${item.Ducats}, Plat: ${item.Price.toFixed(2)}, Ducats/Plat: ${item.DucatPlatRatio.toFixed(2)}`);
    });
});

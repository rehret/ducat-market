import * as readline from 'readline';
import { ItemService } from './item.service';
import { Item } from '../models/item';

export class DucatMarketService {
    public static async GetTopItems(limit: number = 5, printProgress: boolean = true): Promise<Item[]> {
        const items = await ItemService.GetItems((printProgress ? DucatMarketService.PrintProgress : undefined));
        return items
            .sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
            .slice(0, limit);
    }

    private static PrintProgress(current: number, total: number): void {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Fetching data: ${current} / ${total}`);

        if (current === total) {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            console.log(`Fetching data: done`);
        }
    }
}

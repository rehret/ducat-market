import { Item } from '../../shared/models/item';
import { ItemProvider } from './item.provider';
import { injectable, inject } from 'inversify';

@injectable()
export class DucatMarketService {
	private itemProvider: ItemProvider;

	constructor(@inject(ItemProvider) itemProvider: ItemProvider) {
		this.itemProvider = itemProvider;
	}

	public async GetTopItems(limit: number = 5): Promise<Item[]> {
		return (await this.itemProvider.Items)
			.sort((a, b) => b.DucatPlatRatio - a.DucatPlatRatio)
			.slice(0, limit);
	}
}

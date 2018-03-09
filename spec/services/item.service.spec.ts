import * as Bunyan from 'bunyan';
import { IMock, Mock, It, Times } from 'typemoq';
import { ItemService } from '../../src/server/services/item.service';
import { WarframeMarketService } from '../../src/server/services/warframe-market.service';
import { Item } from '../../src/shared/models/item';

describe('ItemService', () => {
	describe('GetItems()', () => {
		let warframeMock: IMock<WarframeMarketService>;
		let logMock: IMock<Bunyan>;

		beforeEach(() => {
			warframeMock = Mock.ofType<WarframeMarketService>();
			logMock = Mock.ofType<Bunyan>();

			warframeMock.setup((x) => x.GetItemManifest())
				.returns(() => require('../mock-data/item-manifest.json'));

			warframeMock.setup((x) => x.GetItemsInSet(It.isAnyString()))
				.returns(() => require('../mock-data/items-in-set.json'));

			warframeMock.setup((x) => x.GetItemStats(It.isAny()))
				.returns(() => require('../mock-data/item-statistic.json'));

			logMock.setup((x) => x.debug(It.isAnyString()));
		});

		it('should return an array of type Item', async () => {
			// Arrange
			const itemService = new ItemService(warframeMock.object, logMock.object);

			// Act
			const val = await itemService.GetItems();

			// Assert
			expect(Array.isArray(val));
			expect(val.length).toBeGreaterThan(0);
			expect(val[0] instanceof Item);
		});

		it('should call GetItemManifest once', async () => {
			// Arrange
			const itemService = new ItemService(warframeMock.object, logMock.object);

			// Act
			await itemService.GetItems();

			// Assert
			warframeMock.verify((x) => x.GetItemManifest(), Times.once());
		});

		it('should call GetItemsInSet once', async () => {
			// Arrange
			const itemService = new ItemService(warframeMock.object, logMock.object);

			// Act
			await itemService.GetItems();

			// Assert
			warframeMock.verify((x) => x.GetItemsInSet(It.isAnyString()), Times.once());
		});

		it('should call GetItemStats twice', async () => {
			// Arrange
			const itemService = new ItemService(warframeMock.object, logMock.object);

			// Act
			await itemService.GetItems();

			// Assert
			warframeMock.verify((x) => x.GetItemStats(It.isAny()), Times.exactly(2));
		});
	});
});

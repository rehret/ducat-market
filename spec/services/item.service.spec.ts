import * as Bunyan from 'bunyan';
import { IMock, Mock, It, Times } from 'typemoq';
import { ItemService } from '../../src/services/item.service';
import { WarframeMarketService } from '../../src/services/warframe-market.service';
import { Item } from '../../src/models/item';

describe('ItemService', () => {
    describe('GetItems()', () => {
        let warframeMock: IMock<WarframeMarketService>;
        let logMock: IMock<Bunyan>;
        let itemService: ItemService;

        beforeEach(() => {
            warframeMock = Mock.ofType<WarframeMarketService>();
            logMock = Mock.ofType<Bunyan>();
            itemService = new ItemService(warframeMock.object, logMock.object);

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
            // Act
            const val = await itemService.GetItems();

            // Assert
            expect(Array.isArray(val));
            expect(val.length > 0);
            expect(val[0] instanceof Item);
        });

        it('should call GetItemManifest once', async () => {
            // Arrange
            // Act
            await itemService.GetItems();

            // Assert
            warframeMock.verify((x) => x.GetItemManifest(), Times.once());
        });

        it('should call GetItemsInSet once', async () => {
            // Arrange
            // Act
            await itemService.GetItems();

            // Assert
            warframeMock.verify((x) => x.GetItemsInSet(It.isAnyString()), Times.once());
        });

        it('should call GetItemStats twice', async () => {
            // Arrange
            // Act
            await itemService.GetItems();

            // Assert
            warframeMock.verify((x) => x.GetItemStats(It.isAny()), Times.exactly(2));
        });
    });
});
import { IMock, Mock, It, Times } from 'typemoq';
import * as Bunyan from 'bunyan';
import { ItemProvider } from '../../src/services/item.provider';
import { ItemCacheService } from '../../src/services/item-cache.service';
import { ItemService } from '../../src/services/item.service';
import { Item } from '../../src/models/item';
import { Config, ConfigKeys } from '../../src/config/config';

describe('ItemProvider', () => {
    let itemCacheServiceMock: IMock<ItemCacheService>;
    let itemServiceMock: IMock<ItemService>;
    let logMock: IMock<Bunyan>;

    beforeEach(() => {
        itemCacheServiceMock = Mock.ofType<ItemCacheService>();
        itemServiceMock = Mock.ofType<ItemService>();
        logMock = Mock.ofType<Bunyan>();

        itemCacheServiceMock.setup((x) => x.GetItemsCache()).returns(() => {
            return new Promise((resolve) => {
                resolve([
                    new Item('Soma Prime Barrel', 'soma_prime_barrel', 45, 3),
                    new Item('Soma Prime Stock', 'soma_prime_stock', 30, 1),
                    new Item('Soma Prime Receiver', 'soma_prime_receiver', 30, 8),
                    new Item('Soma Prime Blueprint', 'soma_prime_blueprint', 15, 3),
                    new Item('Valkyr Prime Neuroptics', 'valkyr_prime_neuroptics', 45, 5),
                    new Item('Valkyr Prime Chassis', 'valkyr_prime_chassis', 30, 4),
                    new Item('Valkyr Prime Systems', 'valkyr_prime_systems', 30, 3),
                    new Item('Valkyr Prime Blueprint', 'valkyr_prime_blueprint', 15, 3)
                ]);
            });
        });

        itemServiceMock.setup((x) => x.GetItems()).returns(() => {
            return new Promise((resolve) => {
                resolve([
                    new Item('Soma Prime Barrel', 'soma_prime_barrel', 45, 3),
                    new Item('Soma Prime Stock', 'soma_prime_stock', 30, 1),
                    new Item('Soma Prime Receiver', 'soma_prime_receiver', 30, 8),
                    new Item('Soma Prime Blueprint', 'soma_prime_blueprint', 15, 3),
                    new Item('Valkyr Prime Neuroptics', 'valkyr_prime_neuroptics', 45, 5),
                    new Item('Valkyr Prime Chassis', 'valkyr_prime_chassis', 30, 4),
                    new Item('Valkyr Prime Systems', 'valkyr_prime_systems', 30, 3),
                    new Item('Valkyr Prime Blueprint', 'valkyr_prime_blueprint', 15, 3)
                ]);
            });
        });
    });

    describe('constructor', () => {
        it('should check if the items are cached', async () => {
            // Arrange
            spyOn(global, 'setInterval').and.callFake(() => null);

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Assert
            itemCacheServiceMock.verify((x) => x.HasCache(), Times.once());
        });

        it('should load items from the cache if the cache exists', async () => {
            // Arrange
            itemCacheServiceMock.setup((x) => x.HasCache()).returns(() => true);
            spyOn(global, 'setInterval').and.callFake(() => null);

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Assert
            itemCacheServiceMock.verify((x) => x.GetItemsCache(), Times.once());
        });

        it('should load items from ItemService if cache does not exist', async () => {
            // Arrange
            itemCacheServiceMock.setup((x) => x.HasCache()).returns(() => false);
            spyOn(global, 'setInterval').and.callFake(() => null);

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Assert
            itemServiceMock.verify((x) => x.GetItems(), Times.once());
        });

        it('should cache items from ItemService if cache does not exist', async () => {
            // Arrange
            itemCacheServiceMock.setup((x) => x.HasCache()).returns(() => false);
            spyOn(global, 'setInterval').and.callFake(() => null);

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Assert
            itemCacheServiceMock.verify((x) => x.CacheItems(It.isAny()), Times.once());
        });

        it('should set an interval for fetching new items', async () => {
            // Arrange
            let intervalTime = 0;
            spyOn(global, 'setInterval').and.callFake((fn: () => void, interval: number) => {
                fn;
                intervalTime = interval;
            });

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Assert
            expect(intervalTime).toBe(Config.get(ConfigKeys.CacheTTL));
        });

        it('should fetch updated items after the interval timeout', async () => {
            // Arrange
            let intervalFn = () => null;
            spyOn(global, 'setInterval').and.callFake((fn: () => null) => {
                intervalFn = fn;
            });

            // Act
            await new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            await intervalFn();

            // Assert
            itemServiceMock.verify((x) => x.GetItems(), Times.exactly(2));
            itemCacheServiceMock.verify((x) => x.CacheItems(It.isAny()), Times.exactly(2));
        });
    });

    describe('Items', () => {
        it('should return an array of type Item', async () => {
            // Arrange
            itemCacheServiceMock.setup((x) => x.HasCache()).returns(() => true);
            spyOn(global, 'setInterval').and.callFake(() => null);
            const itemProvider = new ItemProvider(
                itemCacheServiceMock.object,
                itemServiceMock.object,
                logMock.object
            );

            // Act
            const val = await itemProvider.Items;

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBeGreaterThan(0);
            val.forEach((item) => expect(item instanceof Item));
        });
    });
});

import { Mock, It, Times } from 'typemoq';
import * as fs from 'fs';
import * as Bunyan from 'bunyan';
import { ItemCacheService } from '../../src/services/item-cache.service';
import { Item } from '../../src/models/item';

describe('ItemCacheService', () => {
    describe('CacheItems', () => {
        it('should call fs.writeFile()', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            const writeFileSpy = spyOn(fs, 'writeFile').and.returnValue(null);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            await itemCacheService.CacheItems([]);

            // Assert
            expect(writeFileSpy.calls.count()).toBe(1);
        });

        it('should call Bunyan.info() when successful', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            const writeFileSpy = spyOn(fs, 'writeFile').and.returnValue(null);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            await itemCacheService.CacheItems([]);
            writeFileSpy.calls.mostRecent().args[3]();

            // Assert
            logMock.verify((x) => x.info(It.isAnyString()), Times.once());
        });

        it('should call Bunyan.error() when unsuccessful', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            const writeFileSpy = spyOn(fs, 'writeFile').and.returnValue(null);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            await itemCacheService.CacheItems([]);
            writeFileSpy.calls.mostRecent().args[3]({err: 'Some error'});

            // Assert
            logMock.verify((x) => x.error(It.isAny(), It.isAnyString()), Times.once());
        });
    });

    describe('GetItemsCache', () => {
        let readFileSpy: any;
        beforeEach(() => {
            readFileSpy = spyOn(fs, 'readFile')
                .and.callFake((...args: any[]) => {
                    const [, , callback] = args;
                    callback(null, JSON.stringify([
                        new Item('Soma Prime Barrel', 'soma_prime_barrel', 45, 3),
                        new Item('Soma Prime Stock', 'soma_prime_stock', 30, 1),
                        new Item('Soma Prime Receiver', 'soma_prime_receiver', 30, 8),
                        new Item('Soma Prime Blueprint', 'soma_prime_blueprint', 15, 3),
                        new Item('Valkyr Prime Neuroptics', 'valkyr_prime_neuroptics', 45, 5),
                        new Item('Valkyr Prime Chassis', 'valkyr_prime_chassis', 30, 4),
                        new Item('Valkyr Prime Systems', 'valkyr_prime_systems', 30, 3),
                        new Item('Valkyr Prime Blueprint', 'valkyr_prime_blueprint', 15, 3)
                    ]));
                });
        });

        it('should return an array of type Item', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(true);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            const val = await itemCacheService.GetItemsCache();

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBeGreaterThan(0);
            val.forEach((item) => expect(item instanceof Item));
        });

        it('should return an empty array if cache doens\'t exist', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(false);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            const val = await itemCacheService.GetItemsCache();

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBe(0);
        });

        it('should call Bunyan.error() if it failed to read the item cache', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(true);
            readFileSpy.and.callFake((...args: any[]) => {
                const [, , callback] = args;
                callback({err: true}, null);
            });
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            await itemCacheService.GetItemsCache().catch(() => null);

            // Assert
            logMock.verify((x) => x.error(It.isAny(), It.isAnyString()), Times.once());
        });

        it('should call Bunyan.info() if cache was loaded successfully', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(true);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            await itemCacheService.GetItemsCache();

            // Assert
            logMock.verify((x) => x.info(It.isAnyString()), Times.once());
        });

        it('should throw an exception if it failed to read the item cache', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(true);
            readFileSpy.and.callFake((...args: any[]) => {
                const [, , callback] = args;
                callback({err: true}, null);
            });
            const itemCacheService = new ItemCacheService(logMock.object);
            let errorThrown = false;

            // Act
            await itemCacheService.GetItemsCache().catch(() => errorThrown = true);

            // Assert
            expect(errorThrown).toBeTruthy();
        });
    });

    describe('HasCache', () => {
        it('should return true if file exists', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(true);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            const hasCache = itemCacheService.HasCache();

            // Assert
            expect(hasCache).toBeTruthy();
        });

        it('should return false if file doesn\'t exist', async () => {
            // Arrange
            const logMock = Mock.ofType<Bunyan>();
            spyOn(fs, 'existsSync').and.returnValue(false);
            const itemCacheService = new ItemCacheService(logMock.object);

            // Act
            const hasCache = itemCacheService.HasCache();

            // Assert
            expect(hasCache).toBeFalsy();
        });
    });
});

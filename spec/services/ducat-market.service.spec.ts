import { IMock, Mock } from 'typemoq';
import { DucatMarketService } from '../../src/server/services/ducat-market.service';
import { Item } from '../../src/shared/models/item';
import { ItemProvider } from '../../src/server/services/item.provider';

describe('DucatMarketService', () => {
    describe('GetTopItems', () => {
        let itemProviderMock: IMock<ItemProvider>;

        beforeEach(() => {
            itemProviderMock = Mock.ofType<ItemProvider>();
            itemProviderMock.setup((x) => x.Items).returns(() => {
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

        it('should return an array of type Item', async () => {
            // Arrange
            const ducatMarketService = new DucatMarketService(itemProviderMock.object);

            // Act
            const val = await ducatMarketService.GetTopItems();

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBeGreaterThan(0);
            val.forEach((item) => expect(item instanceof Item));
        });

        it('should return the number of items specified by the "limit" parameter', async () => {
            // Arrange
            const ducatMarketService = new DucatMarketService(itemProviderMock.object);
            const limit = 7;

            // Act
            const val = await ducatMarketService.GetTopItems(limit);

            // Assert
            expect(val.length).toBe(limit);
        });

        it('should return five items if the "limit" parameter is not provided', async () => {
            // Arrange
            const ducatMarketService = new DucatMarketService(itemProviderMock.object);

            // Act
            const val = await ducatMarketService.GetTopItems();

            // Assert
            expect(val.length).toBe(5);
        });

        it('should sort the returned array of Items from greatest to least by DucatsToPlatRatio', async () => {
            // Arrange
            const ducatMarketService = new DucatMarketService(itemProviderMock.object);

            // Act
            const val = await ducatMarketService.GetTopItems();
            let sorted = true;
            for(let i = 0; i < val.length - 1 && sorted; i++) {
                if (val[i].DucatPlatRatio < val[i + 1].DucatPlatRatio) {
                    sorted = false;
                }
            }

            // Assert
            expect(sorted).toBeTruthy();
        });
    });
});

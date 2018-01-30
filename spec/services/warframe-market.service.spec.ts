import { IMock, Mock, It, Times } from 'typemoq';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { WarframeMarketService } from '../../src/server/services/warframe-market.service';
import { Config, ConfigKeys } from '../../src/server/config/config';
import { Item } from '../../src/server/models/item';

describe('WarframeMarketService', () => {
    describe('constructor', () => {
        it('should call AxiosStatic.create() once', () => {
            // Arrange
            const axiosMock = Mock.ofType<AxiosStatic>();
            axiosMock.setup((x) => x.create(It.isAny()));

            // Act
            new WarframeMarketService(axiosMock.object);

            // Assert
            axiosMock.verify((x) => x.create(It.isAny()), Times.once());
        });

        it('should call AxiosStatic.create() with the base url stored in the config', () => {
            // Arrange
            const axiosMock = Mock.ofType<AxiosStatic>();
            axiosMock.setup((x) => x.create(It.isAny()));

            // Act
            new WarframeMarketService(axiosMock.object);

            // Assert
            axiosMock.verify((x) => {
                return x.create(It.is((obj) => {
                    // tslint:disable-next-line:max-line-length
                    return typeof obj !== 'undefined' && obj.baseURL === `${Config.get(ConfigKeys.WarframeMarketApiBaseUrl)}/items`;
                }));
            }, Times.atLeastOnce());
        });
    });

    describe('GetItemManifest', () => {
        let axiosMock: IMock<AxiosStatic>;
        let axiosInstanceMock: IMock<AxiosInstance>;

        beforeEach(() => {
            axiosMock = Mock.ofType<AxiosStatic>();
            axiosInstanceMock = Mock.ofType<AxiosInstance>();
            axiosMock.setup((x) => x.create(It.isAny())).returns(() => axiosInstanceMock.object);
            axiosInstanceMock.setup((x) => x.get(It.isAnyString()))
                .returns(async () => {
                    return {
                        status: 200,
                        statusText: '',
                        data: {
                            payload: {
                                items: {
                                    en: require('../mock-data/item-manifest.json')
                                }
                            }
                        } as ItemManifestResult
                    } as AxiosResponse;
                });
        });

        it('should return an array of type ItemManifest', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            const val = await warframeMarketService.GetItemManifest();

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBeGreaterThan(0);
            val.forEach((itemManifest) => {
                const itemManifestProperties = Object.getOwnPropertyNames(itemManifest);
                expect(itemManifestProperties.includes('id'));
                expect(itemManifestProperties.includes('item_name'));
                expect(itemManifestProperties.includes('url_name'));
            });
        });

        it('should call AxiosInstance.get() once', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            await warframeMarketService.GetItemManifest();

            // Assert
            axiosInstanceMock.verify((x) => x.get(It.isAnyString()), Times.once());
        });
    });

    describe('GetItemsInSet', () => {
        let axiosMock: IMock<AxiosStatic>;
        let axiosInstanceMock: IMock<AxiosInstance>;

        beforeEach(() => {
            axiosMock = Mock.ofType<AxiosStatic>();
            axiosInstanceMock = Mock.ofType<AxiosInstance>();
            axiosMock.setup((x) => x.create(It.isAny())).returns(() => axiosInstanceMock.object);
            axiosInstanceMock.setup((x) => x.get(It.isAnyString()))
                .returns(async () => {
                    return {
                        status: 200,
                        statusText: '',
                        data: {
                            payload: {
                                item: {
                                    id: 'asdf',
                                    items_in_set: require('../mock-data/items-in-set.json')
                                }
                            }
                        } as ItemSetResult
                    } as AxiosResponse;
                });
        });

        it('should return an array of type ItemInSet', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            const val = await warframeMarketService.GetItemsInSet('soma_prime_set');

            // Assert
            expect(Array.isArray(val));
            expect(val.length).toBeGreaterThan(0);
            val.forEach((itemInSet) => {
                const itemInSetProperties = Object.getOwnPropertyNames(itemInSet);
                expect(itemInSetProperties.includes('en'));
                expect(Object.getOwnPropertyNames(itemInSet.en).includes('item_name'));
                expect(itemInSetProperties.includes('url_name'));
                expect(itemInSetProperties.includes('ducats'));
                expect(itemInSetProperties.includes('set_root'));
            });
        });

        it('should call AxiosInstance.get() once', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            await warframeMarketService.GetItemsInSet('soma_prime_set');

            // Assert
            axiosInstanceMock.verify((x) => x.get(It.isAnyString()), Times.once());
        });
    });

    describe('GetItemStats', () => {
        let axiosMock: IMock<AxiosStatic>;
        let axiosInstanceMock: IMock<AxiosInstance>;

        beforeEach(() => {
            axiosMock = Mock.ofType<AxiosStatic>();
            axiosInstanceMock = Mock.ofType<AxiosInstance>();
            axiosMock.setup((x) => x.create(It.isAny())).returns(() => axiosInstanceMock.object);
            axiosInstanceMock.setup((x) => x.get(It.isAnyString()))
                .returns(async () =>  {
                    return {
                        status: 200,
                        statusText: '',
                        data: {
                            payload: {
                                statistics: {
                                    '48hours': [],
                                    '90days': [
                                        require('../mock-data/item-statistic.json')
                                    ]
                                }
                            }
                        } as ItemStatisticsResult
                    } as AxiosResponse;
                });
        });

        it('should return an array of type ItemStatistic', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            const val = await warframeMarketService.GetItemStats(new Item('Soma Prime Barrel', 'soma_prime_barrel'));

            // Assert
            expect(!Array.isArray(val));
            const itemStatProperties = Object.getOwnPropertyNames(val);
            expect(itemStatProperties.includes('min_price'));
            expect(itemStatProperties.includes('open_price'));
            expect(itemStatProperties.includes('avg_price'));
            expect(itemStatProperties.includes('id'));
            expect(itemStatProperties.includes('median'));
            expect(itemStatProperties.includes('max_price'));
            expect(itemStatProperties.includes('datetime'));
            expect(itemStatProperties.includes('volume'));
            expect(itemStatProperties.includes('closed_price'));
            expect(itemStatProperties.includes('donch_top'));
            expect(itemStatProperties.includes('donch_bot'));
        });

        it('should call AxiosInstance.get() once', async () => {
            // Arrange
            const warframeMarketService = new WarframeMarketService(axiosMock.object);

            // Act
            await warframeMarketService.GetItemStats(new Item('Soma Prime Barrel', 'soma_prime_barrel'));

            // Assert
            axiosInstanceMock.verify((x) => x.get(It.isAnyString()), Times.once());
        });
    });
});

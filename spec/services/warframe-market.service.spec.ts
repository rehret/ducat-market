import { IMock, Mock, It, Times } from 'typemoq';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { WarframeMarketService } from '../../src/services/warframe-market.service';

describe('WarframeMarketService', () => {
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
            expect(val.length > 0);
            const itemManifest = val[0];
            expect(Object.getOwnPropertyNames(itemManifest).includes('id'));
            expect(Object.getOwnPropertyNames(itemManifest).includes('item_name'));
            expect(Object.getOwnPropertyNames(itemManifest).includes('url_name'));
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
});

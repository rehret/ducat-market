import { IMock, Mock, It, Times } from 'typemoq';
import { expect } from 'chai';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { WarframeMarketService } from '../../src/server/services/warframe-market.service';
import { Config, ConfigKeys } from '../../src/server/config/config';
import { Item } from '../../src/shared/models/item';

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
			expect(val).to.be.an('array').and.have.length.greaterThan(0);
			val.forEach((itemManifest) => {
				expect(itemManifest).to.have.property('id').that.is.a('string');
				expect(itemManifest).to.have.property('item_name').that.is.a('string');
				expect(itemManifest).to.have.property('url_name').that.is.a('string');
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
			expect(val).to.be.an('array').with.length.greaterThan(0);
			val.forEach((itemInSet) => {
				expect(itemInSet).to.have.property('en').that.is.an('object');
				expect(itemInSet.en).to.have.property('item_name').that.is.a('string');
				expect(itemInSet).to.have.property('url_name').that.is.a('string');
				expect(itemInSet).to.have.property('ducats').that.is.a('number');
				expect(itemInSet).to.have.property('set_root').that.is.a('boolean');
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
				.returns(async () => {
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
			expect(val).to.have.property('min_price').that.is.a('number');
			expect(val).to.have.property('open_price').that.is.a('number');
			expect(val).to.have.property('avg_price').that.is.a('number');
			expect(val).to.have.property('id').that.is.a('string');
			expect(val).to.have.property('median').that.is.a('number');
			expect(val).to.have.property('max_price').that.is.a('number');
			expect(val).to.have.property('datetime').that.is.a('string');
			expect(val).to.have.property('volume').that.is.a('number');
			expect(val).to.have.property('closed_price').that.is.a('number');
			expect(val).to.have.property('donch_top').that.is.a('number');
			expect(val).to.have.property('donch_bot').that.is.a('number');
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

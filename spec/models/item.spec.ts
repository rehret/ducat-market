import { Item } from '../../src/shared/models/item';

describe('Item', () => {
	describe('model', () => {
		it('should have correct properties', () => {
			// Arrange
			const item = new Item('Soma Prime Barrel', 'soma_prime_barrel', 45, 1);

			// Assert
			const itemProperties = Object.getOwnPropertyNames(item);
			expect(itemProperties.length).toBe(5);
			expect(itemProperties.includes('Name'));
			expect(itemProperties.includes('UrlName'));
			expect(itemProperties.includes('Price'));
			expect(itemProperties.includes('Ducats'));
			expect(itemProperties.includes('IconPath'));
		});
	});

	describe('DucatPlatRatio', () => {
		it('should return the value Item.Ducats / Item.Price', () => {
			// Arrange
			const ducats = 45;
			const price = 1;
			const item = new Item('Soma Prime Barrel', 'soma_prime_barrel', ducats, price);

			// Act
			const ducatPlatRatio = item.DucatPlatRatio;

			// Assert
			expect(ducatPlatRatio).toBe(ducats / price);
		});
	});
});

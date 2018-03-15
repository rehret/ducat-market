import { expect } from 'chai';
import { Item } from '../../src/shared/models/item';

describe('Item', () => {
	describe('model', () => {
		it('should have correct properties', () => {
			// Arrange
			const item = new Item('Soma Prime Barrel', 'soma_prime_barrel', 45, 1);

			// Assert
			const itemProperties = Object.getOwnPropertyNames(item);
			expect(itemProperties).to.have.length(5);
			expect(item).to.have.property('Name').that.is.a('string');
			expect(item).to.have.property('UrlName').that.is.a('string');
			expect(item).to.have.property('Price').that.is.a('number');
			expect(item).to.have.property('Ducats').that.is.a('number');
			expect(item).to.have.property('IconPath').that.is.a('string');
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
			expect(ducatPlatRatio).to.equal(ducats / price);
		});
	});
});

export class Item {
    public Name: string;
    public Price: number;
    public Ducats: number;

    public get DucatPlatRatio(): number {
        return this.Ducats / this.Price;
    }

    constructor(name: string, price: number, ducats: number) {
        this.Name = name;
        this.Price = price;
        this.Ducats = ducats;
    }
}

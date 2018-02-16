export class Item {
	public Name: string;
	public UrlName: string;
	public Price: number;
	public Ducats: number;
	public IconPath: string;

	public get DucatPlatRatio(): number {
		return this.Ducats / this.Price;
	}

	constructor(name: string, urlName: string, ducats: number = 0, price: number = 0, iconPath: string = '') {
		this.Name = name;
		this.UrlName = urlName;
		this.Ducats = ducats;
		this.Price = price;
		this.IconPath = iconPath;
	}
}

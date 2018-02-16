declare type ItemStatistic = {
	min_price: number;
	open_price: number;
	avg_price: number;
	id: string;
	median: number;
	max_price: number;
	datetime: string;
	volume: number;
	closed_price: number;
	donch_top: number;
	donch_bot: number;
}

declare type ItemStatisticsResult = {
	payload: {
		statistics: {
			'90days': ItemStatistic[];
			'48hours': ItemStatistic[];
		}
	}
}

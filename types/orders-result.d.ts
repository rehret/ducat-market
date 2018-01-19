declare type OrdersResult = {
    payload: {
        orders: {
            order_type: 'buy' | 'sell',
            platinum: number,
            user: {
                status: 'offline' | 'online' | 'ingame',
                last_seen: string
            }
        }[]
    }
}
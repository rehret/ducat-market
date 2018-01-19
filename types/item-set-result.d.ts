declare type ItemSetResult = {
    payload: {
        item: {
            id: string,
            items_in_set: Array<{
                en: {
                    item_name: string,
                },
                url_name: string,
                ducats: number,
                set_root: boolean
            }>
        }
    }
}
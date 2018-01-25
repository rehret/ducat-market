declare type ItemManifest = {
    url_name: string
    id: string
    item_name: string
};

declare type ItemManifestResult = {
    payload: {
        items: {
            en: ItemManifest[]
        }
    }
};

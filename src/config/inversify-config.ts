import { Container as InversifyContainer } from 'inversify';
import * as Bunyan from 'bunyan';
import Axios, { AxiosStatic } from 'axios';
import { Log } from '../log';
import { RequestId } from '../middleware/request-id';
import { ErrorLogger } from '../middleware/error-logger';
import { RequestLogger } from '../middleware/request-logger';
import { DucatMarketController } from '../controllers/ducat-market.controller';
import { DucatMarketService } from '../services/ducat-market.service';
import { ItemCacheService } from '../services/item-cache.service';
import { ItemProvider } from '../services/item.provider';
import { ItemService } from '../services/item.service';
import { WarframeMarketService } from '../services/warframe-market.service';

export const Container = new InversifyContainer();

// Axios
Container.bind<AxiosStatic>(Axios).toConstantValue(Axios);

// Logger
Container.bind<Bunyan>(Bunyan).toConstantValue(Log);

// Middleware
Container.bind<RequestId>(RequestId).toSelf();
Container.bind<ErrorLogger>(ErrorLogger).toSelf();
Container.bind<RequestLogger>(RequestLogger).toSelf();

// Controllers
Container.bind<DucatMarketController>(DucatMarketController).toSelf();

// Services
Container.bind<DucatMarketService>(DucatMarketService).toSelf();
Container.bind<ItemCacheService>(ItemCacheService).toSelf();
Container.bind<ItemService>(ItemService).toSelf();
Container.bind<WarframeMarketService>(WarframeMarketService).toSelf();

// Instantiate ItemProvider at config-time to begin prefetching items
Container.bind<ItemProvider>(ItemProvider).toConstantValue(
    new ItemProvider(
        Container.resolve<ItemCacheService>(ItemCacheService),
        Container.resolve<ItemService>(ItemService)
    )
);

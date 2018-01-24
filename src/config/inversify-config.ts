import { Container as InversifyContainer } from 'inversify';
import * as Bunyan from 'bunyan';
import { Log } from '../log';
import { RequestId } from '../middleware/request-id';
import { ErrorLogger } from '../middleware/error-logger';
import { RequestLogger } from '../middleware/request-logger';
import { DucatMarketController } from '../controllers/ducat-market.controller';

export const Container = new InversifyContainer();

// Logger
Container.bind<Bunyan>(Bunyan).toConstantValue(Log);

// Middleware
Container.bind<RequestId>(RequestId).toSelf();
Container.bind<ErrorLogger>(ErrorLogger).toSelf();
Container.bind<RequestLogger>(RequestLogger).toSelf();

// Controllers
Container.bind<DucatMarketController>(DucatMarketController).toSelf();

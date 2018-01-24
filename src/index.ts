import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { Container } from './config/inversify-config';
import { Config, ConfigKeys } from './config/config';
import { DucatMarketService } from './services/ducat-market.service';
import { Log } from './log';

DucatMarketService.Init();

useContainer(Container);

const app = createKoaServer({
    controllers: [`${__dirname}/controllers/*.[tj]s`],
    middlewares: [`${__dirname}/middleware/*.[tj]s`],
    defaultErrorHandler: false
});

const port = Config.get(ConfigKeys.Port);
app.listen(port, () => {
    Log.info(`Listening on :${port}`);
});

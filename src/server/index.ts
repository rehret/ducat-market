import 'reflect-metadata';
import * as path from 'path';
import { createKoaServer, useContainer } from 'routing-controllers';
import * as KoaStatic from 'koa-static';
import { Container } from './config/inversify-config';
import { Config, ConfigKeys } from './config/config';
import { Log } from './log';

useContainer(Container);

const app = createKoaServer({
    controllers: [`${__dirname}/controllers/*.[tj]s`],
    middlewares: [`${__dirname}/middleware/*.[tj]s`],
    defaultErrorHandler: false
});

app.use(KoaStatic(path.resolve(__dirname, Config.get(ConfigKeys.ClientPath))));

const port = Config.get(ConfigKeys.Port);
app.listen(port, () => {
    Log.info(`Listening on :${port}`);
});

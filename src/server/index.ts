import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import { useKoaServer, useContainer } from 'routing-controllers';
import * as Koa from 'koa';
import * as KoaStatic from 'koa-static';
import { ui } from 'swagger2-koa';
import { Container } from './config/inversify-config';
import { Config, ConfigKeys } from './config/config';
import { Log } from './log';

useContainer(Container);

const app = new Koa();

const swaggerDoc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../openapi.json'), 'utf-8'));
app.use(ui(swaggerDoc, '/api/docs'));

useKoaServer(app, {
    controllers: [`${__dirname}/controllers/*.[tj]s`],
    middlewares: [`${__dirname}/middleware/*.[tj]s`],
    defaultErrorHandler: false
});

app.use(KoaStatic(path.resolve(__dirname, Config.get(ConfigKeys.ClientPath))));

const port = Config.get(ConfigKeys.Port);
app.listen(port, () => {
    Log.info(`Listening on :${port}`);
});

import * as nconf from 'nconf';
import * as path from 'path';
import { ConfigKeys } from './keys';

const env = process.env.NODE_ENV || 'development';

nconf
    .argv()
    .env()
    .file('environmentConfig', path.resolve(__dirname, `${env}.json`))
    .file('defaultConfig', path.resolve(__dirname, 'default.json'))
    .required([ConfigKeys.WarframeMarketApiBaseUrl]);

export { nconf as Config, ConfigKeys };

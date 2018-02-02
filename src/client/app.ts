import * as angular from 'angular';
import { DucatMarketDirective, DucatMarketDirectiveName } from './controllers/ducat-market.controller';
import { DucatMarketService, DucatMarketServiceName } from './services/ducat-market.service';

angular.module('ducat-market', [])
    .service(DucatMarketServiceName, DucatMarketService)
    .directive(DucatMarketDirectiveName, DucatMarketDirective);

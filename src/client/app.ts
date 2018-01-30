import * as angular from 'angular';
import {
    DucatMarketDirective,
    DucatMarketDirectiveName
} from './controllers/ducat-market.controller';

angular.module('ducat-market', [])
    .directive(DucatMarketDirectiveName, DucatMarketDirective);

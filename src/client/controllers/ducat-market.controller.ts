import { IController, IScope, IDirective } from 'angular';
import DucatMarketTemplate from '../templates/ducat-market.template.html';

export interface IDucatMarketCtrlScope extends IScope {
    message: string;
}

export const DucatMarketCtrlName = 'ducat-market-controller';
export class DucatMarketCtrl implements IController {
    public static $inject = [
        '$scope'
    ];

    constructor(private $scope: IDucatMarketCtrlScope) {
        this.$scope.message = 'Hello, World!';
    }
}

export const DucatMarketDirectiveName = 'ducatMarket';
export function DucatMarketDirective(): IDirective {
    return {
        restrict: 'E',
        controller: DucatMarketCtrl,
        template: DucatMarketTemplate
    };
}

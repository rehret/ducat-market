import { IController, IScope, IDirective } from 'angular';
import DucatMarketTemplate from '../templates/ducat-market.template.html';
import { Item } from '../models/item';
import { DucatMarketService, DucatMarketServiceName } from '../services/ducat-market.service';

export interface IDucatMarketCtrlScope extends IScope {
    items: Item[];
}

export const DucatMarketCtrlName = 'ducat-market-controller';
export class DucatMarketCtrl implements IController {
    public static $inject = [
        '$scope',
        DucatMarketServiceName
    ];

    constructor(private $scope: IDucatMarketCtrlScope, private ducatMarketService: DucatMarketService) {}

    public $onInit() {
        this.ducatMarketService.GetTopItems()
            .then((items) => this.$scope.items = items);
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

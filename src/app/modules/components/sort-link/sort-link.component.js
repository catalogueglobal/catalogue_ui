"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var SortLinkComponent = (function () {
    function SortLinkComponent(utils) {
        this.utils = utils;
        this.valueChange = new core_1.EventEmitter();
        this.nextOrder = this.defaultOrder;
    }
    Object.defineProperty(SortLinkComponent.prototype, "value", {
        set: function (value) {
            this._value = value;
            this.nextOrder = this.computeNextOrder();
        },
        enumerable: true,
        configurable: true
    });
    SortLinkComponent.prototype.ngOnInit = function () {
    };
    SortLinkComponent.prototype.computeNextOrder = function () {
        if (this._value.sort !== this.sortValue) {
            return this.defaultOrder;
        }
        else {
            return this.utils.toggleOrder(this._value.order);
        }
    };
    SortLinkComponent.prototype.clicked = function () {
        var nextValue = {
            sort: this.sortValue,
            order: this.nextOrder
        };
        this._value = nextValue;
        this.valueChange.emit(nextValue);
    };
    return SortLinkComponent;
}());
__decorate([
    core_1.Input()
], SortLinkComponent.prototype, "sortValue");
__decorate([
    core_1.Input()
], SortLinkComponent.prototype, "defaultOrder");
__decorate([
    core_1.Output()
], SortLinkComponent.prototype, "valueChange");
__decorate([
    core_1.Input()
], SortLinkComponent.prototype, "value");
SortLinkComponent = __decorate([
    core_1.Component({
        selector: 'app-sort-link',
        templateUrl: 'sort-link.component.html'
    })
], SortLinkComponent);
exports.SortLinkComponent = SortLinkComponent;

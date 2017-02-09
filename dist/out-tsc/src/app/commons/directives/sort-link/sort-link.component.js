var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { UtilsService } from "../../services/utils.service";
export var SortLinkComponent = (function () {
    function SortLinkComponent(utils) {
        this.utils = utils;
        this.valueChange = new EventEmitter();
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
        if (this._value.sort != this.sortValue) {
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
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], SortLinkComponent.prototype, "sortValue", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], SortLinkComponent.prototype, "defaultOrder", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], SortLinkComponent.prototype, "valueChange", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], SortLinkComponent.prototype, "value", null);
    SortLinkComponent = __decorate([
        Component({
            selector: 'app-sort-link',
            templateUrl: 'sort-link.component.html'
        }), 
        __metadata('design:paramtypes', [UtilsService])
    ], SortLinkComponent);
    return SortLinkComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/sort-link/sort-link.component.js.map
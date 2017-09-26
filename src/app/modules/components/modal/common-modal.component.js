"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var modal_component_1 = require("./modal.component");
var CommonComponent = (function () {
    function CommonComponent() {
    }
    CommonComponent.prototype.hide = function () {
        this.modal.hide();
    };
    CommonComponent.prototype.show = function () {
        this.modal.show();
    };
    return CommonComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent)
], CommonComponent.prototype, "modal");
CommonComponent = __decorate([
    core_1.Component({
        templateUrl: 'modal.html'
    })
], CommonComponent);
exports.CommonComponent = CommonComponent;

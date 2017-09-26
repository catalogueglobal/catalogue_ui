"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// inspired from https://github.com/WoltersKluwerPL/ng2-spin-kit/blob/master/app/spinner/three-bounce/three-bounce.ts
var core_1 = require("@angular/core");
var SpinnerComponent = (function () {
    function SpinnerComponent() {
        this.visible = true;
        this.delay = 0;
    }
    Object.defineProperty(SpinnerComponent.prototype, "isRunning", {
        set: function (value) {
            var _this = this;
            if (!value) {
                this.cancel();
                this.visible = false;
            }
            if (this.timeout) {
                return;
            }
            this.timeout = setTimeout(function () {
                _this.visible = true;
                _this.cancel();
            }, this.delay);
        },
        enumerable: true,
        configurable: true
    });
    SpinnerComponent.prototype.cancel = function () {
        clearTimeout(this.timeout);
        this.timeout = undefined;
    };
    SpinnerComponent.prototype.ngOnDestroy = function () {
        this.cancel();
    };
    return SpinnerComponent;
}());
__decorate([
    core_1.Input()
], SpinnerComponent.prototype, "delay");
__decorate([
    core_1.Input()
], SpinnerComponent.prototype, "isRunning");
SpinnerComponent = __decorate([
    core_1.Component({
        selector: 'app-spinner',
        templateUrl: 'spinner.component.html',
        styleUrls: ['spinner.component.css']
    })
], SpinnerComponent);
exports.SpinnerComponent = SpinnerComponent;

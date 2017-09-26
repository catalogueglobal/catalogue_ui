"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var SubscribeFormComponent = (function () {
    function SubscribeFormComponent(datasetsAction, store, actions$) {
        var _this = this;
        this.datasetsAction = datasetsAction;
        this.store = store;
        this.now = Date.now();
        this.userSubscribeParams = {
            NAME: '',
            EMAIL: '',
            COMPANY: '',
            TYPE: ''
        };
        this.resetForm();
        // reset form on subscribe success
        actions$.ofType(datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(function () { return _this.resetForm(); });
    }
    SubscribeFormComponent.prototype.submit = function () {
        this.store.dispatch(this.datasetsAction.userSubscribe(this.userSubscribeParams));
    };
    SubscribeFormComponent.prototype.resetForm = function () {
        this.userSubscribeParams = {
            NAME: '',
            EMAIL: '',
            COMPANY: '',
            TYPE: ''
        };
    };
    return SubscribeFormComponent;
}());
SubscribeFormComponent = __decorate([
    core_1.Component({
        selector: 'app-subscribe-form',
        templateUrl: 'subscribe-form.component.html'
    })
], SubscribeFormComponent);
exports.SubscribeFormComponent = SubscribeFormComponent;

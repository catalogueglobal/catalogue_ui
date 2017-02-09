var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
export var SubscribeFormComponent = (function () {
    function SubscribeFormComponent(datasetsAction, store, actions$) {
        var _this = this;
        this.datasetsAction = datasetsAction;
        this.store = store;
        this.now = Date.now();
        this.userSubscribeParams = {
            NAME: "",
            EMAIL: "",
            COMPANY: "",
            TYPE: ""
        };
        this.resetForm();
        // reset form on subscribe success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(function () { return _this.resetForm(); });
    }
    SubscribeFormComponent.prototype.submit = function () {
        this.store.dispatch(this.datasetsAction.userSubscribe(this.userSubscribeParams));
    };
    SubscribeFormComponent.prototype.resetForm = function () {
        this.userSubscribeParams = {
            NAME: "",
            EMAIL: "",
            COMPANY: "",
            TYPE: ""
        };
    };
    SubscribeFormComponent = __decorate([
        Component({
            selector: 'app-subscribe-form',
            templateUrl: 'subscribe-form.component.html'
        }), 
        __metadata('design:paramtypes', [DatasetsActions, Store, Actions])
    ], SubscribeFormComponent);
    return SubscribeFormComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/subscribe-form/subscribe-form.component.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var LayoutComponent = (function () {
    function LayoutComponent(sessionService, actions$) {
        this.sessionService = sessionService;
        this.actions$ = actions$;
        this.mainTitle = '';
        // close popup on feed creation success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function (action) { return closePopup('#createfeed'); });
        // close popup on feed added to project
        actions$.ofType(datasets_actions_1.DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(function (action) { return closePopup('#createfeed'); });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function (action) { return openPopup('#uploadingfeed'); });
        // close popup on user subscribe success
        actions$.ofType(datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(function (action) { return closePopup('#subscribepopup'); });
    }
    return LayoutComponent;
}());
LayoutComponent = __decorate([
    core_1.Component({
        selector: 'app-layout',
        templateUrl: 'layout.component.html'
    })
], LayoutComponent);
exports.LayoutComponent = LayoutComponent;

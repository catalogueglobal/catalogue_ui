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
import { SessionService } from "../commons/services/session.service";
import { DatasetsActionType } from "../state/datasets/datasets.actions";
export var LayoutComponent = (function () {
    function LayoutComponent(sessionService, actions$) {
        this.sessionService = sessionService;
        this.actions$ = actions$;
        this.mainTitle = "";
        // close popup on feed creation success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function (action) { return closePopup('#createfeed'); });
        // close popup on feed added to project
        actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(function (action) { return closePopup('#createfeed'); });
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function (action) { return openPopup('#uploadingfeed'); });
        // close popup on user subscribe success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(function (action) { return closePopup('#subscribepopup'); });
        actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(function (action) { return closePopup('#deletefeedpopup'); });
    }
    LayoutComponent = __decorate([
        Component({
            selector: 'app-layout',
            templateUrl: 'layout.component.html',
            styleUrls: ['layout.component.css']
        }), 
        __metadata('design:paramtypes', [SessionService, Actions])
    ], LayoutComponent);
    return LayoutComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/layout/layout.component.js.map
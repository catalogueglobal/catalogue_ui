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
import { Router, ActivatedRoute } from '@angular/router';
import { FeedsApiService } from '../../commons/services/api/feedsApi.service';
import { SessionService } from "../../commons/services/session.service";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { Actions } from "@ngrx/effects";
export var FeedsComponent = (function () {
    function FeedsComponent(route, router, feedsApi, store, actions$, datasetsAction, sessionService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.store = store;
        this.actions$ = actions$;
        this.datasetsAction = datasetsAction;
        this.sessionService = sessionService;
        // Get the id of the feed
        this.route.params.subscribe(function (params) {
            _this.feedId = params["id"];
        });
        // Get the info from the feed id
        this.notesFeed = [];
        var that = this;
        feedsApi.getPublic(this.feedId).then(function (data) {
            that.infoFeed = data;
        });
        if (sessionService.loggedIn == true) {
            feedsApi.getNotes(this.feedId).then(function (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    that.notesFeed.push(data[i]);
                }
            });
        }
        actions$.ofType(DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS)
            .subscribe(function (action) { return _this.resetForm(); });
    }
    FeedsComponent.prototype.addNotesToFeed = function () {
        // add note to feed if not empty
        if (this.note != null) {
            var data = { body: this.note, date: Date.now(), userEmail: this.sessionService.session.user.email };
            this.store.dispatch(this.datasetsAction.feedAddNotes(this.feedId, data));
            this.notesFeed.unshift(data);
        }
    };
    FeedsComponent.prototype.resetForm = function () {
        this.note = "";
    };
    FeedsComponent = __decorate([
        Component({
            selector: 'app-feeds',
            templateUrl: 'feeds.component.html',
        }), 
        __metadata('design:paramtypes', [ActivatedRoute, Router, FeedsApiService, Store, Actions, DatasetsActions, SessionService])
    ], FeedsComponent);
    return FeedsComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/feeds/feeds.component.js.map
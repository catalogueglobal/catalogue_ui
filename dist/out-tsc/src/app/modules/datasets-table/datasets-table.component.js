var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { PaginationService } from "ng2-pagination";
import { Configuration } from "../../commons/configuration";
import { Store } from "@ngrx/store";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActions } from "../../state/datasets/datasets.actions";
import { UsersApiService } from "../../commons/services/api/usersApi.service";
import { SessionService } from "../../commons/services/session.service";
import { FEED_RETRIEVAL_METHOD } from "../../commons/services/api/feedsApi.service";
import { Actions } from "@ngrx/effects";
//import {Map} from "@angular/core/src/facade/collection";
export var DatasetsTableComponent = (function () {
    function DatasetsTableComponent(config, utils, sessionService, usersApiService, store, actions$, datasetsAction) {
        this.config = config;
        this.utils = utils;
        this.sessionService = sessionService;
        this.usersApiService = usersApiService;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.chkAll = false;
        this.sortChange = new EventEmitter();
        this.FEED_RETRIEVAL_METHOD = FEED_RETRIEVAL_METHOD; // used by the template
        this.checkById = new Map();
        this.currentSort = {
            sort: 'name',
            order: 'asc'
        };
    }
    Object.defineProperty(DatasetsTableComponent.prototype, "feeds", {
        // overriden by childs
        get: function () {
            return this._feeds;
        },
        // overriden by childs
        set: function (value) {
            if (!value) {
                this._feeds = null;
                return;
            }
            this._feeds = value;
        },
        enumerable: true,
        configurable: true
    });
    DatasetsTableComponent.prototype.setSort = function (sort) {
        this.sortChange.emit(sort);
    };
    DatasetsTableComponent.prototype.checkAll = function () {
        var _this = this;
        var newValue = !this.chkAll;
        this.feeds.forEach(function (feed) {
            _this.checkById[feed.id] = newValue;
        });
        this.chkAll = newValue;
    };
    DatasetsTableComponent.prototype.regionStateCountry = function (feed) {
        return this.utils.regionStateCountry(feed);
    };
    DatasetsTableComponent.prototype.getCheckedFeeds = function () {
        var _this = this;
        if (!this.feeds) {
            // component not initialized yet
            return [];
        }
        return this.feeds.filter(function (feed) { return _this.checkById[feed.id]; });
    };
    DatasetsTableComponent.prototype.actionOnFeed = function (feed_id) {
        var response = this.usersApiService.getUser(this.sessionService.session.user.user_id);
        var that = this;
        response.then(function (data) {
            var isSubscribe = that.isSubscribe(data, feed_id);
            that.subscribeOrUnsubscribeFeed(data, feed_id, isSubscribe);
        });
    };
    DatasetsTableComponent.prototype.subscribeOrUnsubscribeFeed = function (data, feed_id, isSubscribe) {
        if (isSubscribe == false) {
            console.log("SUBSCRIBE");
            data = this.utils.addFeedIdToJson(data, feed_id);
            this.store.dispatch(this.datasetsAction.subscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        }
        else {
            console.log("UNSUBSCRIBE");
            data.app_metadata.datatools[0].subscriptions[0].target.splice(this.indexToUnsubscribe, 1);
            console.log(data.app_metadata.datatools[0]);
            this.store.dispatch(this.datasetsAction.unsubscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        }
    };
    // Return true or false if the user is subscribe
    // or not to the feed
    DatasetsTableComponent.prototype.isSubscribe = function (userInfos, feed_id) {
        console.log(userInfos);
        if (userInfos.app_metadata.datatools[0].subscriptions == null) {
            return false;
        }
        else {
            for (var i = 0; i < userInfos.app_metadata.datatools[0].subscriptions[0].target.length; i++) {
                if (userInfos.app_metadata.datatools[0].subscriptions[0].target[i] == feed_id) {
                    this.indexToUnsubscribe = i;
                    return true;
                }
            }
            return false;
        }
    };
    DatasetsTableComponent.prototype.checkSubscribed = function (feed_id) {
        var index = this.sessionService.session.user.app_metadata.datatools[0].subscriptions[0].target.indexOf(feed_id);
        if (index == -1) {
            return false;
        }
        return true;
    };
    DatasetsTableComponent.prototype.resetPage = function () {
        this.page = 1;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Array)
    ], DatasetsTableComponent.prototype, "_feeds", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], DatasetsTableComponent.prototype, "chkAll", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], DatasetsTableComponent.prototype, "sortChange", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DatasetsTableComponent.prototype, "feeds", null);
    DatasetsTableComponent = __decorate([
        Component({
            selector: 'app-datasets-table',
            templateUrl: 'datasets-table.component.html',
            providers: [PaginationService]
        }), 
        __metadata('design:paramtypes', [Configuration, UtilsService, SessionService, UsersApiService, Store, Actions, DatasetsActions])
    ], DatasetsTableComponent);
    return DatasetsTableComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/datasets-table/datasets-table.component.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Input } from "@angular/core";
import { DatasetsTableComponent } from "../datasets-table/datasets-table.component";
import { FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { Store } from "@ngrx/store";
import { DatasetsActions, toFeedReference, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { UtilsService } from "../../commons/services/utils.service";
import { UsersApiService } from "../../commons/services/api/usersApi.service";
import { SessionService } from "../../commons/services/session.service";
import { PaginationService } from "ng2-pagination";
import { Configuration } from "../../commons/configuration";
import { Actions } from "@ngrx/effects";
var CONFIRM_EDIT_IDX_SETNAME = "setName";
var CONFIRM_EDIT_IDX_SETFILE = "setFile";
export var MyDatasetsTableComponent = (function (_super) {
    __extends(MyDatasetsTableComponent, _super);
    function MyDatasetsTableComponent(config, utils, feedsApi, store, datasetsAction, actions$, usersApiService, sessionService) {
        var _this = this;
        _super.call(this, config, utils, sessionService, usersApiService, store, actions$, datasetsAction);
        this.feedsApi = feedsApi;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.actions$ = actions$;
        this.sortChange = new EventEmitter();
        this.confirmEditById = new Map();
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.FEED_SET_NAME_SUCCESS)
            .subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.processConfirm(CONFIRM_EDIT_IDX_SETNAME + updatedFeed.id);
        });
        // close inline edit form on setFile() success
        actions$.ofType(DatasetsActionType.FEED_SET_FILE_SUCCESS)
            .subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.processConfirm(CONFIRM_EDIT_IDX_SETFILE + updatedFeed.id);
        });
    }
    MyDatasetsTableComponent.prototype.processConfirm = function (idx) {
        var confirmEdit = this.confirmEditById.get(idx);
        if (confirmEdit) {
            confirmEdit.emit(true);
            this.confirmEditById.delete(idx);
        }
    };
    Object.defineProperty(MyDatasetsTableComponent.prototype, "feeds", {
        // overriden by childs
        get: function () {
            return this._feeds;
        },
        // override parent
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
    MyDatasetsTableComponent.prototype.setSort = function (sort) {
        this.sortChange.emit(sort);
    };
    MyDatasetsTableComponent.prototype.togglePublic = function (feed) {
        var value = !feed.isPublic;
        this.store.dispatch(this.datasetsAction.feedSetPublic(toFeedReference(feed), value));
        return false;
    };
    MyDatasetsTableComponent.prototype.setName = function (feed, event) {
        // observer will be notified to close inline form on success
        this.confirmEditById.set(CONFIRM_EDIT_IDX_SETNAME + feed.id, event.confirm$);
        // process
        this.store.dispatch(this.datasetsAction.feedSetName(toFeedReference(feed), event.value));
        return false;
    };
    MyDatasetsTableComponent.prototype.setFile = function (feed, event) {
        // observer will be notified to close inline form on success
        this.confirmEditById.set(CONFIRM_EDIT_IDX_SETFILE + feed.id, event.confirm$);
        // process
        this.store.dispatch(this.datasetsAction.feedSetFile(toFeedReference(feed), event.value));
        return false;
    };
    MyDatasetsTableComponent.prototype.fetchFeed = function (feed) {
        this.store.dispatch(this.datasetsAction.feedFetch(toFeedReference(feed)));
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MyDatasetsTableComponent.prototype, "sortChange", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], MyDatasetsTableComponent.prototype, "feeds", null);
    MyDatasetsTableComponent = __decorate([
        Component({
            selector: 'app-my-datasets-table',
            templateUrl: 'my-datasets-table.component.html',
            providers: [PaginationService]
        }), 
        __metadata('design:paramtypes', [Configuration, UtilsService, FeedsApiService, Store, DatasetsActions, Actions, UsersApiService, SessionService])
    ], MyDatasetsTableComponent);
    return MyDatasetsTableComponent;
}(DatasetsTableComponent));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/my-datasets-table/my-datasets-table.component.js.map
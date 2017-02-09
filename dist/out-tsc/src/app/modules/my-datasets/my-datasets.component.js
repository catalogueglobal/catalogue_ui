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
import { Component, ViewChild } from "@angular/core";
import { DatasetsComponent } from "../datasets/datasets.component";
import { ProjectsApiService } from "../../commons/services/api/projectsApi.service";
import { Store } from "@ngrx/store";
import { DatasetsActions, toFeedReference } from "../../state/datasets/datasets.actions";
import { Configuration } from "../../commons/configuration";
import { DatasetsMapComponent } from "../datasets-map/datasets-map.component";
import { MyDatasetsTableComponent } from "../my-datasets-table/my-datasets-table.component";
import { FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActionType } from "../../state/datasets/datasets.actions";
import { Actions } from "@ngrx/effects";
import { LocalFiltersService } from "../../commons/services/api/localFilters.service";
export var MyDatasetsComponent = (function (_super) {
    __extends(MyDatasetsComponent, _super);
    function MyDatasetsComponent(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$) {
        var _this = this;
        _super.call(this, utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$);
        this.utils = utils;
        this.projectsApiService = projectsApiService;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.config = config;
        this.feedsApi = feedsApi;
        this.localFilters = localFilters;
        this.initDatasets(true); // show private feeds
        actions$.ofType(DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS).subscribe(function (action) { return _this.deleteFeeds(); });
    }
    MyDatasetsComponent.prototype.deleteFeeds = function () {
        var feedRefsToDelete = this.getCheckedFeeds().map(function (feed) { return toFeedReference(feed); });
        if (feedRefsToDelete.length > 0) {
            this.store.dispatch(this.datasetsAction.feedDelete(feedRefsToDelete));
        }
        return false;
    };
    __decorate([
        ViewChild(DatasetsMapComponent), 
        __metadata('design:type', DatasetsMapComponent)
    ], MyDatasetsComponent.prototype, "mapComponent", void 0);
    __decorate([
        ViewChild(MyDatasetsTableComponent), 
        __metadata('design:type', MyDatasetsTableComponent)
    ], MyDatasetsComponent.prototype, "tableComponent", void 0);
    MyDatasetsComponent = __decorate([
        Component({
            selector: 'app-my-datasets',
            templateUrl: 'my-datasets.component.html'
        }), 
        __metadata('design:paramtypes', [UtilsService, ProjectsApiService, Store, DatasetsActions, Configuration, FeedsApiService, LocalFiltersService, Actions])
    ], MyDatasetsComponent);
    return MyDatasetsComponent;
}(DatasetsComponent));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/my-datasets/my-datasets.component.js.map
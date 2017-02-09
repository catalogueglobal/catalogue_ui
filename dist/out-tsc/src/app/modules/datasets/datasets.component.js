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
import { ProjectsApiService } from "../../commons/services/api/projectsApi.service";
import { FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { DatasetsMapComponent } from "../datasets-map/datasets-map.component";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { Configuration } from "../../commons/configuration";
import { DatasetsTableComponent } from "../datasets-table/datasets-table.component";
import { UtilsService } from "../../commons/services/utils.service";
import { Actions } from "@ngrx/effects";
import { LocalFiltersService } from "../../commons/services/api/localFilters.service";
var INITIAL_SORT = {
    sort: 'name',
    order: 'asc'
};
export var DatasetsComponent = (function () {
    function DatasetsComponent(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$) {
        var _this = this;
        this.utils = utils;
        this.projectsApiService = projectsApiService;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.config = config;
        this.feedsApi = feedsApi;
        this.localFilters = localFilters;
        this.feeds = [];
        this.feeds$ = store.select('datasets').map(function (datasets) { return datasets.feeds; });
        this.feeds$.subscribe(function (feeds) {
            if (feeds) {
                console.log('FEEDS:', feeds.length);
                _this.feeds = feeds.map(function (feed) { return feed; });
            }
        });
        // request feeds
        this.currentSort = INITIAL_SORT;
        this.currentBounds = null;
        this.initDatasets(false); // show public feeds
        // refresh feeds on upload success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function () {
            return _this.store.dispatch(datasetsAction.feedsGet(_this.getFeedsParams()));
        });
    }
    DatasetsComponent.prototype.initDatasets = function (isSecure) {
        this.isSecure = isSecure;
    };
    DatasetsComponent.prototype.ngAfterViewInit = function () {
        this.fetchFeeds();
    };
    DatasetsComponent.prototype.getFeedsParams = function () {
        return {
            sortOrder: this.currentSort,
            bounds: this.currentBounds,
            secure: this.isSecure
        };
    };
    DatasetsComponent.prototype.getCheckedFeeds = function () {
        return this.tableComponent.getCheckedFeeds();
    };
    DatasetsComponent.prototype.downloadFeeds = function (event) {
        var _this = this;
        var checkedFeeds = this.getCheckedFeeds();
        checkedFeeds.forEach(function (feed) {
            _this.feedsApi.getDownloadUrl(feed).subscribe(function (url) {
                if (url) {
                    console.log('getDownloadUrl: ', url);
                    //window.location.assign(url);
                    window.open(url);
                }
            });
        });
        event.preventDefault();
    };
    DatasetsComponent.prototype.onAutocompleteSelected = function (selected) {
        console.log('onAutocompleteSelected', selected);
        this.mapPosition = selected.position;
        this.mapZoom = this.config.MAP_ZOOM_BY_AUTOCOMPLETE_TYPE(selected.type);
    };
    DatasetsComponent.prototype.onSortChange = function (value) {
        this.currentSort = value;
        this.tableComponent.resetPage();
        // uncomment this when sort is ready on server-side API
        //this.fetchFeeds();
        // for now, sort is executed locally - comment this when sort is ready on server-side API
        var sortedFeeds = this.localFilters.sortFeeds(this.feeds, value);
        this.store.dispatch(this.datasetsAction.feedsGetLocally(this.getFeedsParams(), sortedFeeds));
    };
    DatasetsComponent.prototype.onBoundsChange = function (value) {
        this.tableComponent.resetPage();
        this.currentBounds = value;
        this.fetchFeeds();
    };
    DatasetsComponent.prototype.fetchFeeds = function () {
        this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams()));
    };
    DatasetsComponent.prototype.resetSearch = function () {
        this.currentSort = INITIAL_SORT;
        this.mapComponent.reset();
        this.tableComponent.resetPage();
        this.onBoundsChange(null); // show feeds with no bounds
    };
    __decorate([
        ViewChild(DatasetsMapComponent), 
        __metadata('design:type', DatasetsMapComponent)
    ], DatasetsComponent.prototype, "mapComponent", void 0);
    __decorate([
        ViewChild(DatasetsTableComponent), 
        __metadata('design:type', DatasetsTableComponent)
    ], DatasetsComponent.prototype, "tableComponent", void 0);
    DatasetsComponent = __decorate([
        Component({
            selector: 'app-datasets',
            templateUrl: 'datasets.component.html',
            providers: [ProjectsApiService]
        }), 
        __metadata('design:paramtypes', [UtilsService, ProjectsApiService, Store, DatasetsActions, Configuration, FeedsApiService, LocalFiltersService, Actions])
    ], DatasetsComponent);
    return DatasetsComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/datasets/datasets.component.js.map
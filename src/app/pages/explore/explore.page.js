"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var _1 = require("app/modules/common/");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var components_1 = require("app/modules/components");
var INITIAL_SORT = {
    sort: 'name',
    order: 'asc'
};
var ExplorePage = (function () {
    function ExplorePage(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$) {
        this.utils = utils;
        this.projectsApiService = projectsApiService;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.config = config;
        this.feedsApi = feedsApi;
        this.localFilters = localFilters;
        this.actions$ = actions$;
        this.feeds = [];
        // request feeds
        this.currentSort = INITIAL_SORT;
        this.currentBounds = null;
        this.initDatasets(false); // show public feeds
        // refresh feeds on upload success
        this.createStore();
    }
    ExplorePage.prototype.createStore = function () {
        this.feeds$ = this.store.select('datasets').map(function (datasets) { return datasets.feeds; });
        this.subscribeActions();
    };
    ExplorePage.prototype.subscribeActions = function () {
        var _this = this;
        this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function () { return _this.store.dispatch(_this.datasetsAction.feedsGet(_this.getFeedsParams())); });
        this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(function () { return _this.store.dispatch(_this.datasetsAction.feedsGet(_this.getFeedsParams())); });
        this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(function (action) {
            if (action.payload.feedRefs && action.payload.feedRefs[0].feedVersionCount > 1) {
                _this.store.dispatch(_this.datasetsAction.feedsGet(_this.getFeedsParams()));
            }
        });
        this.feeds$.subscribe(function (feeds) {
            if (feeds) {
                console.log('FEEDS:', feeds.length);
                _this.feeds = feeds.map(function (feed) { return feed; });
            }
            else {
                _this.feeds = [];
            }
        });
    };
    ExplorePage.prototype.initDatasets = function (isSecure) {
        this.isSecure = isSecure;
    };
    ExplorePage.prototype.ngAfterViewInit = function () {
        this.fetchFeeds();
    };
    ExplorePage.prototype.getFeedsParams = function () {
        return {
            sortOrder: this.currentSort,
            bounds: this.currentBounds,
            secure: this.isSecure
        };
    };
    ExplorePage.prototype.onAutocompleteSelected = function (selected) {
        console.log('onAutocompleteSelected', selected);
        this.mapPosition = selected.position;
        this.mapZoom = this.config.MAP_ZOOM_BY_AUTOCOMPLETE_TYPE(selected.type);
    };
    ExplorePage.prototype.onSortChange = function (value) {
        this.currentSort = value;
        this.tableComponent.resetPage();
        // uncomment this when sort is ready on server-side API
        //this.fetchFeeds();
        // for now, sort is executed locally - comment this when sort is ready on server-side API
        var sortedFeeds = this.localFilters.sortFeeds(this.feeds, value);
        this.store.dispatch(this.datasetsAction.feedsGetLocally(this.getFeedsParams(), sortedFeeds));
    };
    ExplorePage.prototype.onBoundsChange = function (value) {
        this.tableComponent.resetPage();
        this.currentBounds = value;
        this.fetchFeeds();
    };
    ExplorePage.prototype.fetchFeeds = function () {
        this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams()));
    };
    ExplorePage.prototype.resetSearch = function () {
        this.currentSort = INITIAL_SORT;
        this.mapComponent.reset();
        this.tableComponent.resetPage();
        this.onBoundsChange(null); // show feeds with no bounds
    };
    return ExplorePage;
}());
__decorate([
    core_1.ViewChild(components_1.DatasetsMapComponent)
], ExplorePage.prototype, "mapComponent");
__decorate([
    core_1.ViewChild(components_1.DatasetsTableComponent)
], ExplorePage.prototype, "tableComponent");
ExplorePage = __decorate([
    core_1.Component({
        selector: 'app-explore-page',
        templateUrl: 'explore.page.html',
        providers: [_1.ProjectsApiService]
    })
], ExplorePage);
exports.ExplorePage = ExplorePage;

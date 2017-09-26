"use strict";
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
var core_1 = require("@angular/core");
var explore_page_1 = require("app/pages/explore/explore.page");
var components_1 = require("app/modules/components");
var components_2 = require("app/modules/components");
var ManagmentPage = (function (_super) {
    __extends(ManagmentPage, _super);
    function ManagmentPage(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$) {
        var _this = _super.call(this, utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$) || this;
        _this.utils = utils;
        _this.projectsApiService = projectsApiService;
        _this.store = store;
        _this.datasetsAction = datasetsAction;
        _this.config = config;
        _this.feedsApi = feedsApi;
        _this.localFilters = localFilters;
        _this.initDatasets(true); // show private feeds
        return _this;
    }
    ManagmentPage.prototype.createStore = function () {
        this.feeds$ = this.store.select('mydatasets').map(function (datasets) { return datasets.feeds; });
        this.subscribeActions();
    };
    return ManagmentPage;
}(explore_page_1.ExplorePage));
__decorate([
    core_1.ViewChild(components_1.DatasetsMapComponent)
], ManagmentPage.prototype, "mapComponent");
__decorate([
    core_1.ViewChild(components_2.UserDatasetsTableComponent)
], ManagmentPage.prototype, "tableComponent");
ManagmentPage = __decorate([
    core_1.Component({
        selector: 'app-managment-page',
        templateUrl: 'managment.page.html'
    })
], ManagmentPage);
exports.ManagmentPage = ManagmentPage;

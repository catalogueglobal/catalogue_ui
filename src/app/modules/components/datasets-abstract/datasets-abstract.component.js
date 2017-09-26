"use strict";
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var _1 = require("app/modules/common/");
var DatasetsAbstractComponent = (function () {
    function DatasetsAbstractComponent(injector) {
        this.config = injector.get(_1.Configuration);
        this.utils = injector.get(_1.UtilsService);
        this.sessionService = injector.get(_1.SessionService);
        this.feedsApiService = injector.get(_1.FeedsApiService);
        this.usersApiService = injector.get(_1.UsersApiService);
        this.store = injector.get(store_1.Store);
        this.actions$ = injector.get(effects_1.Actions);
        this.datasetsAction = injector.get(datasets_actions_1.DatasetsActions);
        this.shared = injector.get(_1.SharedService);
        this.licenseApiService = injector.get(_1.LicenseApiService);
    }
    return DatasetsAbstractComponent;
}());
exports.DatasetsAbstractComponent = DatasetsAbstractComponent;

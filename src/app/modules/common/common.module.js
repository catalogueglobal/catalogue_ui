"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthGuard_1 = require("./guards/AuthGuard");
var filter_pipe_1 = require("./pipes/filter.pipe");
var institutionalUrl_pipe_1 = require("./pipes/institutionalUrl.pipe");
var truncate_pipe_1 = require("./pipes/truncate.pipe");
var feedsApi_service_1 = require("./services/api/feedsApi.service");
var licenseApi_service_1 = require("./services/api/licenseApi.service");
var localFilters_service_1 = require("./services/api/localFilters.service");
var projectsApi_service_1 = require("./services/api/projectsApi.service");
var usersApi_service_1 = require("./services/api/usersApi.service");
var configuration_1 = require("./services/configuration");
var mapUtils_service_1 = require("./services/mapUtils.service");
var session_service_1 = require("./services/session.service");
var shared_service_1 = require("./services/shared.service");
var upload_service_1 = require("./services/upload.service");
var utils_service_1 = require("./services/utils.service");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var store_1 = require("@ngrx/store");
var store_devtools_1 = require("@ngrx/store-devtools");
var ng2_translate_1 = require("ng2-translate");
/*
import {
    Configuration,
    InstitutionalUrlPipe,
    FilterPipe,
    TruncatePipe,

    AuthGuard,
    FeedsApiService,
    LocalFiltersService,
    ProjectsApiService,
    UsersApiService,
    MapUtilsService,
    SessionService,
    SharedService,
    UploadService,
    UtilsService,
    LicenseApiService
} from './';
*/
exports.declarations = [
    institutionalUrl_pipe_1.InstitutionalUrlPipe,
    filter_pipe_1.FilterPipe,
    truncate_pipe_1.TruncatePipe
];
exports.exports = exports.declarations;
exports.entryPoints = [];
exports.providers = [
    AuthGuard_1.AuthGuard,
    feedsApi_service_1.FeedsApiService,
    localFilters_service_1.LocalFiltersService,
    projectsApi_service_1.ProjectsApiService,
    usersApi_service_1.UsersApiService,
    mapUtils_service_1.MapUtilsService,
    session_service_1.SessionService,
    shared_service_1.SharedService,
    upload_service_1.UploadService,
    utils_service_1.UtilsService,
    configuration_1.Configuration,
    institutionalUrl_pipe_1.InstitutionalUrlPipe,
    filter_pipe_1.FilterPipe,
    truncate_pipe_1.TruncatePipe,
    licenseApi_service_1.LicenseApiService
];
var CtCommonModule = (function () {
    function CtCommonModule() {
    }
    return CtCommonModule;
}());
CtCommonModule = __decorate([
    core_1.NgModule({
        declarations: exports.declarations,
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            platform_browser_1.BrowserModule,
            common_1.CommonModule,
            http_1.HttpModule,
            store_1.StoreModule,
            store_devtools_1.StoreDevtoolsModule.instrumentOnlyWithExtension(),
            ng2_translate_1.TranslateModule
        ],
        entryComponents: exports.entryPoints,
        providers: exports.providers,
        exports: exports.exports
    })
], CtCommonModule);
exports.CtCommonModule = CtCommonModule;

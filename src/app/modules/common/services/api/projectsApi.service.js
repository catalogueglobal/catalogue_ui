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
var abstractApi_service_1 = require("./abstractApi.service");
var ProjectsApiService = (function (_super) {
    __extends(ProjectsApiService, _super);
    function ProjectsApiService(http, authHttp, authConfig, config, utilsService) {
        var _this = _super.call(this, http, authHttp, authConfig, config) || this;
        _this.http = http;
        _this.authHttp = authHttp;
        _this.authConfig = authConfig;
        _this.config = config;
        _this.utilsService = utilsService;
        _this.PROJECT_URL = _this.config.ROOT_API + '/api/manager/public/project';
        return _this;
    }
    ProjectsApiService.prototype.create = function (name) {
        var params = JSON.stringify({
            name: name
        });
        return this.authHttp.post(this.utilsService.getSecureUrl(this.PROJECT_URL), params).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype["delete"] = function (projectId) {
        return this.authHttp["delete"](this.utilsService.getSecureUrl(this.PROJECT_URL) + '/' + projectId);
    };
    ProjectsApiService.prototype.getPublicList = function (bounds, sortOrder) {
        return this.http.get(this.PROJECT_URL + '?' + this.sortQuery(sortOrder) + '&' + this.boundsQuery(bounds))
            .map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getSecureList = function (bounds, sortOrder) {
        return this.authHttp.get(this.utilsService.getSecureUrl(this.PROJECT_URL) + '?' + this.sortQuery(sortOrder) +
            '&' + this.boundsQuery(bounds)).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getPublicProject = function (projectId) {
        return this.http.get(this.PROJECT_URL + '/' + projectId).map(function (response) { return response.json(); }).toPromise();
    };
    ProjectsApiService.prototype.getAllSecureProject = function () {
        return this.authHttp.get(this.utilsService.getSecureUrl(this.PROJECT_URL)).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getPrivateProject = function (projectId) {
        return this.authHttp.get(this.utilsService.getSecureUrl(this.PROJECT_URL) + '/' + projectId)
            .map(function (response) { return response.json(); }).toPromise();
    };
    ProjectsApiService.prototype.updateProject = function (project, projectId) {
        return this.authHttp.put(this.utilsService.getSecureUrl(this.PROJECT_URL) + '/'
            + projectId, JSON.stringify(project))
            .map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.sortQuery = function (sortOrder) {
        if (!sortOrder) {
            return '';
        }
        return 'sort=' + sortOrder.sort + '&order=' + sortOrder.order;
    };
    ProjectsApiService.prototype.boundsQuery = function (bounds) {
        if (!bounds) {
            return '';
        }
        return 'north=' + bounds.north + '&south=' + bounds.south + '&east=' + bounds.east + '&west=' + bounds.west;
    };
    return ProjectsApiService;
}(abstractApi_service_1.AbstractApiService));
ProjectsApiService = __decorate([
    core_1.Injectable()
], ProjectsApiService);
exports.ProjectsApiService = ProjectsApiService;

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
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { AuthHttp, AuthConfig } from "angular2-jwt";
import { Configuration } from "../../configuration";
import { AbstractApiService } from "./abstractApi.service";
export var ProjectsApiService = (function (_super) {
    __extends(ProjectsApiService, _super);
    function ProjectsApiService(http, authHttp, authConfig, config) {
        _super.call(this, http, authHttp, authConfig, config);
        this.http = http;
        this.authHttp = authHttp;
        this.authConfig = authConfig;
        this.config = config;
        this.PROJECT_SECURE_URL = this.config.ROOT_API + "/api/manager/secure/project";
        this.PROJECT_PUBLIC_URL = this.config.ROOT_API + "/api/manager/public/project";
    }
    ProjectsApiService.prototype.create = function (name) {
        var params = JSON.stringify({
            name: name
        });
        return this.authHttp.post(this.PROJECT_SECURE_URL, params).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.delete = function (projectId) {
        return this.authHttp.delete(this.PROJECT_SECURE_URL + "/" + projectId);
    };
    ProjectsApiService.prototype.getPublicList = function (bounds, sortOrder) {
        return this.http.get(this.PROJECT_PUBLIC_URL + "?" + this.sortQuery(sortOrder) + "&" + this.boundsQuery(bounds))
            .map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getSecureList = function (bounds, sortOrder) {
        return this.authHttp.get(this.PROJECT_SECURE_URL + "?" + this.sortQuery(sortOrder) + "&" + this.boundsQuery(bounds))
            .map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getPublicProject = function (projectId) {
        return this.http.get(this.PROJECT_PUBLIC_URL + "/" + projectId).map(function (response) { return response.json(); }).toPromise();
    };
    ProjectsApiService.prototype.getAllSecureProject = function () {
        return this.authHttp.get(this.PROJECT_SECURE_URL).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.getPrivateProject = function (projectId) {
        return this.authHttp.get(this.PROJECT_SECURE_URL + "/" + projectId).map(function (response) { return response.json(); }).toPromise();
    };
    ProjectsApiService.prototype.updateProject = function (project, projectId) {
        return this.authHttp.put(this.PROJECT_SECURE_URL + "/" + projectId, JSON.stringify(project)).map(function (response) { return response.json(); });
    };
    ProjectsApiService.prototype.sortQuery = function (sortOrder) {
        if (!sortOrder) {
            return "";
        }
        return "sort=" + sortOrder.sort + "&order=" + sortOrder.order;
    };
    ProjectsApiService.prototype.boundsQuery = function (bounds) {
        if (!bounds) {
            return "";
        }
        return "north=" + bounds.north + "&south=" + bounds.south + "&east=" + bounds.east + "&west=" + bounds.west;
    };
    ProjectsApiService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, AuthHttp, AuthConfig, Configuration])
    ], ProjectsApiService);
    return ProjectsApiService;
}(AbstractApiService));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/projectsApi.service.js.map
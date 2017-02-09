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
import { UploadService } from "../upload.service";
import { AbstractApiService } from "./abstractApi.service";
import { LocalFiltersService } from "./localFilters.service";
import { ProjectsApiService } from "./projectsApi.service";
export var UsersApiService = (function (_super) {
    __extends(UsersApiService, _super);
    function UsersApiService(http, authHttp, authConfig, config, projectsApiService, uploadService, localFilters) {
        _super.call(this, http, authHttp, authConfig, config);
        this.http = http;
        this.authHttp = authHttp;
        this.authConfig = authConfig;
        this.config = config;
        this.projectsApiService = projectsApiService;
        this.uploadService = uploadService;
        this.localFilters = localFilters;
        this.USER_SUBSCRIBE_URL = this.config.USER_SUBSCRIBE_URL;
        this.USER_SECURE_URL = this.config.ROOT_API + "/api/manager/secure/user/";
    }
    UsersApiService.prototype.subscribe = function (subscribeParams) {
        var data = JSON.stringify({
            NAME: subscribeParams.NAME,
            EMAIL: subscribeParams.EMAIL,
            COMPANY: subscribeParams.COMPANY,
            TYPE: subscribeParams.TYPE,
            // values from wordpress
            _mc4wp_form_element_id: 'mc4wp-form-1',
            _mc4wp_form_id: '103',
            _mc4wp_honeypot: '',
            _mc4wp_timestamp: Date.now()
        });
        return this.http.post(this.USER_SUBSCRIBE_URL, data);
    };
    UsersApiService.prototype.getUser = function (user_id) {
        return this.authHttp.get(this.USER_SECURE_URL + user_id).map(function (response) { return response.json(); }).toPromise();
    };
    UsersApiService.prototype.updateUser = function (user_id, data) {
        return this.authHttp.put(this.USER_SECURE_URL + user_id, data);
    };
    UsersApiService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, AuthHttp, AuthConfig, Configuration, ProjectsApiService, UploadService, LocalFiltersService])
    ], UsersApiService);
    return UsersApiService;
}(AbstractApiService));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/usersApi.service.js.map
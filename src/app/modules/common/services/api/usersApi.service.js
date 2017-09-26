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
var UsersApiService = (function (_super) {
    __extends(UsersApiService, _super);
    function UsersApiService(http, authHttp, authConfig, config, projectsApiService, uploadService, localFilters) {
        var _this = _super.call(this, http, authHttp, authConfig, config) || this;
        _this.http = http;
        _this.authHttp = authHttp;
        _this.authConfig = authConfig;
        _this.config = config;
        _this.projectsApiService = projectsApiService;
        _this.uploadService = uploadService;
        _this.localFilters = localFilters;
        _this.USER_SUBSCRIBE_URL = _this.config.USER_SUBSCRIBE_URL;
        _this.USER_SECURE_URL = _this.config.ROOT_API + '/api/manager/secure/user/';
        return _this;
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
    return UsersApiService;
}(abstractApi_service_1.AbstractApiService));
UsersApiService = __decorate([
    core_1.Injectable()
], UsersApiService);
exports.UsersApiService = UsersApiService;

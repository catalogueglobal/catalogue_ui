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
var LicenseApiService = (function (_super) {
    __extends(LicenseApiService, _super);
    function LicenseApiService(http, authHttp, authConfig, config, uploadService, utilsService) {
        var _this = _super.call(this, http, authHttp, authConfig, config) || this;
        _this.http = http;
        _this.authHttp = authHttp;
        _this.authConfig = authConfig;
        _this.config = config;
        _this.uploadService = uploadService;
        _this.utilsService = utilsService;
        _this.FEED_LICENSE = _this.config.LICENSE_API +
            '/api/metadata/' + _this.config.LICENSE_API_VERSION + '/secure/license';
        _this.FEED_MISC_DATA = _this.config.LICENSE_API + '/api/metadata/' +
            _this.config.LICENSE_API_VERSION + '/secure/miscdata';
        return _this;
    }
    LicenseApiService.prototype.getLicenses = function () {
        return this.http.get(this.FEED_LICENSE, { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); }).toPromise();
    };
    LicenseApiService.prototype.getMiscDatas = function () {
        return this.http.get(this.FEED_MISC_DATA, { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); }).toPromise();
    };
    LicenseApiService.prototype.createLicense = function (name, file, feedIds) {
        var formData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_LICENSE + '?name=' + name + '&feeds=' +
            feedIds, formData, this.computeAuthHeaders());
    };
    LicenseApiService.prototype.createMiscData = function (name, file, feedIds) {
        var formData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_MISC_DATA + '?name=' + name +
            '&feeds=' + feedIds, formData, this.computeAuthHeaders());
    };
    LicenseApiService.prototype.setLicense = function (feedIds, licenseId) {
        var params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_LICENSE + '/' + licenseId + params, null, { headers: this.utilsService.getHeader(true) }).map(function (response) { return response.json(); });
    };
    LicenseApiService.prototype.unsetLicense = function (feedIds, licenseId) {
        var params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_LICENSE + '/' + licenseId + params, null, { headers: this.utilsService.getHeader(true) }).map(function (response) { return response.json(); });
    };
    LicenseApiService.prototype.setMiscData = function (feedIds, licenseId) {
        var params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_MISC_DATA + '/' + licenseId + params, null, { headers: this.utilsService.getHeader(true) }).map(function (response) { return response.json(); });
    };
    LicenseApiService.prototype.unsetMiscData = function (feedIds, licenseId) {
        var params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_MISC_DATA + '/' + licenseId + params, null, { headers: this.utilsService.getHeader(true) }).map(function (response) { return response.json(); });
    };
    LicenseApiService.prototype.deletMiscData = function (licenseId) {
        return this.authHttp["delete"](this.FEED_MISC_DATA + '/' + licenseId).map(function (response) { return response.json(); });
    };
    return LicenseApiService;
}(abstractApi_service_1.AbstractApiService));
LicenseApiService = __decorate([
    core_1.Injectable()
], LicenseApiService);
exports.LicenseApiService = LicenseApiService;

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
export var AbstractApiService = (function () {
    function AbstractApiService(http, authHttp, authConfig, config) {
        this.http = http;
        this.authHttp = authHttp;
        this.authConfig = authConfig;
        this.config = config;
    }
    AbstractApiService.prototype.computeAuthHeaders = function () {
        var headers = new Map();
        headers.set(this.authConfig.headerName, this.authConfig.headerPrefix + this.authConfig.tokenGetter());
        //console.log("computeAuthHeaders", headers, this.authConfig);
        return headers;
    };
    AbstractApiService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, AuthHttp, AuthConfig, Configuration])
    ], AbstractApiService);
    return AbstractApiService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/abstractApi.service.js.map
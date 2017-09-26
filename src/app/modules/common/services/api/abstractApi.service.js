"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AbstractApiService = (function () {
    function AbstractApiService(http, authHttp, authConfig, config) {
        this.http = http;
        this.authHttp = authHttp;
        this.authConfig = authConfig;
        this.config = config;
    }
    AbstractApiService.prototype.computeAuthHeaders = function () {
        var headers = new Map();
        headers.set(this.authConfig.getConfig()
            .headerName, this.authConfig.getConfig().headerPrefix + this.authConfig
            .getConfig().tokenGetter());
        return headers;
    };
    AbstractApiService.prototype.computeDefaultHeaders = function () {
        var headers = new Map();
        return headers;
    };
    return AbstractApiService;
}());
AbstractApiService = __decorate([
    core_1.Injectable()
], AbstractApiService);
exports.AbstractApiService = AbstractApiService;

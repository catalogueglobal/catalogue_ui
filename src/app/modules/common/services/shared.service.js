"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var SharedService = (function () {
    function SharedService() {
        this.centerMap = {
            lat: 0,
            lng: 0,
            zoom: 0
        };
        this.licenses = [];
        this.miscDatas = [];
        this.notify = new Subject_1.Subject();
        /**
       * Observable string streams
       */
        this.notifyObservable$ = this.notify.asObservable();
    }
    SharedService.prototype.notifyOther = function (data) {
        if (data) {
            this.notify.next(data);
        }
    };
    SharedService.prototype.getCenterMap = function () {
        return this.centerMap;
    };
    SharedService.prototype.setNewCenter = function (newCenter, zoom) {
        this.centerMap.lat = newCenter.lat;
        this.centerMap.lng = newCenter.lng;
        this.centerMap.zoom = zoom;
    };
    SharedService.prototype.getLicenses = function () {
        return this.licenses;
    };
    SharedService.prototype.setLicenses = function (data) {
        this.licenses = data;
    };
    SharedService.prototype.getMiscDatas = function () {
        return this.miscDatas;
    };
    SharedService.prototype.setMiscDatas = function (data) {
        this.miscDatas = data;
    };
    return SharedService;
}());
SharedService = __decorate([
    core_1.Injectable()
], SharedService);
exports.SharedService = SharedService;

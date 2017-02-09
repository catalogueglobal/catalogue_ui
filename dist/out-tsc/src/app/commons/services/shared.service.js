var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
export var SharedService = (function () {
    function SharedService() {
        this.centerMap = {
            lat: 0,
            lng: 0,
            zoom: 0
        };
    }
    SharedService.prototype.getCenterMap = function () {
        return this.centerMap;
    };
    SharedService.prototype.setNewCenter = function (newCenter, zoom) {
        this.centerMap.lat = newCenter.lat;
        this.centerMap.lng = newCenter.lng;
        this.centerMap.zoom = zoom;
    };
    SharedService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], SharedService);
    return SharedService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/shared.service.js.map
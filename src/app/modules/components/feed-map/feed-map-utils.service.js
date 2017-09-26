"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var leaflet = require("leaflet");
var FeedMapUtilsService = (function () {
    function FeedMapUtilsService(mapUtils) {
        this.mapUtils = mapUtils;
    }
    FeedMapUtilsService.prototype.createClusterGroup = function (stop) {
        return new leaflet.MarkerClusterGroup({
            zoomToBoundsOnClick: true,
            chunkedLoading: true,
            disableClusteringAtZoom: 12,
            showCoverageOnHover: false,
            iconCreateFunction: stop ? this.mapUtils.computeStopIcon : this.mapUtils.computeStationIcon
        });
    };
    FeedMapUtilsService.prototype.getGeoJSONStyle = function (feature) {
        return {
            weight: feature.properties.type === 'stop' ? 10 : 5,
            opacity: 1,
            color: feature.properties.type === 'stop' ? 'red' : (feature.properties.routeData.routeColor ?
                ('#' + feature.properties.routeData.routeColor) : '#808080'),
            dashArray: feature.properties.type === 'stop' ? null : '5'
        };
    };
    FeedMapUtilsService.prototype.getGeoJSONStyleOver = function () {
        return {
            weight: 10,
            opacity: 1,
            color: '#1CDDBA',
            dashArray: null
        };
    };
    FeedMapUtilsService.prototype.getMinMax = function (list, lat, min) {
        var res = list[0];
        var index = lat ? 1 : 0;
        for (var i = 0; i < list.length; i++) {
            if ((min && list[i][index] < res[index]) || (!min && list[i][index] > res[index])) {
                res = list[i];
            }
        }
        return res;
    };
    FeedMapUtilsService.prototype.getRouteData = function (routeId, routes) {
        for (var i = 0; i < routes.length; i++) {
            if (routes[i].id === routeId) {
                return routes[i];
            }
        }
        return null;
    };
    return FeedMapUtilsService;
}());
FeedMapUtilsService = __decorate([
    core_1.Injectable()
], FeedMapUtilsService);
exports.FeedMapUtilsService = FeedMapUtilsService;

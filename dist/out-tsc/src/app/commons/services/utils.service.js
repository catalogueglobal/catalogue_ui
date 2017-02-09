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
import * as leaflet from "leaflet";
export var UtilsService = (function () {
    function UtilsService() {
    }
    UtilsService.prototype.computeLatLng = function (bounds) {
        if (!bounds)
            return null;
        var lngEast = bounds.east ? bounds.east : bounds.west; // check for 0 values
        var lngWest = bounds.west ? bounds.west : bounds.east; // check for 0 values
        var latNorth = bounds.north ? bounds.north : bounds.south; // check for 0 values
        var latSouth = bounds.south ? bounds.south : bounds.north; // check for 0 values
        // return averaged location
        return leaflet.latLng((latNorth + latSouth) / 2, (lngWest + lngEast) / 2);
    };
    UtilsService.prototype.computeBoundsToLatLng = function (bounds) {
        if (!bounds)
            return null;
        var lngEast = bounds.east ? bounds.east : bounds.west; // check for 0 values
        var lngWest = bounds.west ? bounds.west : bounds.east; // check for 0 values
        var latNorth = bounds.north ? bounds.north : bounds.south; // check for 0 values
        var latSouth = bounds.south ? bounds.south : bounds.north; // check for 0 values
        return [
            leaflet.latLng(latNorth, lngEast),
            leaflet.latLng(latSouth, lngEast),
            leaflet.latLng(latNorth, lngWest),
            leaflet.latLng(latSouth, lngWest)
        ];
    };
    UtilsService.prototype.computeLatLngToBounds = function (latLng) {
        if (!latLng)
            return null;
        var northEast = latLng[0];
        var southWest = latLng[1];
        return {
            north: northEast.lat,
            south: southWest.lat,
            east: northEast.lng,
            west: southWest.lng
        };
    };
    UtilsService.prototype.setFileModelOnChange = function (model, property, event) {
        try {
            model[property] = event.target.files[0];
        }
        catch (e) {
            model[property] = null;
        }
    };
    UtilsService.prototype.toggleOrder = function (value) {
        return (value == 'asc' ? 'desc' : 'asc');
    };
    UtilsService.prototype.regionStateCountry = function (feed) {
        var parts = [];
        if (feed.region && feed.region.trim().length) {
            parts.push(feed.region);
        }
        if (feed.state && feed.state.trim().length) {
            parts.push(feed.state);
        }
        if (feed.country && feed.country.trim().length) {
            parts.push(feed.country);
        }
        return parts.join(', ');
    };
    UtilsService.prototype.addFeedIdToJson = function (userInfos, feed_id) {
        console.log("add feed_id to json");
        if (userInfos.app_metadata.datatools[0].subscriptions == null) {
            var b = { "type": "feed-updated", target: [] };
            userInfos.app_metadata.datatools[0].subscriptions = [];
            userInfos.app_metadata.datatools[0].subscriptions.push(b);
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        }
        else {
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        }
        return userInfos;
    };
    UtilsService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], UtilsService);
    return UtilsService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/utils.service.js.map
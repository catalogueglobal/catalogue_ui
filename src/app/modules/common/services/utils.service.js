"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var leaflet = require("leaflet");
var UtilsService = (function () {
    function UtilsService() {
    }
    UtilsService.prototype.computeLatLng = function (bounds) {
        if (!bounds) {
            return null;
        }
        var lngEast = bounds.east ? bounds.east : bounds.west;
        var lngWest = bounds.west ? bounds.west : bounds.east;
        var latNorth = bounds.north ? bounds.north : bounds.south;
        var latSouth = bounds.south ? bounds.south : bounds.north;
        // return averaged location
        return leaflet.latLng((latNorth + latSouth) / 2, (lngWest + lngEast) / 2);
    };
    UtilsService.prototype.computeBoundsToLatLng = function (bounds) {
        if (!bounds) {
            return null;
        }
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
        if (!latLng) {
            return null;
        }
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
        return (value === 'asc' ? 'desc' : 'asc');
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
        console.log('add feed_id to json');
        if (!userInfos.app_metadata) {
            userInfos.app_metadata = {
                datatools: [{
                        subscriptions: null
                    }]
            };
        }
        if (userInfos.app_metadata.datatools[0].subscriptions === null) {
            var b = { 'type': 'feed-updated', target: [] };
            userInfos.app_metadata.datatools[0].subscriptions = [];
            userInfos.app_metadata.datatools[0].subscriptions.push(b);
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        }
        else {
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        }
        return userInfos;
    };
    UtilsService.prototype.userHasAdminRightOnFeed = function (userInfo, projectId, feedId) {
        if (userInfo.app_metadata && userInfo.app_metadata.datatools &&
            userInfo.app_metadata.datatools[0].permissions) {
            for (var i = 0; i < userInfo.app_metadata.datatools[0].permissions.length; i++) {
                if (userInfo.app_metadata.datatools[0].permissions[i].type === 'administer-application') {
                    return true;
                }
            }
            for (var i = 0; i < userInfo.app_metadata.datatools[0].projects.length; i++) {
                var project = userInfo.app_metadata.datatools[0].projects[i];
                if (project.project_id === projectId) {
                    if (project.permissions) {
                        for (var j = 0; j < project.permissions.length; j++) {
                            if (project.permissions[j].type === 'administer-project') {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    };
    UtilsService.prototype.userHasManageRightOnFeed = function (userInfo, projectId, feedId) {
        return this.userHasEditRightOnFeed(userInfo, projectId, feedId, 'manage-feed');
    };
    UtilsService.prototype.userHasEditRightOnFeed = function (userInfo, projectId, feedId, type) {
        type = type || 'edit-gtfs';
        if (userInfo.app_metadata && userInfo.app_metadata.datatools &&
            userInfo.app_metadata.datatools[0].projects) {
            for (var i = 0; i < userInfo.app_metadata.datatools[0].projects.length; i++) {
                var project = userInfo.app_metadata.datatools[0].projects[i];
                if (project.project_id === projectId) {
                    if (project.permissions) {
                        for (var j = 0; j < project.permissions.length; j++) {
                            if (project.permissions[j].type === type) {
                                if (!project.permissions[j].feeds || project.permissions[j].feeds === ['*'] ||
                                    project.permissions[j].feeds.indexOf(feedId) > -1) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    };
    UtilsService.prototype.userHasRightsOnFeed = function (userInfo, projectId, feedId) {
        if (userInfo && userInfo.app_metadata && userInfo.app_metadata.datatools &&
            userInfo.app_metadata.datatools[0].permissions) {
            for (var i = 0; i < userInfo.app_metadata.datatools[0].permissions.length; i++) {
                if (userInfo.app_metadata.datatools[0].permissions[i].type === 'administer-application') {
                    return true;
                }
            }
            for (var i = 0; i < userInfo.app_metadata.datatools[0].projects.length; i++) {
                var project = userInfo.app_metadata.datatools[0].projects[i];
                if (project.project_id === projectId) {
                    if (project.permissions) {
                        var j = 0;
                        for (j = 0; j < project.permissions.length; j++) {
                            if (project.permissions[j].type === 'administer-project') {
                                return true;
                            }
                        }
                        if (project.permissions[j].type === 'manage-feed' ||
                            project.permissions[j].type === 'edit-gtfs') {
                            if (!project.permissions[j].feeds || project.permissions[j].feeds === ['*'] ||
                                project.permissions[j].feeds.indexOf(feedId) > -1) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    };
    UtilsService.prototype.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    UtilsService.prototype.getHeader = function (multi) {
        var myHeader = new http_1.Headers();
        // myHeader.append('Cache-Control', 'public, max-age=300');
        if (multi) {
            myHeader.append('Content-Type', 'multipart/form-data');
        }
        return myHeader;
    };
    UtilsService.prototype.getSecureUrl = function (url) {
        var res = url.replace('/public', '/secure');
        return res;
    };
    UtilsService.prototype.computeRegionStateCountryData = function (projectName, feedRegions) {
        var region = '', state = '', country = '';
        if (feedRegions && feedRegions[0]) {
            var splitDatas = projectName.split(',');
            // indice n-1=country, n-2=state, n-3=region
            country = splitDatas.shift();
            if (splitDatas.length > 0) {
                state = country;
                country = splitDatas.shift();
            }
            if (splitDatas.length > 0) {
                region = state;
                state = country;
                country = splitDatas.shift();
            }
        }
        return {
            region: region,
            state: state,
            country: country
        };
    };
    return UtilsService;
}());
UtilsService = __decorate([
    core_1.Injectable()
], UtilsService);
exports.UtilsService = UtilsService;

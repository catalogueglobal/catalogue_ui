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
import { UtilsService } from "../utils.service";
export var LocalFiltersService = (function () {
    function LocalFiltersService(utils) {
        this.utils = utils;
    }
    LocalFiltersService.prototype.filterFeedsInArea = function (feeds, area) {
        var _this = this;
        console.log("FILTER FEEDS IN AREA", feeds);
        return feeds.filter(function (feed) { return _this.isFeedWithinArea(feed, area); });
    };
    LocalFiltersService.prototype.isFeedWithinArea = function (feed, area) {
        if (!feed.latestValidation || !feed.latestValidation.bounds) {
            return false;
        }
        var feedBounds = feed.latestValidation.bounds;
        if (
        // feed at west of area
        feedBounds.east < area.west ||
            // feed at east of area
            feedBounds.west > area.east) {
            // latitude KO
            return false;
        }
        if (
        // feed at north of area
        feedBounds.south > area.north ||
            // feed at south of area
            feedBounds.north < area.south) {
            // longitude KO
            return false;
        }
        return true;
    };
    LocalFiltersService.prototype.isPointWithinArea = function (lat, lng, area) {
        if (lat >= area.west && lat <= area.east) {
            if (lng >= area.south && lng <= area.north) {
                return true;
            }
        }
        return false;
    };
    LocalFiltersService.prototype.sortFeeds = function (feeds, sortOrder) {
        var _this = this;
        var sortProperty;
        switch (sortOrder.sort) {
            case 'regionStateCountry':
                sortProperty = function (feed) { return _this.utils.regionStateCountry(feed); };
                break;
            case 'lastUpdated':
                sortProperty = function (feed) {
                    var value = feed.lastUpdated;
                    if (!value) {
                        value = 0;
                    }
                    return value;
                };
                break;
            default:
                sortProperty = function (feed) { return feed[sortOrder.sort]; };
                break;
        }
        var sortFactor = sortOrder.order == 'asc' ? 1 : -1;
        var res = this.computeSort(feeds, sortFactor, sortProperty);
        return res;
    };
    LocalFiltersService.prototype.computeSort = function (array, byVal, sortProperty) {
        array.sort(function (a, b) {
            var aValue = sortProperty(a);
            var bValue = sortProperty(b);
            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
            }
            if (typeof bValue === "string") {
                bValue = bValue.toLowerCase();
            }
            if (aValue < bValue) {
                return -1 * byVal;
            }
            else if (aValue > bValue) {
                return 1 * byVal;
            }
            else {
                return 0;
            }
        });
        return array;
    };
    LocalFiltersService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [UtilsService])
    ], LocalFiltersService);
    return LocalFiltersService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/localFilters.service.js.map
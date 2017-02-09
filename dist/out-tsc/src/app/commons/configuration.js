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
import { environment } from "../../environments/environment";
export var Configuration = (function () {
    function Configuration() {
        this.ROOT_API = environment.rootApi;
        this.LICENSE_API = environment.licenseApi;
        this.LICENSE_API_VERSION = environment.licenseApiVersion;
        this.INSTITUTIONAL_URL = environment.institutionalUrl;
        this.AUTH_ID = environment.authId;
        this.AUTH_DOMAIN = environment.authDomain;
        this.MAP_ZOOM_POSITION = 10; // initial zoom when geoloc found
        this.MAP_ZOOM_UNKNOWN = 2; // initial zoom when geoloc not possible
        this.MAP_DEFAULT_POSITION = [48.827208299999995, 2.2820185]; // initial position when geoloc not possible: Paris, FR
        this.MAP_TILE_LAYER_URL = 'https://api.tiles.mapbox.com/v4/conveyal.ie3o67m0/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY29udmV5YWwiLCJhIjoiMDliQURXOCJ9.9JWPsqJY7dGIdX777An7Pw';
        this.MAP_TILE_LAYER_OPTIONS = {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, &copy; <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            noWrap: true
        };
        this.AUTOCOMPLETE_LIMIT = 10;
        this.PAGINATION_ITEMS_PER_PAGE = 10; //number of feeds per page
        this.PAGINATION_LINKS_MAX = 9; // max number of page links displayed
        this.NOTIFY_ERROR_TIMEOUT = 10000; // duration (ms) before hiding errors
        this.HIGHLIGHT_TIME = 5000;
        this.USER_SUBSCRIBE_URL = this.INSTITUTIONAL_URL;
    }
    Configuration.prototype.MAP_ZOOM_BY_AUTOCOMPLETE_TYPE = function (positionType) {
        switch (positionType) {
            case 'city':
                return this.MAP_ZOOM_POSITION;
            case 'state':
                return 7;
            case 'administrative':
                return 4;
        }
        return this.MAP_ZOOM_POSITION;
    };
    Configuration.prototype.AUTOCOMPLETE_URL = function (term) {
        return "https://nominatim.openstreetmap.org/search?format=json&namedetails=0&extratags=0&limit=" + this.AUTOCOMPLETE_LIMIT + "&q=" + term;
    };
    Configuration = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], Configuration);
    return Configuration;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/configuration.js.map
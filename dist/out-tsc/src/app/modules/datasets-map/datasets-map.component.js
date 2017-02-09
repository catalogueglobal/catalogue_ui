var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ProjectsApiService } from "../../commons/services/api/projectsApi.service";
import { Store } from "@ngrx/store";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActions } from "../../state/datasets/datasets.actions";
import { Configuration } from "../../commons/configuration";
import { MapUtilsService } from "../../commons/services/mapUtils.service";
import { SharedService } from "../../commons/services/shared.service";
import { SessionService } from "../../commons/services/session.service";
import { Router } from '@angular/router';
import * as leaflet from "leaflet";
require('./../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster');
export var DatasetsMapComponent = (function () {
    function DatasetsMapComponent(utils, config, projectsApi, mapUtils, router, store, datasetsAction, shared, session) {
        this.utils = utils;
        this.config = config;
        this.projectsApi = projectsApi;
        this.mapUtils = mapUtils;
        this.router = router;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.shared = shared;
        this.session = session;
        this.boundsChange = new EventEmitter();
        this.initialPosition = this.config.MAP_DEFAULT_POSITION;
        this.initialZoom = this.config.MAP_ZOOM_UNKNOWN;
        //this.geolocalize();
        this.setCenterMap();
        this.markers = new Array();
        this.updateProject = this.updateProjectProperty.bind(this);
    }
    DatasetsMapComponent.prototype.reset = function () {
        console.log('map reset', this.initialPosition, this.initialZoom);
        this._zoom = this.initialZoom;
        this._position = this.initialPosition;
        this.goTo(this.map, this._position, true);
    };
    Object.defineProperty(DatasetsMapComponent.prototype, "position", {
        set: function (value) {
            console.log('set position', value);
            if (!value) {
                return;
            }
            this._position = value;
            if (this.map) {
                this.goTo(this.map, value, false);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatasetsMapComponent.prototype, "zoom", {
        set: function (value) {
            console.log('set zoom', value);
            if (!value) {
                return;
            }
            this._zoom = value;
            if (this.map) {
                this.map.setZoom(value, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatasetsMapComponent.prototype, "feeds", {
        set: function (value) {
            this._feeds = value;
            if (this.map) {
                this.clearMap();
                this.populateMap();
            }
        },
        enumerable: true,
        configurable: true
    });
    DatasetsMapComponent.prototype.ngAfterViewInit = function () {
        this.map = this.computeMap(this.mapId);
        this.populateMap();
    };
    DatasetsMapComponent.prototype.geolocalize = function () {
        var _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (response) {
                _this.position = [response.coords.latitude, response.coords.longitude];
                console.log("geolocalize: available", _this._position);
            }, function () {
                console.log("geolocalize: geolocation not available");
            });
        }
    };
    DatasetsMapComponent.prototype.computeMap = function (cssId) {
        this.markerClusterGroup = new leaflet.MarkerClusterGroup({
            //disableClusteringAtZoom: 16,
            zoomToBoundsOnClick: true,
            chunkedLoading: true,
            showCoverageOnHover: false,
            iconCreateFunction: this.mapUtils.computeRedIcon
        });
        var thePosition;
        //leaflet.IconOptions.imagePath = 'vendor/leaflet/dist/images/';
        var tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        var map = leaflet.map(cssId, { center: this.initialPosition, zoom: this.initialZoom, zoomControl: false, minZoom: 2, layers: [tiles] });
        map.addLayer(this.markerClusterGroup);
        this.mapUtils.clusterAreaOver(this.markerClusterGroup, map);
        var that = this;
        map.on('moveend', function (e) {
            console.log('map move', map.getBounds());
            var mapBounds = map.getBounds();
            var newCenter = map.getCenter();
            that.shared.setNewCenter(newCenter, e.target._zoom);
            var areaBounds = that.utils.computeLatLngToBounds([mapBounds.getNorthEast(), mapBounds.getSouthWest()]);
            that.boundsChange.emit(areaBounds);
        });
        if (this._position) {
            this.goTo(map, this._position, false);
        }
        return map;
    };
    // remove all marker from the map when refresh
    DatasetsMapComponent.prototype.clearMap = function () {
        this.markerClusterGroup.clearLayers();
        if (this.router.url === "/my-datasets") {
            for (var i = 0; i < this.markers.length; i++) {
                this.map.removeLayer(this.markers[i]);
                this.markers.splice(i, 1);
            }
        }
    };
    DatasetsMapComponent.prototype.populateMap = function () {
        var _this = this;
        if (this._feeds && this.map) {
            this.clearMap();
            console.log("setFeeds", this._feeds.length);
            this._feeds.map(function (feed) {
                if (feed.latestValidation && feed.latestValidation.bounds) {
                    _this.createMarker(feed);
                }
                /*else {
                 console.log('new marker (no bounds)', feed);
                 }*/
            });
        }
    };
    DatasetsMapComponent.prototype.setCenterMap = function () {
        var lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat != 0 && lastCenter.lng != 0) {
            this.position = [lastCenter.lat, lastCenter.lng];
        }
        else {
            this.geolocalize();
        }
    };
    DatasetsMapComponent.prototype.goTo = function (theMap, thePosition, isReset) {
        var theZoom = this._zoom || this.config.MAP_ZOOM_POSITION;
        var lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat != 0 && lastCenter.lng != 0 && isReset == false) {
            thePosition[0] = lastCenter.lat;
            thePosition[1] = lastCenter.lng;
            theZoom = lastCenter.zoom;
        }
        console.log('goTo', thePosition, theZoom);
        theMap.setView(thePosition, theZoom);
    };
    DatasetsMapComponent.prototype.computeMarker = function (name, latLng, bounds, url, isPublic, id) {
        var isDraggable = this.router.url === '/my-datasets' ? true : false;
        var marker = leaflet.marker(latLng, { title: name, draggable: isDraggable });
        marker.data = {
            bounds: bounds,
            id: id
        };
        var that;
        if (isDraggable === true) {
            marker.on("dragend", this.updateProject);
        }
        marker.bindPopup(this.computeMarkerPopup(name, url));
        return marker;
    };
    DatasetsMapComponent.prototype.computeMarkerPopup = function (name, url) {
        var popupHtml = "<b>" + name + "</b>";
        if (url) {
            popupHtml += "<br><button onclick=\"document.location.href='" + url + "'\">Download feed</button>";
        }
        return popupHtml;
    };
    // Update the Lat and Lng of the project
    DatasetsMapComponent.prototype.updateProjectProperty = function (ev) {
        var projectsApi;
        var updateProject;
        var changedPos = ev.target.getLatLng();
        updateProject = {
            defaultLocationLat: changedPos.lat,
            defaultLocationLon: changedPos.lng
        };
        this.store.dispatch(this.datasetsAction.updateProject(ev.target.data.id, updateProject));
    };
    DatasetsMapComponent.prototype.extractData = function (data, feed) {
        if (data) {
            var bounds = this.utils.computeBoundsToLatLng(feed.latestValidation.bounds);
            var lat = data.defaultLocationLat;
            var lng = data.defaultLocationLon;
            if (!lat)
                lat = (bounds[0].lat + bounds[1].lat) / 2;
            if (!lng)
                lng = (bounds[0].lng + bounds[2].lng) / 2;
            var marker = this.computeMarker(feed.name, [lat, lng], bounds, feed.url, feed.isPublic, feed.projectId);
            this.router.url === "/my-datasets" ? this.map.addLayer(marker) : this.markerClusterGroup.addLayer(marker);
            this.markers.push(marker);
            // area over marker
            this.mapUtils.markerAreaOver(marker, this.map);
        }
    };
    DatasetsMapComponent.prototype.createMarker = function (feed) {
        // TODO : to change, the code is not clean
        if (this.router.url == "/my-datasets") {
            this.projectsApi.getPrivateProject(feed.projectId).then(function success(data) {
                return this.extractData(data, feed);
            }.bind(this));
        }
        else {
            this.projectsApi.getPublicProject(feed.projectId).then(function success(data) {
                return this.extractData(data, feed);
            }.bind(this));
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], DatasetsMapComponent.prototype, "mapId", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], DatasetsMapComponent.prototype, "boundsChange", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DatasetsMapComponent.prototype, "position", null);
    __decorate([
        Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], DatasetsMapComponent.prototype, "zoom", null);
    __decorate([
        Input(), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], DatasetsMapComponent.prototype, "feeds", null);
    DatasetsMapComponent = __decorate([
        Component({
            selector: 'app-datasets-map',
            templateUrl: 'datasets-map.component.html',
            providers: [ProjectsApiService]
        }), 
        __metadata('design:paramtypes', [UtilsService, Configuration, ProjectsApiService, MapUtilsService, Router, Store, DatasetsActions, SharedService, SessionService])
    ], DatasetsMapComponent);
    return DatasetsMapComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/datasets-map/datasets-map.component.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var leaflet = require("leaflet");
var common_1 = require("@angular/common");
require('leaflet.markercluster');
var _1 = require("app/modules/common/");
var DatasetsMapComponent = (function () {
    function DatasetsMapComponent(utils, config, projectsApi, mapUtils, store, datasetsAction, shared, translate, session) {
        this.utils = utils;
        this.config = config;
        this.projectsApi = projectsApi;
        this.mapUtils = mapUtils;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.shared = shared;
        this.translate = translate;
        this.session = session;
        this.datePipe = new common_1.DatePipe('en-US');
        this.boundsChange = new core_1.EventEmitter();
        this.initialPosition = this.config.MAP_DEFAULT_POSITION;
        this.initialZoom = this.config.MAP_ZOOM_UNKNOWN;
        //this.geolocalize();
        this.setCenterMap();
        this.markers = {};
        this.updateProject = this.updateProjectProperty.bind(this);
        this.NumberedDivIcon = mapUtils.createNumMarker();
    }
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
        this.computeMap(this.mapId);
        this.populateMap();
    };
    DatasetsMapComponent.prototype.reset = function () {
        console.log('map reset', this.initialPosition, this.initialZoom);
        this._zoom = this.initialZoom;
        this._position = this.initialPosition;
        this.goTo(this.map, this._position, true);
    };
    DatasetsMapComponent.prototype.geolocalize = function () {
        var _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (response) {
                _this.position = [response.coords.latitude, response.coords.longitude];
                console.log('geolocalize: available', _this._position);
            }, function () {
                console.log('geolocalize: geolocation not available');
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
        var tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        var options = {
            center: this.initialPosition,
            zoom: this.initialZoom,
            zoomControl: false,
            minZoom: 2,
            layers: [tiles]
        };
        var map = leaflet.map(cssId, options);
        this.map = map;
        this.markersGroup = leaflet.featureGroup();
        //add zoom control with your options
        leaflet.control.zoom({
            position: 'topright'
        }).addTo(map);
        map.addLayer(this.markerClusterGroup);
        map.addLayer(this.markersGroup);
        var that = this;
        map.on('moveend', function (e) {
            if (that.moveTimeoutId) {
                clearTimeout(that.moveTimeoutId);
            }
            that.moveTimeoutId = setTimeout(function () {
                that.filterFeedsInArea(e);
            }, 1000);
        });
        if (this._position) {
            this.goTo(map, this._position, false);
        }
    };
    DatasetsMapComponent.prototype.filterFeedsInArea = function (event) {
        var mapBounds = this.map.getBounds();
        var newCenter = this.map.getCenter();
        this.shared.setNewCenter(newCenter, event.target._zoom);
        var areaBounds = this.utils.computeLatLngToBounds([mapBounds.getNorthEast(), mapBounds.getSouthWest()]);
        this.boundsChange.emit(areaBounds);
    };
    // remove all marker from the map when refresh
    DatasetsMapComponent.prototype.clearMap = function () {
        this.markerClusterGroup.clearLayers();
        this.markersGroup.clearLayers();
    };
    DatasetsMapComponent.prototype.populateMap = function () {
        var _this = this;
        if (this._feeds && this.map) {
            this.clearMap();
            this.setFeedsLicenses(this._feeds);
            if (this._feeds.length > 0) {
                this._feeds.map(function (feed) {
                    if (feed.latestValidation && feed.latestValidation.bounds) {
                        _this.createMarker(feed);
                    }
                });
            }
        }
    };
    DatasetsMapComponent.prototype.setCenterMap = function () {
        var lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat !== 0 && lastCenter.lng !== 0) {
            this.position = [lastCenter.lat, lastCenter.lng];
        }
        else {
            this.geolocalize();
        }
    };
    DatasetsMapComponent.prototype.goTo = function (theMap, thePosition, isReset) {
        var theZoom = this._zoom || this.config.MAP_ZOOM_POSITION;
        var lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat !== 0 && lastCenter.lng !== 0 && isReset === false) {
            thePosition[0] = lastCenter.lat;
            thePosition[1] = lastCenter.lng;
            theZoom = lastCenter.zoom;
        }
        console.log('goTo', thePosition, theZoom);
        theMap.setView(thePosition, theZoom);
    };
    DatasetsMapComponent.prototype.computeMarker = function (feed, latLng, bounds) {
        var isDraggable = this.mapType === 'manage' ? true : false;
        var marker = leaflet.marker(latLng, {
            title: feed.name, draggable: isDraggable,
            icon: new this.NumberedDivIcon({
                number: feed.name.charAt(0),
                surClass: feed.isPublic ? 'public' : 'private'
            })
        });
        marker.isDisplayed = true;
        marker.data = {
            bounds: bounds,
            id: feed.projectId,
            feed: feed
        };
        if (isDraggable === true) {
            marker.on('dragend', this.updateProject);
        }
        var tooltipData = '';
        var that = this;
        marker.on('click', function (event) {
            event.target.setPopupContent(that.computeMarkerPopup(event.target.data.feed));
        });
        marker.bindPopup(tooltipData, {
            direction: 'top'
        });
        return marker;
    };
    DatasetsMapComponent.prototype.setFeedsLicenses = function (value) {
        var licenses = this.shared.getLicenses();
        this.feedsLicenses = {};
        if (licenses && value) {
            for (var k = 0; k < value.length; k++) {
                var feed = value[k];
                for (var i = 0; i < licenses.length; i++) {
                    if (licenses[i].feedIds) {
                        for (var j = 0; j < licenses[i].feedIds.length; j++) {
                            if (feed.id === licenses[i].feedIds[j]) {
                                this.feedsLicenses[feed.id] = licenses[i];
                            }
                        }
                    }
                }
            }
        }
    };
    DatasetsMapComponent.prototype.getPopupName = function (feed) {
        var res = '';
        if (this.mapType === 'manage') {
            if (feed.isPublic) {
                res += '<a href="/feeds/' + feed.id + '/' + feed.isPublic + '">' +
                    feed.name + '</a></b> (' + this.translate.instant('mydatasets-table.column.isPublic.label') + ')';
            }
            else {
                res += feed.name + '</b> (' + this.translate.instant('mydatasets-table.column.isPublic.private') + ')';
            }
        }
        else {
            res += '<a href="/feeds/' + feed.id + '/' + feed.isPublic + '">' + feed.name + '</a></b>';
        }
        res += '<a href="/feeds/' + feed.id + '/' + feed.isPublic + '" class="pull-right">' +
            this.translate.instant('popup.detail') + '</a>';
        return res;
    };
    DatasetsMapComponent.prototype.computeMarkerPopup = function (feed) {
        var license = this.feedsLicenses[feed.id];
        var popupHtml = '<b>';
        popupHtml += this.getPopupName(feed);
        if (license && license.id) {
            popupHtml += '<br/><b>License</b>: ' + license.name;
        }
        popupHtml += '<br/>';
        popupHtml += '<b>' + this.translate.instant('feed.period') + '</b> ' + this.datePipe.transform(feed.latestValidation.startDate, 'y-MM-dd');
        popupHtml += '<b>' + this.translate.instant('feed.period_to') + '</b> ' +
            this.datePipe.transform(feed.latestValidation.endDate, 'y-MM-dd');
        popupHtml += '<br/><b>' + this.translate.instant('feed.routes') + '</b> ' + feed.latestValidation.routeCount;
        popupHtml += '<br/><b>' + this.translate.instant('feed.stops') + '</b> ' + feed.latestValidation.stopTimesCount;
        if (feed.lastUpdated) {
            var date = this.datePipe.transform(feed.lastUpdated, 'y-MM-dd');
            popupHtml += '<br/><b>' + this.translate.instant('mydatasets-table.column.updated') + '</b> : ' + date;
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
            if (!lat) {
                lat = (bounds[0].lat + bounds[1].lat) / 2;
            }
            if (!lng) {
                lng = (bounds[0].lng + bounds[2].lng) / 2;
            }
            var marker = this.computeMarker(feed, [lat, lng], bounds);
            this.mapType === 'manage' ? this.markersGroup.addLayer(marker) :
                this.markerClusterGroup.addLayer(marker);
            this.markers[feed.id] = marker;
            // area over marker
            this.mapUtils.markerAreaOver(marker, this.map);
        }
    };
    DatasetsMapComponent.prototype.createMarker = function (feed) {
        // TODO : to change, the code is not clean
        if (this.mapType === 'manage') {
            this.projectsApi.getPrivateProject(feed.projectId).then(function success(data) {
                return this.extractData(data, feed);
            }.bind(this));
        }
        else {
            this.projectsApi.getPublicProject(feed.projectId).then(function success(data) {
                this.extractData(data, feed);
            }.bind(this));
        }
    };
    return DatasetsMapComponent;
}());
__decorate([
    core_1.Input()
], DatasetsMapComponent.prototype, "mapId");
__decorate([
    core_1.Input()
], DatasetsMapComponent.prototype, "mapType");
__decorate([
    core_1.Output()
], DatasetsMapComponent.prototype, "boundsChange");
__decorate([
    core_1.Input()
], DatasetsMapComponent.prototype, "position");
__decorate([
    core_1.Input()
], DatasetsMapComponent.prototype, "zoom");
__decorate([
    core_1.Input()
], DatasetsMapComponent.prototype, "feeds");
DatasetsMapComponent = __decorate([
    core_1.Component({
        selector: 'app-datasets-map',
        templateUrl: 'datasets-map.component.html',
        providers: [_1.ProjectsApiService]
    })
], DatasetsMapComponent);
exports.DatasetsMapComponent = DatasetsMapComponent;

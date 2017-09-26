"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var leaflet = require("leaflet");
require('leaflet.markercluster');
var NB_ROUTE_MAX = 100;
var FeedMapComponent = (function () {
    function FeedMapComponent(utils, config, mapUtils, datasetsAction, feedsApi, store, sessionService, projectsApi, feedMapUtils, shared) {
        this.utils = utils;
        this.config = config;
        this.mapUtils = mapUtils;
        this.datasetsAction = datasetsAction;
        this.feedsApi = feedsApi;
        this.store = store;
        this.sessionService = sessionService;
        this.projectsApi = projectsApi;
        this.feedMapUtils = feedMapUtils;
        this.shared = shared;
        this.routes = [];
        this.stops = [];
        this.stopsMarkers = new Array();
        this.stationsMarkers = new Array();
        this.initialPosition = this.config.MAP_DEFAULT_POSITION;
        this.initialZoom = this.config.MAP_ZOOM_UNKNOWN;
        this.loading = false;
        this.NumberedDivIcon = mapUtils.createNumMarker();
        this.ImageDivIcon = mapUtils.createIconMarker(10, null, 20, 20);
        this.afterAuth();
    }
    FeedMapComponent.prototype.ngAfterViewInit = function () {
        this.map = this.computeMap(this.mapId);
    };
    FeedMapComponent.prototype.afterAuth = function () {
        var that = this;
        this.sessionService.loggedIn$.subscribe(function (loggedIn) {
            if (loggedIn) {
                that.feed = that._feed;
            }
        });
    };
    Object.defineProperty(FeedMapComponent.prototype, "feed", {
        set: function (value) {
            this._feed = value;
            if (this.map) {
                this.populateMap();
            }
        },
        enumerable: true,
        configurable: true
    });
    FeedMapComponent.prototype.laodRoutes = function () {
        if (this._feed && this._feed.id && this.sessionService.loggedIn) {
            this.allPatterns = {};
            this.stopsMarkers.length = 0;
            this.stationsMarkers.length = 0;
            var that_1 = this;
            this.loading = true;
            this.feedsApi.getStops(this._feed.id, this._feed.selectedVersion ?
                this._feed.selectedVersion.id : this._feed.id, this._feed.isPublic).then(function (response) {
                that_1.stops = response;
                that_1.loading = false;
            })["catch"](function () { return that_1.loading = false; });
            this.loading = true;
            this.feedsApi.getRoutes(this._feed.id, this._feed.selectedVersion ?
                this._feed.selectedVersion.id : this._feed.id, this._feed.isPublic).then(function (response) {
                that_1.routes = response;
                that_1.loading = false;
            })["catch"](function () { return that_1.loading = false; });
        }
    };
    FeedMapComponent.prototype.checkAuthorisations = function () {
        this.isAuthorised = this.utils.userHasRightsOnFeed(this.sessionService.userProfile, this._feed.projectId, this._feed.id);
    };
    FeedMapComponent.prototype.computeMap = function (id) {
        var tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        this.stopsMarkersClusterGroup = this.feedMapUtils.createClusterGroup(true);
        this.stationsMarkersClusterGroup = this.feedMapUtils.createClusterGroup(false);
        this.patternsGroup = leaflet.featureGroup();
        var overlayMaps = {
            '<span class="legend-item legend-stop"><i class="fa fa-lg fa-flag-checkered"></i></span> Stops': this.stopsMarkersClusterGroup,
            '<span class="legend-item legend-station"><i class="fa fa-lg fa-train"></i></span> Stations': this.stationsMarkersClusterGroup
        };
        var options = {
            center: this.initialPosition,
            zoom: 10,
            zoomControl: false,
            minZoom: 2,
            layers: [tiles]
        };
        var map = leaflet.map(id, options);
        this.stopsMarkersClusterGroup.addTo(map);
        this.stationsMarkersClusterGroup.addTo(map);
        this.patternsGroup.addTo(map);
        leaflet.control.layers(null, overlayMaps).addTo(map);
        return map;
    };
    FeedMapComponent.prototype.clearMap = function () {
        this.stopsMarkersClusterGroup.clearLayers();
        this.stationsMarkersClusterGroup.clearLayers();
        this.patternsGroup.clearLayers();
    };
    FeedMapComponent.prototype.extractData = function (data, clearMap) {
        if (clearMap === void 0) { clearMap = true; }
        if (this._feed && this.map) {
            if (clearMap) {
                this.clearMap();
            }
            if (data) {
                var lat = data.defaultLocationLat;
                var lng = data.defaultLocationLon;
                if (!this._feed.latestValidation) {
                    return;
                }
                var bounds = this.utils.computeBoundsToLatLng(this._feed.latestValidation.bounds);
                if (!lat && !bounds) {
                    return;
                }
                if (!lat) {
                    lat = (bounds[0].lat + bounds[1].lat) / 2;
                }
                if (!lng) {
                    lng = (bounds[0].lng + bounds[2].lng) / 2;
                }
                if (this.feedMarker && this.map.hasLayer(this.feedMarker)) {
                    this.map.removeLayer(this.feedMarker);
                }
                this.feedMarker = this.createMarker(this._feed, [lat, lng], bounds);
                var coord = leaflet.latLng(lat, lng);
                this.map.setView(coord, 10);
                this.map.addLayer(this.feedMarker);
            }
        }
    };
    FeedMapComponent.prototype.populateMap = function () {
        var that = this;
        this.checkAuthorisations();
        if (this.isAuthorised) {
            this.projectsApi.getPrivateProject(this._feed.projectId).then(function success(data) {
                that.extractData(data);
                that.extractedData = data;
                that.laodRoutes();
            });
        }
        else {
            this.projectsApi.getPublicProject(this._feed.projectId).then(function success(data) {
                that.extractData(data);
                that.extractedData = data;
                that.laodRoutes();
            });
        }
    };
    FeedMapComponent.prototype.createMarker = function (feed, latLng, bounds) {
        var isDraggable = this.isAuthorised;
        var marker = leaflet.marker(latLng, {
            title: feed.name, draggable: isDraggable,
            icon: new this.NumberedDivIcon({
                number: feed.name.charAt(0),
                surClass: feed.isPublic ? 'public' : 'private'
            })
        });
        var that = this;
        if (isDraggable === true) {
            marker.data = {
                bounds: bounds,
                id: feed.projectId
            };
            marker.on('dragend', function (event) {
                that.updateProjectProperty(event);
            });
        }
        return marker;
    };
    // Update the Lat and Lng of the project
    FeedMapComponent.prototype.updateProjectProperty = function (ev) {
        var updateProject;
        var changedPos = ev.target.getLatLng();
        updateProject = {
            defaultLocationLat: changedPos.lat,
            defaultLocationLon: changedPos.lng
        };
        this.store.dispatch(this.datasetsAction.updateProject(ev.target.data.id, updateProject));
    };
    /**
      *
      *
      *
      *
      *                   PATTERNS
      *
      *
      *
      *
      *
    */
    FeedMapComponent.prototype.createPattern = function (type, pattern) {
        var geojson = this.createGeoJSONFeature(type, pattern);
        if (!geojson) {
            return;
        }
        if (type === 'shape') {
            geojson.eachLayer(this.bindTooltipToRoute.bind(this));
            geojson.eachLayer(this.addEventsToRoute.bind(this));
            geojson.setStyle(this.feedMapUtils.getGeoJSONStyle);
        }
        geojson.addTo(this.patternsGroup);
        if (!this.allPatterns[pattern.routeId]) {
            this.allPatterns[pattern.routeId] = [];
        }
        this.allPatterns[pattern.routeId].push(geojson);
        var bounds = this.patternsGroup.getBounds();
        if (bounds._southWest) {
            this.map.fitBounds(bounds);
        }
    };
    FeedMapComponent.prototype.createTripPatterns = function (patterns) {
        if (patterns) {
            for (var i = 0; i < patterns.length; i++) {
                this.createPattern('shape', patterns[i]);
            }
        }
    };
    FeedMapComponent.prototype.getAllStops = function (patterns) {
        if (patterns) {
            for (var i = 0; i < patterns.length; i++) {
                this.createStops(this.getStops(patterns[i]));
            }
        }
    };
    FeedMapComponent.prototype.createStops = function (stopObj) {
        if (!stopObj || !stopObj.routeId) {
            return;
        }
        var stops = stopObj.stops;
        for (var i = 0; i < stops.length; i++) {
            var stop = stops[i];
            var marker = leaflet.marker([stop.lat, stop.lon], {
                title: stop.stopName,
                draggable: false,
                icon: new this.ImageDivIcon({
                    faIcon: (stop.locationType === 'STOP' ? 'fa-flag-checkered' : 'fa-train'),
                    surClass: (stop.locationType === 'STOP' ? 'stop-marker' : 'station-marker')
                })
            });
            var that = this;
            marker.model = stop;
            this.addOverStopMarkerTooltip(marker);
            if (!this.allPatterns[stopObj.routeId]) {
                this.allPatterns[stopObj.routeId] = [];
            }
            this.allPatterns[stopObj.routeId].push(marker);
            if (stop.locationType === 'STOP') {
                this.stopsMarkersClusterGroup.addLayer(marker);
                this.stopsMarkers.push(marker);
            }
            else {
                this.stationsMarkersClusterGroup.addLayer(marker);
                this.stationsMarkers.push(marker);
            }
        }
    };
    FeedMapComponent.prototype.addOverStopMarkerTooltip = function (marker) {
        var stop = marker.model;
        var tooltip = '<b>' + stop.stopName + '</b>';
        tooltip += ('<br><b>type:</b> ' + stop.locationType);
        tooltip += stop.bikeParking ? ('<br>bikeParking: ' + stop.bikeParking) : '';
        tooltip += stop.carParking ? ('<br>carParking: ' + stop.carParking) : '';
        marker.bindTooltip(tooltip, { direction: 'top' }).openTooltip();
        marker.bindPopup(tooltip);
    };
    FeedMapComponent.prototype.getStops = function (pattern) {
        var res = [];
        if (pattern && pattern.patternStops) {
            var stopsById = [];
            var i = 0;
            for (i = 0; i < pattern.patternStops.length; i++) {
                stopsById.push(pattern.patternStops[i].stopId);
            }
            for (i = 0; i < this.stops.length; i++) {
                if (stopsById.indexOf(this.stops[i].id) > -1) {
                    res.push(this.stops[i]);
                }
            }
            return {
                routeId: pattern.routeId,
                stops: res
            };
        }
        else {
            return {};
        }
    };
    FeedMapComponent.prototype.onRouteCheckAll = function (event) {
        if (event.target.checked) {
            for (var i = 0; i < Math.min(this.routes.length, NB_ROUTE_MAX); i++) {
                this.routes[i].checked = event.target.checked;
                this.onRouteChecked(event, this.routes[i]);
            }
        }
        else {
            for (var i = 0; i < this.routes.length; i++) {
                this.routes[i].checked = event.target.checked;
            }
            this.allPatterns = {};
            this.patternsGroup.clearLayers();
            this.stopsMarkersClusterGroup.clearLayers();
            this.stationsMarkersClusterGroup.clearLayers();
        }
    };
    FeedMapComponent.prototype.onRouteChecked = function (event, route) {
        var checkRoute = function (vm) {
            var data = vm.feedMapUtils.getRouteData(route.id, vm.routes);
            if (data) {
                var that_2 = vm;
                vm.loading = true;
                vm.feedsApi.getRouteTripPattern(vm._feed.id, vm._feed.selectedVersion ? vm._feed.selectedVersion.id : vm._feed.id, data.id, vm._feed.isPublic).then(function (responseTrip) {
                    that_2.createTripPatterns(responseTrip);
                    that_2.getAllStops(responseTrip);
                    that_2.loading = false;
                })["catch"](function () { return that_2.loading = false; });
            }
        };
        var unCheckRoute = function (vm) {
            for (var i = 0; vm.allPatterns[route.id] && i < vm.allPatterns[route.id].length; i++) {
                if (vm.patternsGroup.hasLayer(vm.allPatterns[route.id][i])) {
                    vm.patternsGroup.removeLayer(vm.allPatterns[route.id][i]);
                }
                if (vm.stopsMarkersClusterGroup.hasLayer(vm.allPatterns[route.id][i])) {
                    vm.stopsMarkersClusterGroup.removeLayer(vm.allPatterns[route.id][i]);
                }
                if (vm.stationsMarkersClusterGroup.hasLayer(vm.allPatterns[route.id][i])) {
                    vm.stationsMarkersClusterGroup.removeLayer(vm.allPatterns[route.id][i]);
                }
            }
        };
        if (event.target.checked) {
            checkRoute(this);
        }
        else {
            unCheckRoute(this);
        }
    };
    FeedMapComponent.prototype.bindTooltipToRoute = function (layer) {
        if (layer.feature.properties.routeData) {
            var color = layer.feature.properties.routeData.routeTextColor ?
                ('#' + layer.feature.properties.routeData.routeTextColor) : '';
            color = (color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff') ? '#000000' : color;
            var label = '<label style="color:' + color + '">' + layer.feature.properties.routeData.routeLongName +
                '</label>';
            layer.bindTooltip(label, { direction: 'top' });
        }
    };
    FeedMapComponent.prototype.addEventsToRoute = function (layer) {
        if (layer.feature.properties.routeData) {
            var that_3 = this;
            layer.on('mouseover', function (event) {
                layer.openTooltip(event.latlng);
                if (event.target.feature.properties.type === 'stop') {
                    event.target.bringToFront();
                }
                else {
                    event.target.bringToBack();
                }
                event.target.setStyle(that_3.feedMapUtils.getGeoJSONStyleOver());
            });
            layer.on('mouseout', function (event) {
                layer.closeTooltip();
                event.target.setStyle(that_3.feedMapUtils.getGeoJSONStyle(event.target.feature));
            });
            layer.on('click', function (event) {
                event.target.bringToFront();
                that_3.map.fitBounds(event.target._bounds);
            });
        }
    };
    FeedMapComponent.prototype.createGeoJSONFeature = function (type, pattern) {
        if (!pattern || !pattern[type]) {
            return;
        }
        var patternsGeoJSON = leaflet.geoJSON();
        var geojsonFeature = {
            type: 'Feature',
            properties: {
                pattern: pattern,
                routeData: this.feedMapUtils.getRouteData(pattern.routeId, this.routes)
            },
            geometry: pattern[type]
        };
        patternsGeoJSON.addData(geojsonFeature);
        return patternsGeoJSON;
    };
    return FeedMapComponent;
}());
__decorate([
    core_1.Input()
], FeedMapComponent.prototype, "mapId");
__decorate([
    core_1.Input()
], FeedMapComponent.prototype, "feed");
FeedMapComponent = __decorate([
    core_1.Component({
        selector: 'ct-feed-map',
        templateUrl: 'feed-map.html'
    })
], FeedMapComponent);
exports.FeedMapComponent = FeedMapComponent;

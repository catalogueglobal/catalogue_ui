import {  Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as leaflet                                              from "leaflet";
import { Store }                                                 from "@ngrx/store";
require('leaflet.markercluster');
import { IFeed, FeedsApiService }                                from "app/commons/services/api/feedsApi.service";
import { MapUtilsService }                                       from "app/commons/services/mapUtils.service";
import { UtilsService }                                          from "app/commons/services/utils.service";
import { DatasetsActions }                                       from "app/state/datasets/datasets.actions";
import { DatasetsState }                                         from "app/state/datasets/datasets.reducer";
import { Configuration }                                         from "app/commons/configuration";
import { ProjectsApiService }                                    from "app/commons/services/api/projectsApi.service";
import { SessionService }                      from "app/commons/services/session.service";
import {FeedMapUtilsService} from "app/commons/components/feed-map/feed-map-utils.service";

const NB_ROUTE_MAX = 100;

@Component({
    selector: 'ct-feed-map',
    templateUrl: 'feed-map.html'
})
export class FeedMapComponent implements AfterViewInit {
    @Input() mapId: string;
    private _feed;
    private routes = [];
    private allShapesGeojsonsFeatures;
    map: leaflet.Map;
    stopsMarkers: Array<leaflet.Marker>;
    stationsMarkers: Array<leaflet.Marker>;
    initialPosition = this.config.MAP_DEFAULT_POSITION;
    _position;
    initialZoom: number = this.config.MAP_ZOOM_UNKNOWN;
    _zoom: number;
    NumberedDivIcon;
    ImageDivIcon;
    stopsMarkersClusterGroup;
    stationsMarkersClusterGroup;
    patternsGroup;
    feedMarker;
    isAuthorised;

    constructor(private utils: UtilsService,
        private config: Configuration,
        private mapUtils: MapUtilsService,
        protected datasetsAction: DatasetsActions,
        private feedsApi: FeedsApiService,
        private store: Store<DatasetsState>,
        private sessionService: SessionService,
        private projectsApi: ProjectsApiService,
        private feedMapUtils: FeedMapUtilsService

    ) {
        this.stopsMarkers = new Array();
        this.stationsMarkers = new Array();
        this.NumberedDivIcon = mapUtils.createNumMarker();
        this.ImageDivIcon = mapUtils.createIconMarker();
    }

    ngAfterViewInit() {
        this.map = this.computeMap(this.mapId);
    }

    @Input() set feed(value: any) {
        this._feed = value;
        if (this.map) {
            this.populateMap();
        }
        if (this._feed && this._feed.id && this.sessionService.loggedIn) {
            this.allShapesGeojsonsFeatures = {};

            let that = this;
            this.feedsApi.getStops(this._feed.id).then(function(response) {
                that.createStops(response);
            });
            this.feedsApi.getRoutes(this._feed.id).then(function(response) {
                that.routes = response;
            })
        }
    }

    private checkAuthorisations() {
        this.isAuthorised = this.utils.userHasRightsOnFeed(this.sessionService.userProfile, this._feed.projectId, this._feed.id);
    }

    protected computeMap(id): leaflet.Map {
        let tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        this.stopsMarkersClusterGroup = this.feedMapUtils.createClusterGroup(true);
        this.stationsMarkersClusterGroup = this.feedMapUtils.createClusterGroup(false);
        this.patternsGroup = leaflet.featureGroup();
        var overlayMaps = {
            '<i class="fa fa-lg fa-flag-checkered"></i> Stops': this.stopsMarkersClusterGroup,
            '<i class="fa fa-lg fa-train"></i> Stations': this.stationsMarkersClusterGroup
        };
        let options = {
            center: <any>this.initialPosition,
            zoom: 10,
            zoomControl: false,
            minZoom: 2,
            layers: [tiles]
        }
        let map = leaflet.map(id, options);
        this.stopsMarkersClusterGroup.addTo(map);
        this.stationsMarkersClusterGroup.addTo(map);
        this.patternsGroup.addTo(map);
        leaflet.control.layers(null, overlayMaps).addTo(map);
        return map;
    }

    private clearMap() {
        this.stopsMarkersClusterGroup.clearLayers();
        this.stationsMarkersClusterGroup.clearLayers();
    }

    private extractData(data) {
        if (this._feed && this.map) {
            this.clearMap();
            if (data) {
                let lat = data.defaultLocationLat;
                let lng = data.defaultLocationLon;
                let bounds = this.utils.computeBoundsToLatLng(this._feed.latestValidation.bounds);
                if (!lat && !bounds) {
                    return;
                }
                if (!lat)
                    lat = (bounds[0].lat + bounds[1].lat) / 2;
                if (!lng)
                    lng = (bounds[0].lng + bounds[2].lng) / 2;
                this.feedMarker = this.createMarker(this._feed, [lat, lng], bounds);
                var coord: leaflet.LatLngExpression = leaflet.latLng(lat, lng);
                this.map.setView(coord, 10);
                this.map.addLayer(this.feedMarker);
            }
        }
    }

    private populateMap() {
        let that = this;
        this.checkAuthorisations();
        if (this.isAuthorised) {
            this.projectsApi.getPrivateProject(this._feed.projectId).then(function success(data) {
                that.extractData(data);
            });
        } else {
            this.projectsApi.getPublicProject(this._feed.projectId).then(function success(data) {
                that.extractData(data);
            });
        }
    }

    private fitBounds(stop: boolean) {
        if (stop) {
            if (this.stopsMarkers.length > 0) {
                this.map.fitBounds(this.stopsMarkersClusterGroup.getBounds());
            }
        } else {
            if (this.stationsMarkers.length > 0) {
                this.map.fitBounds(this.stationsMarkersClusterGroup.getBounds());
            }
        }
    }

    protected createMarker(feed, latLng, bounds): leaflet.Marker {
        let isDraggable: boolean = this.isAuthorised;
        let marker: any = leaflet.marker(latLng, {
            title: feed.name, draggable: isDraggable,
            icon: new this.NumberedDivIcon({
                number: feed.name.charAt(0),
                surClass: feed.isPublic ? 'public' : 'private'
            })
        });
        let that = this;
        marker.on('click', function(event) {
            that.clickMarker(event);
        });
        if (isDraggable === true) {
            marker.data = {
                bounds: bounds,
                id: feed.projectId
            };
            marker.on('dragend', function(event) {
                that.updateProjectProperty(event);
            });
        }
        return marker;
    }

    // Update the Lat and Lng of the project
    private updateProjectProperty(ev) {
        var updateProject;
        var changedPos = ev.target.getLatLng();
        updateProject = {
            defaultLocationLat: changedPos.lat,
            defaultLocationLon: changedPos.lng
        };
        this.store.dispatch(this.datasetsAction.updateProject(ev.target.data.id, updateProject));
    }

    private clickMarker(event) {
        this.stopsMarkersClusterGroup.bringToFront();
        this.fitBounds(true);
    }

    private clickSSMarker(event) {

    }

    protected createStops(stops) {
        for (let i = 0; i < stops.length; i++) {
            let stop = stops[i];
            let marker: any = leaflet.marker([stop.lat, stop.lon], {
                title: stop.stopName,
                draggable: false,
                icon: new this.ImageDivIcon({
                    faIcon: (stop.locationType === 'STOP' ? 'fa-flag-checkered' : 'fa-train'),
                    surClass: (stop.locationType === 'STOP' ? 'stop-marker' : 'station-marker')
                })
            });
            let that = this;
            marker.model = stop;
            marker.on('mouseover', function(event) {
                that.onMouseOverStopMarker(event);
            });
            marker.on('mouseout', function(event) {
                that.onMouseOutStopMarker(event);
            });
            if (stop.locationType === 'STOP') {
                this.stopsMarkersClusterGroup.addLayer(marker);
                this.stopsMarkers.push(marker);
            } else {
                this.stationsMarkersClusterGroup.addLayer(marker);
                this.stationsMarkers.push(marker);
            }
        }
    }

    private onMouseOverStopMarker(event) {
        let stop = event.target.model;
        let tooltip = '<b>' + stop.stopName + '</b>';
        tooltip += ('<br><b>type:</b> ' + stop.locationType);
        tooltip += stop.bikeParking ? ('<br>bikeParking: ' + stop.bikeParking) : '';
        tooltip += stop.carParking ? ('<br>carParking: ' + stop.carParking) : '';

        event.target.bindTooltip(tooltip, { direction: 'top' }).openTooltip();
        event.target.bindPopup(tooltip);
    }

    private onMouseOutStopMarker(event) {
        event.target.bindTooltip('').closeTooltip();
    }

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

    private createPattern(type, pattern) {
        var geojson = this.createGeoJSONFeature(type, pattern);
        if (geojson) {
            geojson.eachLayer(this.bindTooltipToRoute.bind(this));
            geojson.eachLayer(this.addEventsToRoute.bind(this));
            geojson.setStyle(this.feedMapUtils.getGeoJSONStyle);
            geojson.addTo(this.patternsGroup);
            if (!this.allShapesGeojsonsFeatures[pattern.routeId]) {
                this.allShapesGeojsonsFeatures[pattern.routeId] = [];
            }
            this.allShapesGeojsonsFeatures[pattern.routeId].push(geojson);
            this.map.fitBounds(this.patternsGroup.getBounds());
        }
    }

    private createTripPatterns(patterns) {
        if (patterns) {

            for (var i = 0; i < patterns.length; i++) {
                this.createPattern('shape', patterns[i]);
                this.createPattern('stopConnections', patterns[i]);
            }
        }
    }

    private onRouteCheckAll(event) {
        if (event.target.checked) {
            for (var i = 0; i < Math.min(this.routes.length, NB_ROUTE_MAX); i++) {
                this.routes[i].checked = event.target.checked;
                this.onRouteChecked(event, this.routes[i]);
            }
        } else {
            for (var i = 0; i < this.routes.length; i++) {
                this.routes[i].checked = event.target.checked;
            }
            this.allShapesGeojsonsFeatures = {};
            this.patternsGroup.clearLayers();
        }
    }

    private onRouteChecked(event, route) {
        var checkRoute = function(vm) {
            var data = vm.feedMapUtils.getRouteData(route.id, vm.routes);
            if (data) {
                let that = vm;
                vm.feedsApi.getRouteTripPattern(vm._feed.id, data.id).then(function(responseTrip) {
                    that.createTripPatterns(responseTrip);
                });
            }
        };

        var unCheckRoute = function(vm) {
            for (var i = 0; i < vm.allShapesGeojsonsFeatures[route.id].length; i++) {
                if (vm.patternsGroup.hasLayer(vm.allShapesGeojsonsFeatures[route.id][i])) {
                    vm.patternsGroup.removeLayer(vm.allShapesGeojsonsFeatures[route.id][i]);
                    delete vm.allShapesGeojsonsFeatures[route.id];
                }
            }
        }

        if (event.target.checked) {
            if (!this.allShapesGeojsonsFeatures[route.id] || this.allShapesGeojsonsFeatures[route.id].length === 0) {
                checkRoute(this);
            }
        } else {
            if (this.allShapesGeojsonsFeatures[route.id]) {
                unCheckRoute(this);
            }

        }
    }

    private bindTooltipToRoute(layer) {
        if (layer.feature.properties.routeData) {
            let color = layer.feature.properties.routeData.routeTextColor ?
                ('#' + layer.feature.properties.routeData.routeTextColor) : '';
            let label = '<label style="color:' + color + '">' + layer.feature.properties.routeData.routeLongName +
                '</label>';
            console.log(label, layer.feature.properties.routeData.routeTextColor);
            layer.bindTooltip(label, { direction: 'top' });
            layer.bindPopup(label);
        }
    }

    private addEventsToRoute(layer) {
        if (layer.feature.properties.routeData) {
            let that = this;
            layer.on('mouseover', function(event) {
                if (event.target.feature.properties.type === 'stop') {
                    event.target.bringToFront();
                } else {
                    event.target.bringToBack();
                }
                event.target.setStyle(that.feedMapUtils.getGeoJSONStyleOver())
            })
            layer.on('mouseout', function(event) {
                event.target.setStyle(that.feedMapUtils.getGeoJSONStyle(event.target.feature))
            })
            layer.on('click', function(event) {
                event.target.bringToFront();
                that.map.fitBounds(event.target._bounds);
            })
        }
    }

    private createGeoJSONFeature(type: string, pattern: any): leaflet.GeoJSON {
        if (!pattern || !pattern[type]){
            return;
        }
        if (type === 'shape') {
            var patternsGeoJSON: leaflet.GeoJSON = leaflet.geoJSON();
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
        } else {
            var routeData = this.feedMapUtils.getRouteData(pattern.routeId, this.routes);
            var patternsGeoJSON: leaflet.GeoJSON = leaflet.geoJSON();
            for (var i = 0; i < pattern[type].length; i++) {
                var feature = {
                    type: 'Feature',
                    properties: {
                        pattern: pattern[type][i],
                        routeData: routeData,
                        type: 'stop'
                    },
                    geometry: pattern[type][i]
                };
                try {
                    patternsGeoJSON.addData(feature);
                } catch (error) {
                    console.log(error);
                }
            }
            return patternsGeoJSON;
        }
    }
}
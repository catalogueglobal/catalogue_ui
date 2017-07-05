import {  Component, AfterViewInit, Input } from '@angular/core';
import * as leaflet                                              from "leaflet";
import { Store }                                                 from "@ngrx/store";
require('leaflet.markercluster');
import { IFeed,
    FeedsApiService,
    MapUtilsService,
    UtilsService,
    Configuration,
    SessionService,
    SharedService,
    ProjectsApiService
}                                from "app/modules/common/";
import { DatasetsActions }                                       from "app/state/datasets/datasets.actions";
import { DatasetsState }                                         from "app/state/datasets/datasets.reducer";
import {FeedMapUtilsService} from "app/commons/components/feed-map/feed-map-utils.service";
import { Subscription } from 'rxjs/Subscription';

const NB_ROUTE_MAX = 100;

@Component({
    selector: 'ct-feed-map',
    templateUrl: 'feed-map.html'
})
export class FeedMapComponent implements AfterViewInit {
    @Input() mapId: string;
    private _feed;
    private routes = [];
    private allPatterns;
    map: leaflet.Map;
    private stops = [];
    stopsMarkers: Array<leaflet.Marker> = new Array();
    stationsMarkers: Array<leaflet.Marker> = new Array();
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
    loading = false;
    extractedData;

    private subscription: Subscription;

    constructor(private utils: UtilsService,
        private config: Configuration,
        private mapUtils: MapUtilsService,
        protected datasetsAction: DatasetsActions,
        private feedsApi: FeedsApiService,
        private store: Store<DatasetsState>,
        private sessionService: SessionService,
        private projectsApi: ProjectsApiService,
        private feedMapUtils: FeedMapUtilsService,
        private shared: SharedService

    ) {
        this.NumberedDivIcon = mapUtils.createNumMarker();
        this.ImageDivIcon = mapUtils.createIconMarker(10, null, 20, 20);
        this.afterAuth();
    }

    ngAfterViewInit() {
        this.map = this.computeMap(this.mapId);
    }

    private afterAuth() {
        let that = this;
        this.sessionService.loggedIn$.subscribe((loggedIn) => {
            if (loggedIn) {
                that.feed = that._feed;
            }
        });
    }

    @Input() set feed(value: any) {
        this._feed = value;
        if (this.map) {
            this.populateMap();
        }
    }

    private laodRoutes() {
        if (this._feed && this._feed.id && this.sessionService.loggedIn) {
            this.allPatterns = {};
            this.stopsMarkers.length = 0;;
            this.stationsMarkers.length = 0;

            let that = this;
            this.loading = true;
            this.feedsApi.getStops(this._feed.id, this._feed.selectedVersion ?
                this._feed.selectedVersion.id : this._feed.id, this._feed.isPublic).then(function(response) {
                    that.stops = response;
                    that.loading = false;
                }).catch(() => that.loading = false);
            this.loading = true;
            this.feedsApi.getRoutes(this._feed.id, this._feed.selectedVersion ?
                this._feed.selectedVersion.id : this._feed.id, this._feed.isPublic).then(function(response) {
                    that.routes = response;
                    that.loading = false;
                }).catch(() => that.loading = false);
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
        let overlayMaps = {
            '<span class="legend-item legend-stop"><i class="fa fa-lg fa-flag-checkered"></i></span> Stops': this.stopsMarkersClusterGroup,
            '<span class="legend-item legend-station"><i class="fa fa-lg fa-train"></i></span> Stations': this.stationsMarkersClusterGroup
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
        this.patternsGroup.clearLayers();
    }

    private extractData(data, clearMap = true) {
        if (this._feed && this.map) {
            if (clearMap) {
                this.clearMap();
            }
            if (data) {
                let lat = data.defaultLocationLat;
                let lng = data.defaultLocationLon;
                if (!this._feed.latestValidation) {
                    return;
                }
                let bounds = this.utils.computeBoundsToLatLng(this._feed.latestValidation.bounds);
                if (!lat && !bounds) {
                    return;
                }
                if (!lat)
                    lat = (bounds[0].lat + bounds[1].lat) / 2;
                if (!lng)
                    lng = (bounds[0].lng + bounds[2].lng) / 2;
                if (this.feedMarker && this.map.hasLayer(this.feedMarker)) {
                    this.map.removeLayer(this.feedMarker);
                }

                this.feedMarker = this.createMarker(this._feed, [lat, lng], bounds);
                let coord: leaflet.LatLngExpression = leaflet.latLng(lat, lng);
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
                that.extractedData = data;
                that.laodRoutes();
            });
        } else {
            this.projectsApi.getPublicProject(this._feed.projectId).then(function success(data) {
                that.extractData(data);
                that.extractedData = data;
                that.laodRoutes();
            });
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
        let updateProject;
        let changedPos = ev.target.getLatLng();
        updateProject = {
            defaultLocationLat: changedPos.lat,
            defaultLocationLon: changedPos.lng
        };
        this.store.dispatch(this.datasetsAction.updateProject(ev.target.data.id, updateProject));
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
        let geojson = this.createGeoJSONFeature(type, pattern);
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
        let bounds = this.patternsGroup.getBounds();
        if (bounds._southWest) {
            this.map.fitBounds(bounds);
        }
    }

    private createTripPatterns(patterns) {
        if (patterns) {
            for (let i = 0; i < patterns.length; i++) {
                this.createPattern('shape', patterns[i]);
            }
        }
    }

    private getAllStops(patterns) {
        if (patterns) {
            for (let i = 0; i < patterns.length; i++) {
                this.createStops(this.getStops(patterns[i]));
            }
        }
    }

    protected createStops(stopObj) {
        if (!stopObj || !stopObj.routeId) {
            return;
        }
        let stops = stopObj.stops;
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
            this.addOverStopMarkerTooltip(marker);
            if (!this.allPatterns[stopObj.routeId]) {
                this.allPatterns[stopObj.routeId] = [];
            }
            this.allPatterns[stopObj.routeId].push(marker);
            if (stop.locationType === 'STOP') {
                this.stopsMarkersClusterGroup.addLayer(marker);
                this.stopsMarkers.push(marker);
            } else {
                this.stationsMarkersClusterGroup.addLayer(marker);
                this.stationsMarkers.push(marker);
            }
        }
    }

    private addOverStopMarkerTooltip(marker) {
        let stop = marker.model;
        let tooltip = '<b>' + stop.stopName + '</b>';
        tooltip += ('<br><b>type:</b> ' + stop.locationType);
        tooltip += stop.bikeParking ? ('<br>bikeParking: ' + stop.bikeParking) : '';
        tooltip += stop.carParking ? ('<br>carParking: ' + stop.carParking) : '';

        marker.bindTooltip(tooltip, { direction: 'top' }).openTooltip();
        marker.bindPopup(tooltip);
    }

    private getStops(pattern) {
        let res = [];
        if (pattern && pattern.patternStops) {
            let stopsById = [];
            let i = 0;
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
        } else {
            return {}
        }

    }

    private onRouteCheckAll(event) {
        if (event.target.checked) {
            for (let i = 0; i < Math.min(this.routes.length, NB_ROUTE_MAX); i++) {
                this.routes[i].checked = event.target.checked;
                this.onRouteChecked(event, this.routes[i]);
            }
        } else {
            for (let i = 0; i < this.routes.length; i++) {
                this.routes[i].checked = event.target.checked;
            }
            this.allPatterns = {};
            this.patternsGroup.clearLayers();
            this.stopsMarkersClusterGroup.clearLayers();
            this.stationsMarkersClusterGroup.clearLayers();
        }
    }

    private onRouteChecked(event, route) {
        let checkRoute = function(vm) {
            let data = vm.feedMapUtils.getRouteData(route.id, vm.routes);
            if (data) {
                let that = vm;
                vm.loading = true;
                vm.feedsApi.getRouteTripPattern(vm._feed.id,
                    vm._feed.selectedVersion ? vm._feed.selectedVersion.id : vm._feed.id,
                    data.id, vm._feed.isPublic).then(function(responseTrip) {
                        that.createTripPatterns(responseTrip);
                        that.getAllStops(responseTrip);
                        that.loading = false;
                    }).catch(() => that.loading = false);
            }
        };

        let unCheckRoute = function(vm) {
            for (let i = 0; vm.allPatterns[route.id] && i < vm.allPatterns[route.id].length; i++) {
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
        }

        if (event.target.checked) {
            checkRoute(this);
        } else {
            unCheckRoute(this);
        }
    }

    private bindTooltipToRoute(layer) {
        if (layer.feature.properties.routeData) {
            let color = layer.feature.properties.routeData.routeTextColor ?
                ('#' + layer.feature.properties.routeData.routeTextColor) : '';
            color = (color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff') ? '#000000' : color;
            let label = '<label style="color:' + color + '">' + layer.feature.properties.routeData.routeLongName +
                '</label>';
            layer.bindTooltip(label, { direction: 'top' });
        }
    }

    private addEventsToRoute(layer) {
        if (layer.feature.properties.routeData) {
            let that = this;
            layer.on('mouseover', function(event) {
                layer.openTooltip(event.latlng);
                if (event.target.feature.properties.type === 'stop') {
                    event.target.bringToFront();
                } else {
                    event.target.bringToBack();
                }
                event.target.setStyle(that.feedMapUtils.getGeoJSONStyleOver())
            })
            layer.on('mouseout', function(event) {
                layer.closeTooltip();
                event.target.setStyle(that.feedMapUtils.getGeoJSONStyle(event.target.feature))
            })
            layer.on('click', function(event) {
                event.target.bringToFront();
                that.map.fitBounds(event.target._bounds);
            })
        }
    }

    private createGeoJSONFeature(type: string, pattern: any): leaflet.GeoJSON {
        if (!pattern || !pattern[type]) {
            return;
        }
        let patternsGeoJSON: leaflet.GeoJSON = leaflet.geoJSON();
        let geojsonFeature = {
            type: 'Feature',
            properties: {
                pattern: pattern,
                routeData: this.feedMapUtils.getRouteData(pattern.routeId, this.routes)
            },
            geometry: pattern[type]
        };
        patternsGeoJSON.addData(geojsonFeature);
        return patternsGeoJSON;
    }
}

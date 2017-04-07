import {  Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { IFeed, FeedsApiService }                                from "../../services/api/feedsApi.service";
import { MapUtilsService }                                       from "../../services/mapUtils.service";
import { SessionService }                                        from "../../services/session.service"
import { UtilsService }                                          from "../../services/utils.service";
import { DatasetsActions }                                       from "../../../state/datasets/datasets.actions";
import { DatasetsState }                                         from "../../../state/datasets/datasets.reducer";
import { Configuration }                                         from "../../configuration";
import * as leaflet                                              from "leaflet";
require('../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster');

@Component({
    selector: 'ct-feed-map',
    templateUrl: 'feed-map.html',
})
export class FeedMapComponent implements AfterViewInit {
    @Input() mapId: string;
    private _feed;
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
    feedMarker;

    constructor(private utils: UtilsService,
        private config: Configuration,
        private mapUtils: MapUtilsService,
        protected datasetsAction: DatasetsActions,
        private session: SessionService,
        private feedsApi: FeedsApiService

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
        if (this._feed && this._feed.id && this.session.loggedIn) {
            let that = this;
            this.feedsApi.getStops(this._feed.id).then(function(response) {
                that.createStops(response);
            })
        }
    }

    private createClusterGroup(stop: boolean) {
        return new (leaflet as any).MarkerClusterGroup(
            {
                //disableClusteringAtZoom: 16,
                zoomToBoundsOnClick: true,
                chunkedLoading: true,
                showCoverageOnHover: false,
                iconCreateFunction: stop ? this.mapUtils.computeStopIcon : this.mapUtils.computeStationIcon
            }
        );
    }
    protected computeMap(id): leaflet.Map {
        let tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        this.stopsMarkersClusterGroup = this.createClusterGroup(true);
        this.stationsMarkersClusterGroup = this.createClusterGroup(false);

        var overlayMaps = {
            '<i class="fa fa-lg fa-flag-checkered"></i> Stops': this.stopsMarkersClusterGroup,
            '<i class="fa fa-lg fa-train"></i> Stations': this.stationsMarkersClusterGroup
        };
        let options = {
            center: <any>this.initialPosition,
            zoom: this.initialZoom,
            zoomControl: false,
            minZoom: 2,
            maxZoom: 10,
            layers: [tiles]
        }
        let map = leaflet.map(id, options);
        this.stopsMarkersClusterGroup.addTo(map);
        this.stationsMarkersClusterGroup.addTo(map);
        let control = leaflet.control.layers(null, overlayMaps).addTo(map);
        control.addTo(map);
        return map;
    }

    private clearMap() {
        this.stopsMarkersClusterGroup.clearLayers();
        this.stationsMarkersClusterGroup.clearLayers();
    }

    private populateMap() {
        if (this._feed && this.map) {
            this.clearMap();
            if (this._feed.latestValidation && this._feed.latestValidation.bounds) {
                let bounds = this.utils.computeBoundsToLatLng(this._feed.latestValidation.bounds);
                let lat = (bounds[0].lat + bounds[1].lat) / 2;
                let lng = (bounds[0].lng + bounds[2].lng) / 2;
                this.feedMarker = this.createMarker(this._feed, [lat, lng], bounds);
                this.map.addLayer(this.feedMarker);
                this.fitBounds(true, false);
            }
        }
    }

    private fitBounds(initial: boolean, stop: boolean) {

        if (initial) {
            let group = leaflet.featureGroup([this.feedMarker]);
            this.map.fitBounds(group.getBounds());
        } else {
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
    }

    protected createMarker(feed, latLng, bounds): leaflet.Marker {
        let marker: any = leaflet.marker(latLng, {
            title: feed.name, draggable: false,
            icon: new this.NumberedDivIcon({
                number: feed.name.charAt(0),
                surClass: feed.isPublic ? 'public' : 'private'
            })
        });
        let that = this;
        marker.on('click', function(event) {
            that.clickMarker(event);
        });
        return marker;
    }

    private clickMarker(event) {
        this.stopsMarkersClusterGroup.bringToFront();
        this.fitBounds(false, true);
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
            var tooltip = '<b>' + stop.stopName + '</b>';
            tooltip += ('<br><b>type:</b> ' + stop.locationType);
            tooltip += stop.bikeParking ? ('<br>bikeParking: ' + stop.bikeParking) : '';
            tooltip += stop.carParking ? ('<br>carParking: ' + stop.carParking) : '';
            let that = this;
            marker.model = stop;
            marker.bindTooltip(tooltip, { direction: 'top' });
            marker.on('click', function(event) {
                that.clickSSMarker(event);
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
}

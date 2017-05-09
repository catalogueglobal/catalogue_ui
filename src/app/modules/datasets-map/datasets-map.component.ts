import { Component, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import { Router }                                                from '@angular/router';
import { Store }                                                 from "@ngrx/store";
import * as leaflet                                              from "leaflet";
import { Observable }                                            from "rxjs/Rx";
import { DatePipe } from '@angular/common';
import {TranslateService} from 'ng2-translate';
require('leaflet.markercluster');
import { Configuration }                                         from "app/commons/configuration";
import { ProjectsApiService }                                    from "app/commons/services/api/projectsApi.service";
import { IFeed }                                                 from "app/commons/services/api/feedsApi.service";
import { IProject }                                              from "app/commons/services/api/projectsApi.service";
import { MapUtilsService }                                       from "app/commons/services/mapUtils.service";
import { SessionService }                                        from "app/commons/services/session.service"
import { SharedService }                                         from "app/commons/services/shared.service"
import { UtilsService }                                          from "app/commons/services/utils.service";
import { DatasetsActions }                                       from "app/state/datasets/datasets.actions";
import { DatasetsState }                                         from "app/state/datasets/datasets.reducer";

@Component({
    selector: 'app-datasets-map',
    templateUrl: 'datasets-map.component.html',
    providers: [ProjectsApiService]
})
export class DatasetsMapComponent implements AfterViewInit {
    protected project$: Observable<IProject>;
    protected project: IProject;
    public updateProject: Function;
    private datePipe = new DatePipe('en-US');
    private feedsLicenses;
    @Input() mapId: string;
    @Output() protected boundsChange = new EventEmitter();
    private _feeds: IFeed[];
    map: leaflet.Map;
    markerClusterGroup;
    markers: Array<leaflet.Marker>;
    markersGroup;
    initialPosition = this.config.MAP_DEFAULT_POSITION;
    _position;
    initialZoom: number = this.config.MAP_ZOOM_UNKNOWN;
    _zoom: number;
    NumberedDivIcon;


    constructor(
        private utils: UtilsService,
        private config: Configuration,
        private projectsApi: ProjectsApiService,
        private mapUtils: MapUtilsService,
        private router: Router,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        private shared: SharedService,
        private translate: TranslateService,
        private session: SessionService) {
        //this.geolocalize();
        this.setCenterMap();
        this.markers = new Array();
        this.updateProject = this.updateProjectProperty.bind(this);
        this.NumberedDivIcon = mapUtils.createNumMarker();
    }

    reset() {
        console.log('map reset', this.initialPosition, this.initialZoom)
        this._zoom = this.initialZoom;
        this._position = this.initialPosition;
        this.goTo(this.map, this._position, true);
    }

    @Input() set position(value: leaflet.LatLngExpression) {
        console.log('set position', value);
        if (!value) {
            return;
        }
        this._position = value;
        if (this.map) {
            this.goTo(this.map, value, false);
        }
    }

    @Input() set zoom(value: number) {
        console.log('set zoom', value);
        if (!value) {
            return;
        }
        this._zoom = value;
        if (this.map) {
            this.map.setZoom(value, null);
        }
    }

    @Input() set feeds(value: IFeed[]) {
        this._feeds = value;
        if (this.map) {
            this.clearMap();
            this.populateMap();
        }
    }

    ngAfterViewInit() {
        this.computeMap(this.mapId);
        this.populateMap();
    }

    private geolocalize(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                response => {
                    this.position = [response.coords.latitude, response.coords.longitude];
                    console.log("geolocalize: available", this._position);
                },
                () => {
                    console.log("geolocalize: geolocation not available");
                }
            );
        }
    }

    private computeMap(cssId) {
        this.markerClusterGroup = new (leaflet as any).MarkerClusterGroup(
            {
                //disableClusteringAtZoom: 16,
                zoomToBoundsOnClick: true,
                chunkedLoading: true,
                showCoverageOnHover: false,
                iconCreateFunction: this.mapUtils.computeRedIcon
            }
        )
        //leaflet.IconOptions.imagePath = 'vendor/leaflet/dist/images/';
        let tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
        let options = {
            center: <any>this.initialPosition,
            zoom: this.initialZoom,
            zoomControl: false,
            minZoom: 2,
            layers: [tiles]
        }
        let map = leaflet.map(cssId, options);
        this.map = map;
        this.markersGroup = leaflet.featureGroup();
        map.addLayer(this.markerClusterGroup);
        map.addLayer(this.markersGroup);
        this.mapUtils.clusterAreaOver(this.markerClusterGroup, map);
        let that = this;
        map.on(
            'moveend', function(e) {
                console.log('map move', map.getBounds());
                let mapBounds = map.getBounds();
                let newCenter = map.getCenter();
                that.shared.setNewCenter(newCenter, e.target._zoom);
                let areaBounds = that.utils.computeLatLngToBounds([mapBounds.getNorthEast(), mapBounds.getSouthWest()]);
                that.boundsChange.emit(areaBounds);
            }
        );
        if (this._position) {
            this.goTo(map, this._position, false);
        }
    }

    // remove all marker from the map when refresh
    private clearMap() {
        this.markerClusterGroup.clearLayers();
        this.markersGroup.clearLayers();
    }

    private populateMap() {
        if (this._feeds && this.map) {
            this.clearMap();
            console.log("setFeeds", this._feeds.length);
            this.setFeedsLicenses(this._feeds);
            if (this._feeds.length > 0){
              this._feeds.map(
                  feed => {
                      if (feed.latestValidation && feed.latestValidation.bounds) {
                          this.createMarker(feed);
                      }
                  }
              );
            }

        }
    }

    private setCenterMap() {
        let lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat != 0 && lastCenter.lng != 0) {
            this.position = [lastCenter.lat, lastCenter.lng];
            //this.initialZoom = lastCenter.zoom;
        } else {
            this.geolocalize();
        }
    }

    private goTo(theMap, thePosition, isReset) {
        let theZoom = this._zoom || this.config.MAP_ZOOM_POSITION;
        let lastCenter = this.shared.getCenterMap();
        if (lastCenter.lat != 0 && lastCenter.lng != 0 && isReset == false) {
            thePosition[0] = lastCenter.lat;
            thePosition[1] = lastCenter.lng;
            theZoom = lastCenter.zoom;
        }
        console.log('goTo', thePosition, theZoom);
        theMap.setView(thePosition, theZoom);
    }

    private computeMarker(feed: IFeed, latLng: [number, number], bounds: leaflet.LatLngExpression[]): leaflet.Marker {
        let isDraggable: boolean = this.router.url === '/my-datasets' ? true : false;
        let marker: any = leaflet.marker(latLng, {
            title: feed.name, draggable: isDraggable,
            icon: new this.NumberedDivIcon({
                number: feed.name.charAt(0),
                surClass: feed.isPublic ? 'public' : 'private'
            })
        });
        marker.data = {
            bounds: bounds,
            id: feed.projectId
        }
        if (isDraggable === true) {
            marker.on("dragend", this.updateProject);
        }
        let tooltipData = this.computeMarkerPopup(feed);
        marker.bindTooltip(tooltipData, {
            direction: 'top'
        });
        marker.bindPopup(tooltipData, {
            direction: 'top'
        });
        return marker;
    }

    private setFeedsLicenses(value: any) {
        let licenses = this.shared.getLicenses();
        this.feedsLicenses = {};
        if (licenses && value) {
            for (let k = 0; k < value.length; k++) {
                let feed = value[k];
                for (let i = 0; i < licenses.length; i++) {
                    if (licenses[i].feedIds) {
                        for (let j = 0; j < licenses[i].feedIds.length; j++) {
                            if (feed.id === licenses[i].feedIds[j]) {
                                this.feedsLicenses[feed.id] = licenses[i];
                            }
                        }
                    }
                }
            }
        }
    }

    private computeMarkerPopup(feed: any): string {
        let license = this.feedsLicenses[feed.id];
        let popupHtml = '<b>';
        if (feed.isPublic) {
            popupHtml += '<a href="/feeds/' + feed.id + '">' + feed.name + "</a></b> (" + this.translate.instant('mydatasets-table.column.isPublic.label') + ')';
        } else {
            popupHtml += feed.name + '</b> (' + this.translate.instant('mydatasets-table.column.isPublic.private') + ')';
        }
        if (feed.url) {
            popupHtml += "<br><button onclick=\"document.location.href='" + feed.url + "'\">Download feed</button>";
        }
        if (license && license.id) {
            popupHtml += '<br/><b>License</b>: ' + license.name;
        }
        popupHtml += '<br/>';
        popupHtml += '<b>' + this.translate.instant('feed.period') + '</b> ' + this.datePipe.transform(feed.latestValidation.startDate, 'y-MM-dd');
        popupHtml += '<b>' + this.translate.instant('feed.period_to') + '</b> ' + this.datePipe.transform(feed.latestValidation.endDate, 'y-MM-dd');
        popupHtml += '<br/><b>' + this.translate.instant('feed.routes') + '</b> ' + feed.latestValidation.routeCount;
        popupHtml += '<br/><b>' + this.translate.instant('feed.trips') + '</b> ' + feed.latestValidation.tripCount;
        if (feed.lastUpdated) {
            let date = this.datePipe.transform(feed.lastUpdated, 'y-MM-dd');
            popupHtml += '<br/><b>' + this.translate.instant('mydatasets-table.column.updated') + '</b> : ' + date;
        }

        return popupHtml;
    }

    // Update the Lat and Lng of the project
    private updateProjectProperty(ev) {
        var projectsApi: ProjectsApiService;
        var updateProject;
        var changedPos = ev.target.getLatLng();
        updateProject = {
            defaultLocationLat: changedPos.lat,
            defaultLocationLon: changedPos.lng
        };
        this.store.dispatch(this.datasetsAction.updateProject(ev.target.data.id, updateProject));
    }

    private extractData(data, feed) {
        if (data) {
            let bounds = this.utils.computeBoundsToLatLng(feed.latestValidation.bounds);
            let lat = data.defaultLocationLat;
            let lng = data.defaultLocationLon;
            if (!lat)
                lat = (bounds[0].lat + bounds[1].lat) / 2;
            if (!lng)
                lng = (bounds[0].lng + bounds[2].lng) / 2;
            let marker = this.computeMarker(feed, [lat, lng], bounds);
            this.router.url === "/my-datasets" ? this.markersGroup.addLayer(marker) : this.markerClusterGroup.addLayer(marker);
            this.markers.push(marker);
            // area over marker
            this.mapUtils.markerAreaOver(marker, this.map);
        }
    }

    private createMarker(feed: IFeed) {
        // TODO : to change, the code is not clean
        if (this.router.url == "/my-datasets") {
            this.projectsApi.getPrivateProject(feed.projectId).then(function success(data) {
                return this.extractData(data, feed);
            }.bind(this));
        } else {
            this.projectsApi.getPublicProject(feed.projectId).then(function success(data) {
                this.extractData(data, feed);
            }.bind(this));
        }
    }
}

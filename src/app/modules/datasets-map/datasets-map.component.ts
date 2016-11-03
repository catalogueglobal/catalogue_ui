import {Component, AfterViewInit, Input, Output, EventEmitter} from "@angular/core";
import {ProjectsApiService} from "../../commons/services/api/projectsApi.service";
import {IFeed, IBounds} from "../../commons/services/api/feedsApi.service";
import {UtilsService} from "../../commons/services/utils.service";
import {Configuration} from "../../commons/configuration";
import {MapUtilsService} from "../../commons/services/mapUtils.service";
import {DatasetsComponent} from "../datasets/datasets.component";
import * as leaflet from "leaflet";
require('./../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster');

@Component({
  selector: 'app-datasets-map',
  templateUrl: 'datasets-map.component.html',
  providers: [ProjectsApiService]
})

export class DatasetsMapComponent implements AfterViewInit {
  @Input() mapId: string;
  @Output() protected boundsChange = new EventEmitter();

  private _feeds: IFeed[];
  map: leaflet.Map;
  markerClusterGroup;

  initialPosition = this.config.MAP_DEFAULT_POSITION;
  _position;

  initialZoom: number = this.config.MAP_ZOOM_UNKNOWN;
  _zoom: number;

  constructor(private utils: UtilsService, private config: Configuration, private mapUtils: MapUtilsService) {
    this.geolocalize();
  }

  reset() {
    console.log('map reset', this.initialPosition, this.initialZoom)
    this._zoom = this.initialZoom;
    this._position = this.initialPosition;
  }

  @Input() set position(value: leaflet.LatLngExpression) {
    console.log('set position', value);
    if (!value) {
      return;
    }
    this._position = value;

    if (this.map) {
      this.goTo(this.map, value);
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
      this.populateMap();
    }
  }

  ngAfterViewInit() {
    this.map = this.computeMap(this.mapId);
    this.populateMap();
  }

  private geolocalize(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(response=> {
        this.position = [response.coords.latitude, response.coords.longitude];
        console.log("geolocalize: available", this._position);
      }, () => {
        console.log("geolocalize: geolocation not available");
      });
    }
  }

  private computeMap(cssId): leaflet.Map {
    this.markerClusterGroup = new (leaflet as any).MarkerClusterGroup({
      //disableClusteringAtZoom: 16,
      zoomToBoundsOnClick: true,
      chunkedLoading: true,
      showCoverageOnHover: false,
      iconCreateFunction: this.mapUtils.computeRedIcon
    })

    let thePosition;

    //leaflet.IconOptions.imagePath = 'vendor/leaflet/dist/images/';

    let tiles = leaflet.tileLayer(this.config.MAP_TILE_LAYER_URL, this.config.MAP_TILE_LAYER_OPTIONS);
    let map = leaflet.map(cssId, {center: <any>this.initialPosition, zoom: this.initialZoom, layers: [tiles]});

    map.addLayer(this.markerClusterGroup);
    this.mapUtils.clusterAreaOver(this.markerClusterGroup, map);

    let that = this;
    map.on('moveend', function (e) {
      console.log('map move', map.getBounds());
      let mapBounds = map.getBounds();
      let areaBounds = that.utils.computeLatLngToBounds([mapBounds.getNorthEast(), mapBounds.getSouthWest()]);
      that.boundsChange.emit(areaBounds);
    })

    if (this._position) {
      this.goTo(map, this._position);
    }

    return map;
  }

  private populateMap() {

    if (this._feeds && this.map) {
      this.markerClusterGroup.clearLayers();

      console.log("setFeeds", this._feeds.length);
      this._feeds.map(feed=> {
        if (feed.latestValidation && feed.latestValidation.bounds) {
          let latLng = this.utils.computeLatLng(feed.latestValidation.bounds);
          let bounds = this.utils.computeBoundsToLatLng(feed.latestValidation.bounds);
          let marker = this.computeMarker(feed.name, [latLng.lat, latLng.lng], bounds, feed.url, feed.isPublic);
          this.markerClusterGroup.addLayer(marker);

          let that = this;
          this.mapUtils.markerAreaOver(marker, this.map);
        }
        /*else {
         console.log('new marker (no bounds)', feed);
         }*/
      });
    }
  }

  private goTo(theMap, thePosition) {
    let theZoom = this._zoom || this.config.MAP_ZOOM_POSITION;

    console.log('goTo', thePosition, theZoom)
    theMap.setView(thePosition, theZoom);
  }

  private computeMarker(name: string, latLng: [number, number], bounds: leaflet.LatLngExpression[], url: string, isPublic: boolean): leaflet.Marker {

    let marker: any = leaflet.marker(latLng, {title: name});
    marker.data = {
      bounds: bounds
    }
    marker.bindPopup(this.computeMarkerPopup(name, url));
    return marker;
  }

  private computeMarkerPopup(name: string, url: string): string {
    var popupHtml = "<b>" + name + "</b>";
    if (url) {
      popupHtml += "<br><button onclick=\"document.location.href='" + url + "'\">Download feed</button>";
    }
    return popupHtml;
  }

}

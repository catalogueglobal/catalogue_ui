import {Component, AfterViewInit, Input, Output, EventEmitter} from "@angular/core";
import {ProjectsApiService} from "../../commons/services/api/projectsApi.service";
import {Store, Action} from "@ngrx/store";
import {Observable} from "rxjs/Rx";
import {IFeed, IBounds} from "../../commons/services/api/feedsApi.service";
import {UtilsService} from "../../commons/services/utils.service";
import {DatasetsState} from "../../state/datasets/datasets.reducer";
import {DatasetsActions} from "../../state/datasets/datasets.actions";
import {Configuration} from "../../commons/configuration";
import {MapUtilsService} from "../../commons/services/mapUtils.service";
import {SharedService} from "../../commons/services/shared.service"
import {IProject} from "../../commons/services/api/projectsApi.service";
import { Router }   from '@angular/router';
import * as leaflet from "leaflet";
require('./../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster');

@Component({
  selector: 'app-datasets-map',
  templateUrl: 'datasets-map.component.html',
  providers: [ProjectsApiService]
})

export class DatasetsMapComponent implements AfterViewInit {
  protected project$: Observable<IProject>; 
  protected project: IProject;
  public updateProject: Function;

  @Input() mapId: string;
  @Output() protected boundsChange = new EventEmitter();

  private _feeds: IFeed[];
  map: leaflet.Map;
  markerClusterGroup;
  markers: Array<leaflet.Marker>;

  initialPosition = this.config.MAP_DEFAULT_POSITION;
  _position;
  initialZoom: number = this.config.MAP_ZOOM_UNKNOWN;
  _zoom: number;


  constructor(private utils: UtilsService, private config: Configuration, private projectsApi: ProjectsApiService, private mapUtils: MapUtilsService, private router: Router, protected store: Store<DatasetsState>, protected datasetsAction: DatasetsActions, private shared: SharedService) {
    
    //this.geolocalize();
    this.setCenterMap();
    this.markers = new Array();
    this.updateProject = this.updateProjectProperty.bind(this);
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
    let map = leaflet.map(cssId, {center: <any>this.initialPosition, zoom: this.initialZoom, zoomControl: false, minZoom: 2, layers: [tiles]});

    map.addLayer(this.markerClusterGroup);

    this.mapUtils.clusterAreaOver(this.markerClusterGroup, map);

    let that = this;
    map.on('moveend', function (e) {
      console.log('map move', map.getBounds());
      let mapBounds = map.getBounds();
      let newCenter = map.getCenter();
      that.shared.setNewCenter(newCenter, e.target._zoom);
      let areaBounds = that.utils.computeLatLngToBounds([mapBounds.getNorthEast(), mapBounds.getSouthWest()]);
      that.boundsChange.emit(areaBounds);
    })

    if (this._position) {
      this.goTo(map, this._position, false);
    }

    return map;
  }

  // remove all marker from the map when refresh
  private clearMap() {
    this.markerClusterGroup.clearLayers();
    if (this.router.url === "/my-datasets"){
      for (var i = 0; i < this.markers.length; i++){
        this.map.removeLayer(this.markers[i]);
        this.markers.splice(i, 1);
      }
    }
  }

  private populateMap() {

    if (this._feeds && this.map) {
      this.clearMap();
      console.log("setFeeds", this._feeds.length);
      this._feeds.map(feed=> {
        if (feed.latestValidation && feed.latestValidation.bounds) {
          this.createMarker(feed);  
        }
        /*else {
         console.log('new marker (no bounds)', feed);
         }*/
      });
    }
  }

  private setCenterMap() {
    let lastCenter = this.shared.getCenterMap();
    if (lastCenter.lat != 0 && lastCenter.lng != 0){
      this.position = [lastCenter.lat, lastCenter.lng];
      //this.initialZoom = lastCenter.zoom;
    } else {
      this.geolocalize();
    }
  }

  private goTo(theMap, thePosition, isReset) {
    let theZoom = this._zoom || this.config.MAP_ZOOM_POSITION;

    let lastCenter = this.shared.getCenterMap();
    if (lastCenter.lat != 0 && lastCenter.lng != 0 && isReset == false){
      thePosition[0] = lastCenter.lat;
      thePosition[1] = lastCenter.lng;
      theZoom = lastCenter.zoom;
    }
    console.log('goTo', thePosition, theZoom);

    theMap.setView(thePosition, theZoom);
  }

  private computeMarker(name: string, latLng: [number, number], bounds: leaflet.LatLngExpression[], url: string, isPublic: boolean, id: string): leaflet.Marker {
    var isDraggable: boolean = this.router.url === '/my-datasets' ? true : false;
    let marker: any = leaflet.marker(latLng, {title: name, draggable: isDraggable});

    marker.data = {
     bounds: bounds,
     id: id
    }
    let that;

    if (isDraggable === true){
      marker.on("dragend", this.updateProject);
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

  private extractData(data, feed){
    if (data){
          let bounds = this.utils.computeBoundsToLatLng(feed.latestValidation.bounds);
	  let lat = data.defaultLocationLat;
	  let lng = data.defaultLocationLon;
          if (!lat)
	     lat = (bounds[0].lat + bounds[1].lat) / 2;
          if (!lng)
	     lng = (bounds[0].lng + bounds[2].lng) / 2;
          let marker = this.computeMarker(feed.name, [lat, lng], bounds, feed.url, feed.isPublic, feed.projectId)
          this.router.url === "/my-datasets" ? this.map.addLayer(marker) : this.markerClusterGroup.addLayer(marker);  
          this.markers.push(marker);
          // area over marker
          this.mapUtils.markerAreaOver(marker, this.map);
        }
  }

  private createMarker(feed: IFeed){
    // TODO : to change, the code is not clean
    if (this.router.url == "/my-datasets"){
      this.projectsApi.getPrivateProject(feed.projectId).then(function success(data){
        return this.extractData(data, feed);
      }.bind(this));
    } else {
      this.projectsApi.getPublicProject(feed.projectId).then(function success(data){
        return this.extractData(data, feed);
      }.bind(this));
    }
     
      
  }

} 
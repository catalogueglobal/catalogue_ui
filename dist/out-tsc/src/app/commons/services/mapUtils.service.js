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
import * as leaflet from "leaflet";
export var MapUtilsService = (function () {
    function MapUtilsService() {
    }
    MapUtilsService.prototype.clusterAreaOver = function (markerClusterGroup, map) {
        var that = this;
        var computeClusterHull = function (e) {
            return that.computeConvexHull(e.layer.getAllChildMarkers());
        };
        this.areaOver(map, markerClusterGroup, 'clustermouseover', 'clustermouseout', computeClusterHull);
    };
    MapUtilsService.prototype.markerAreaOver = function (marker, map) {
        var that = this;
        var computeMarkerHull = function () {
            return that.computeConvexHull([marker]);
        };
        this.areaOver(map, marker, 'mouseover', 'mouseout', computeMarkerHull);
    };
    MapUtilsService.prototype.computeConvexHull = function (markers) {
        var points = [], p, i;
        for (i = markers.length - 1; i >= 0; i--) {
            markers[i].data.bounds.map(function (p) {
                points.push(p);
            });
        }
        var leafletUntyped = leaflet;
        return leafletUntyped.QuickHull.getConvexHull(points);
    };
    MapUtilsService.prototype.computeRedIcon = function () {
        var redIcon = leaflet.icon({
            iconUrl: 'images/markers/marker-icon-red.png',
            shadowUrl: 'vendor/leaflet/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return redIcon;
    };
    MapUtilsService.prototype.areaOver = function (map, source, eventOver, eventOut, computeConvexHull) {
        var polygon;
        function removePolygon() {
            if (polygon) {
                map.removeLayer(polygon);
                polygon = null;
            }
        }
        source.on(eventOver, function (e) {
            removePolygon();
            polygon = leaflet.polygon(computeConvexHull(e));
            map.addLayer(polygon);
        });
        source.on(eventOut, removePolygon);
        map.on('zoomend', removePolygon);
    };
    MapUtilsService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], MapUtilsService);
    return MapUtilsService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/mapUtils.service.js.map
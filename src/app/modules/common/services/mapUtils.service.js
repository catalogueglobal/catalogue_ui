"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var leaflet = require("leaflet");
var MapUtilsService = (function () {
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
        var points = [], i;
        for (i = markers.length - 1; i >= 0; i--) {
            markers[i].data.bounds.map(function (p) {
                points.push(p);
            });
        }
        var leafletUntyped = leaflet;
        return leafletUntyped.QuickHull.getConvexHull(points);
    };
    MapUtilsService.prototype.computeRedIcon = function (cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-medium', iconSize: new L.Point(40, 40)
        });
    };
    MapUtilsService.prototype.computeStopIcon = function (cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40)
        });
    };
    MapUtilsService.prototype.computeStationIcon = function (cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-large', iconSize: new L.Point(40, 40)
        });
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
    MapUtilsService.prototype.createNumMarker = function () {
        return L.Icon.extend({
            options: {
                iconSize: new L.Point(30, 30),
                iconAnchor: new L.Point(15, 0),
                className: 'leaflet-div-number-icon'
            },
            createIcon: function () {
                var div = document.createElement('div');
                this.options.className += ' ' + this.options.surClass;
                var numdiv = document.createElement('div');
                numdiv.setAttribute('class', 'number');
                numdiv.innerHTML = this.options['number'] || '';
                div.appendChild(numdiv);
                this._setIconStyles(div, 'icon');
                return div;
            }
        });
    };
    MapUtilsService.prototype.createIconMarker = function (anchorX, anchorY, iconWidth, iconHeight) {
        return L.Icon.extend({
            options: {
                iconSize: new L.Point(iconWidth || 30, iconHeight || 30),
                iconAnchor: new L.Point(anchorX || 15, anchorY || 0),
                className: 'leaflet-div-number-icon'
            },
            createIcon: function () {
                var div = document.createElement('div');
                this.options.className += ' ' + this.options.surClass;
                var icondiv = document.createElement('i');
                icondiv.setAttribute('class', 'img-icon fa ' + this.options['faIcon'] || '');
                div.appendChild(icondiv);
                this._setIconStyles(div, 'icon');
                return div;
            }
        });
    };
    return MapUtilsService;
}());
MapUtilsService = __decorate([
    core_1.Injectable()
], MapUtilsService);
exports.MapUtilsService = MapUtilsService;

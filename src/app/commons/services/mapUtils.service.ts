import { Injectable } from "@angular/core";
import * as leaflet   from "leaflet";

@Injectable()
export class MapUtilsService {

    constructor() {
    }

    clusterAreaOver(markerClusterGroup, map) {
        let that = this;
        let computeClusterHull = function(e) {
            return that.computeConvexHull(e.layer.getAllChildMarkers())
        }
        this.areaOver(map, markerClusterGroup, 'clustermouseover', 'clustermouseout', computeClusterHull)
    }

    markerAreaOver(marker, map) {
        let that = this;
        let computeMarkerHull = function() {
            return that.computeConvexHull([marker])
        }
        this.areaOver(map, marker, 'mouseover', 'mouseout', computeMarkerHull)
    }

    computeConvexHull(markers: any[]) {
        var points = [], p, i;
        for (i = markers.length - 1; i >= 0; i--) {
            markers[i].data.bounds.map(
                p => {
                    points.push(p)
                }
            );
        }
        var leafletUntyped: any = leaflet;
        return leafletUntyped.QuickHull.getConvexHull(points);
    }

    computeRedIcon(cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-medium', iconSize: new L.Point(40, 40)
        });
    }

    computeStopIcon(cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40)
        });
    }

    computeStationIcon(cluster) {
        return new L.DivIcon({
            html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            className: 'marker-cluster marker-cluster-large', iconSize: new L.Point(40, 40)
        });
    }


    private areaOver(map, source, eventOver, eventOut, computeConvexHull) {
        var polygon;
        function removePolygon() {
            if (polygon) {
                map.removeLayer(polygon);
                polygon = null;
            }
        }
        source.on(eventOver, function(e) {
            removePolygon();
            polygon = leaflet.polygon(computeConvexHull(e));
            map.addLayer(polygon);
        });
        source.on(eventOut, removePolygon);
        map.on('zoomend', removePolygon);
    }

    public createNumMarker() {
        return L.Icon.extend({
            options: {
                iconSize: new L.Point(30, 30),
                iconAnchor: new L.Point(15, 0),
                className: 'leaflet-div-number-icon'
            },

            createIcon: function() {
                let div = document.createElement('div');
                this.options.className += ' ' + this.options.surClass;

                let numdiv = document.createElement('div');
                numdiv.setAttribute("class", "number");
                numdiv.innerHTML = this.options['number'] || '';
                div.appendChild(numdiv);
                this._setIconStyles(div, 'icon');
                return div;
            }
        });
    }

    public createIconMarker(anchorX, anchorY) {
        return L.Icon.extend({
            options: {
                iconSize: new L.Point(30, 30),
                iconAnchor: new L.Point(anchorX || 15,  anchorY || 0),
                className: 'leaflet-div-number-icon'
            },

            createIcon: function() {
                let div = document.createElement('div');
                this.options.className += ' ' + this.options.surClass;

                let icondiv = document.createElement('i');
                icondiv.setAttribute("class", 'img-icon fa fa-lg ' + this.options['faIcon'] || '');
                div.appendChild(icondiv);
                this._setIconStyles(div, 'icon');
                return div;
            }
        });
    }
}

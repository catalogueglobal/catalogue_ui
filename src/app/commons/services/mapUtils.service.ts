/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
import { Injectable } from "@angular/core";
import * as leaflet   from "leaflet";

@Injectable()
export class MapUtilsService {

    constructor() {
    }

    clusterAreaOver(markerClusterGroup, map) {
        let that = this;
        let computeClusterHull = function (e) {
            return that.computeConvexHull(e.layer.getAllChildMarkers())
        }
        this.areaOver(map, markerClusterGroup, 'clustermouseover', 'clustermouseout', computeClusterHull)
    }

    markerAreaOver(marker, map) {
        let that = this;
        let computeMarkerHull = function () {
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
        return new L.DivIcon({ html: '<div><span>' + cluster.getChildCount() + '</span></div>', 
            className: 'marker-cluster marker-cluster-medium', iconSize: new L.Point(40, 40) });
    }
    
    private areaOver(map, source, eventOver, eventOut, computeConvexHull) {
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
    }
}

import { Injectable } from "@angular/core";
import { MapUtilsService }                                       from "app/modules/common/";
import * as leaflet   from "leaflet";

@Injectable()
export class FeedMapUtilsService {

    constructor(private mapUtils: MapUtilsService) {
    }

    createClusterGroup(stop: boolean) {
        return new (leaflet as any).MarkerClusterGroup(
            {
                zoomToBoundsOnClick: true,
                chunkedLoading: true,
                disableClusteringAtZoom: 12,
                showCoverageOnHover: false,
                iconCreateFunction: stop ? this.mapUtils.computeStopIcon : this.mapUtils.computeStationIcon
            }
        );
    }

    getGeoJSONStyle(feature) {
        return {
            weight: feature.properties.type === 'stop' ? 10 : 5,
            opacity: 1,
            color: feature.properties.type === 'stop' ? 'red' : (feature.properties.routeData.routeColor ?
                ('#' + feature.properties.routeData.routeColor) : '#808080'),
            dashArray: feature.properties.type === 'stop' ? null : '5'
        };
    }

    getGeoJSONStyleOver() {
        return {
            weight: 10,
            opacity: 1,
            color: '#1CDDBA',
            dashArray: null
        };
    }

    getMinMax(list, lat, min) {
        let res = list[0];
        let index = lat ? 1 : 0;
        for (let i = 0; i < list.length; i++) {
            if ((min && list[i][index] < res[index]) || (!min && list[i][index] > res[index])) {
                res = list[i];
            }
        }
        return res;
    }

    getRouteData(routeId: string, routes): any {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].id === routeId) {
                return routes[i];
            }
        }
        return null;
    }

}

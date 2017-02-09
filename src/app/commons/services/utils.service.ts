/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
import { Injectable } from "@angular/core";
import * as leaflet   from "leaflet";
import { IBounds }    from "./api/feedsApi.service";

@Injectable()
export class UtilsService {

    constructor() {
    }

    public computeLatLng(bounds: IBounds): leaflet.LatLng {
        if (!bounds)
            return null
        let lngEast = bounds.east ? bounds.east : bounds.west // check for 0 values
        let lngWest = bounds.west ? bounds.west : bounds.east // check for 0 values
        let latNorth = bounds.north ? bounds.north : bounds.south // check for 0 values
        let latSouth = bounds.south ? bounds.south : bounds.north // check for 0 values
        // return averaged location
        return leaflet.latLng((latNorth + latSouth) / 2, (lngWest + lngEast) / 2);
    }
    
    public computeBoundsToLatLng(bounds: IBounds): leaflet.LatLng[] {
        if (!bounds)
            return null
        let lngEast = bounds.east ? bounds.east : bounds.west // check for 0 values
        let lngWest = bounds.west ? bounds.west : bounds.east // check for 0 values
        let latNorth = bounds.north ? bounds.north : bounds.south // check for 0 values
        let latSouth = bounds.south ? bounds.south : bounds.north // check for 0 values
        return [
            leaflet.latLng(latNorth, lngEast),
            leaflet.latLng(latSouth, lngEast),
            leaflet.latLng(latNorth, lngWest),
            leaflet.latLng(latSouth, lngWest)
        ];
    }
    
    public computeLatLngToBounds(latLng: leaflet.LatLng[]): IBounds {
        if (!latLng)
            return null
        let northEast = latLng[0];
        let southWest = latLng[1];
        return {
            north: northEast.lat,
            south: southWest.lat,
            east: northEast.lng,
            west: southWest.lng
        }
    }
    
    public setFileModelOnChange(model, property, event) {
        try {
            model[property] = event.target.files[0];
        }
        catch (e) {
            model[property] = null;
        }
    }
    
    public toggleOrder(value) {
        return (value == 'asc' ? 'desc' : 'asc');
    }
    
    public regionStateCountry(feed) {
        let parts = [];
        if (feed.region && feed.region.trim().length) {
            parts.push(feed.region);
        }
        if (feed.state && feed.state.trim().length) {
            parts.push(feed.state);
        }
        if (feed.country && feed.country.trim().length) {
            parts.push(feed.country);
        }
        return parts.join(', ');
    }
    
    public addFeedIdToJson(userInfos, feed_id){
        console.log("add feed_id to json");
        if (userInfos.app_metadata.datatools[0].subscriptions == null){
            let b = {"type": "feed-updated", target: []};
            userInfos.app_metadata.datatools[0].subscriptions = [];
            userInfos.app_metadata.datatools[0].subscriptions.push(b);
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        } else {
            userInfos.app_metadata.datatools[0].subscriptions[0].target.push(feed_id);
        }
        return userInfos;
    }
}

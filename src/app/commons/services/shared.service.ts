import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    centerMap = {
        lat: 0,
        lng: 0,
        zoom: 0
    };
    
    constructor() {
    }

    getCenterMap () {
        return this.centerMap;
    }

    setNewCenter (newCenter, zoom) {
        this.centerMap.lat = newCenter.lat;
        this.centerMap.lng = newCenter.lng;
        this.centerMap.zoom = zoom;
    }
}
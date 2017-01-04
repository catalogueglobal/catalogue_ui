import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    centerMap = {
        lat: 0,
        lng: 0
    };
    
    constructor() {
    }


    getCenterMap () {
        return this.centerMap;
    }

    setNewCenter (newCenter) {
        this.centerMap.lat = newCenter.lat;
        this.centerMap.lng = newCenter.lng;
    }
}
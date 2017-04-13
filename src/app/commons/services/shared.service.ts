import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    centerMap = {
        lat: 0,
        lng: 0,
        zoom: 0
    };

    licenses = [];
    miscDatas = [];

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

    getLicenses(){
      return this.licenses;
    }

    setLicenses(data){
      this.licenses = data;
    }

    getMiscDatas(){
      return this.miscDatas;
    }

    setMiscDatas(data){
      this.miscDatas = data;
    }
}

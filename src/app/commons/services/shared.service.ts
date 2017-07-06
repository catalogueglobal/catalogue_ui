import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharedService {
    centerMap = {
        lat: 0,
        lng: 0,
        zoom: 0
    };

    licenses = [];
    miscDatas = [];
    private notify = new Subject<any>();
    /**
   * Observable string streams
   */
    notifyObservable$ = this.notify.asObservable();

    constructor() {
    }

    public notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }

    getCenterMap() {
        return this.centerMap;
    }

    setNewCenter(newCenter, zoom) {
        this.centerMap.lat = newCenter.lat;
        this.centerMap.lng = newCenter.lng;
        this.centerMap.zoom = zoom;
    }

    getLicenses() {
        return this.licenses;
    }

    setLicenses(data) {
        this.licenses = data;
    }

    getMiscDatas() {
        return this.miscDatas;
    }

    setMiscDatas(data) {
        this.miscDatas = data;
    }
}

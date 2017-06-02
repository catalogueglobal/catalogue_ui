import { Injectable }  from "@angular/core";
import { environment } from "environments/environment";

@Injectable()
export class Configuration {

    public ROOT_API: string = environment.rootApi;
    public LICENSE_API: string = environment.licenseApi;
    public LICENSE_API_VERSION: string = environment.licenseApiVersion;
    public INSTITUTIONAL_URL: string = environment.institutionalUrl;
    public AUTH_ID: string = environment.authId;
    public AUTH_DOMAIN: string = environment.authDomain;
    public MAP_ZOOM_POSITION: number = 10; // initial zoom when geoloc found
    public MAP_ZOOM_UNKNOWN: number = 2; // initial zoom when geoloc not possible
    public MAP_ZOOM_BY_AUTOCOMPLETE_TYPE(positionType: string): number { // zoom level when selecting item from autocomplete
        switch (positionType) {
        case 'city':
            return this.MAP_ZOOM_POSITION;
        case 'state':
            return 7;
        case 'administrative': // country
            return 4;
        }
        return this.MAP_ZOOM_POSITION;
    }
    public MAP_DEFAULT_POSITION: number[] = [48.827208299999995, 2.2820185]; // initial position when geoloc not possible: Paris, FR
    public MAP_TILE_LAYER_URL: string = 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiemJvdXppYW5lIiwiYSI6ImNpa28yZnNoaTAwOWl3MG00M2Q0MG1qcHIifQ.r3Ye8UdsaoAc3DuF6elmXQ';
    public MAP_TILE_LAYER_OPTIONS: {} = {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, &copy; <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        noWrap: true
    };
    public AUTOCOMPLETE_LIMIT: number = 10;
    public AUTOCOMPLETE_URL(term: string) {
        return "https://nominatim.openstreetmap.org/search?format=json&namedetails=0&extratags=0&limit=" + this.AUTOCOMPLETE_LIMIT + "&q=" + term;
    }
    public PAGINATION_ITEMS_PER_PAGE = 10; //number of feeds per page
    public PAGINATION_LINKS_MAX = 9; // max number of page links displayed
    public NOTIFY_ERROR_TIMEOUT = 10000; // duration (ms) before hiding errors
    public HIGHLIGHT_TIME = 5000
    public USER_SUBSCRIBE_URL = this.INSTITUTIONAL_URL;
    public EDITION_URL = 'http://data.catalogue.global:4200';
}

import { Component, Output, Input }                    from '@angular/core';
import { EventEmitter }                                from "@angular/common/src/facade/async";
import { CompleterService, RemoteData, CompleterItem } from 'ng2-completer';
import { Configuration }                               from "app/modules/common";
import * as leaflet                                    from "leaflet";

export type AutocompleteItem = {
    position: leaflet.LatLngExpression,
    type: string,
}

@Component({
    selector: 'app-datasets-autocomplete',
    templateUrl: 'datasets-autocomplete.component.html',
    providers: [CompleterService]
})
export class DatasetsAutocompleteComponent {
    private dataService: RemoteData;
    @Output() private selected = new EventEmitter<AutocompleteItem>();
    @Input() private placeholder: string;
    data = [];

    constructor(
        private completerService: CompleterService,
        private config: Configuration) {
        this.dataService = completerService.remote(null, 'display_name', 'display_name');
        this.dataService.urlFormater(term => {
            return this.config.AUTOCOMPLETE_URL(term);

        });

        this.dataService.subscribe(data => {
            this.data = data;
        }
        );
    }

    onItemSelected(item: any, caller) {
        if (item) {
            let position: AutocompleteItem = {
                position: {
                    lat: item.originalObject.lat,
                    lng: item.originalObject.lon
                },
                type: item.originalObject.type
            };
            this.selected.emit(position);
        }
    }

    keyup(event) {
        // enter key
        if ((event.keyCode === 13 || event.code === 'Enter') && this.data && this.data.length > 0) {
            this.onItemSelected(this.data[0], this);
        }
    }
}

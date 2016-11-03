import {Component, Output, Input} from '@angular/core';
import {
  CompleterService, CompleterData, RemoteData,
  CompleterItem
} from 'ng2-completer';
import {Configuration} from "../../commons/configuration";
import {EventEmitter} from "@angular/common/src/facade/async";
import * as leaflet from "leaflet";

export type AutocompleteItem = {
  position: leaflet.LatLngExpression,
  type: string
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

  constructor(private completerService: CompleterService, private config: Configuration) {
    this.dataService = completerService.remote(null, 'display_name', 'display_name');
    this.dataService.urlFormater(term => {
      return this.config.AUTOCOMPLETE_URL(term);
    })
  }

  onItemSelected(selected: CompleterItem) {
    console.log('onItemSelected', selected);
    let position: AutocompleteItem = {
      position: {
        lat: selected.originalObject.lat,
        lng: selected.originalObject.lon
      },
      type: selected.originalObject.type
    };
    this.selected.emit(position);
  }
}

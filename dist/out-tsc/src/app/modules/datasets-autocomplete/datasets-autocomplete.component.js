var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, Input } from '@angular/core';
import { CompleterService } from 'ng2-completer';
import { Configuration } from "../../commons/configuration";
import { EventEmitter } from "@angular/common/src/facade/async";
export var DatasetsAutocompleteComponent = (function () {
    function DatasetsAutocompleteComponent(completerService, config) {
        var _this = this;
        this.completerService = completerService;
        this.config = config;
        this.selected = new EventEmitter();
        this.dataService = completerService.remote(null, 'display_name', 'display_name');
        this.dataService.urlFormater(function (term) {
            return _this.config.AUTOCOMPLETE_URL(term);
        });
    }
    DatasetsAutocompleteComponent.prototype.onItemSelected = function (selected) {
        console.log('onItemSelected', selected);
        var position = {
            position: {
                lat: selected.originalObject.lat,
                lng: selected.originalObject.lon
            },
            type: selected.originalObject.type
        };
        this.selected.emit(position);
        this.searchInput = null; // clear the input once the search is done
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], DatasetsAutocompleteComponent.prototype, "selected", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], DatasetsAutocompleteComponent.prototype, "placeholder", void 0);
    DatasetsAutocompleteComponent = __decorate([
        Component({
            selector: 'app-datasets-autocomplete',
            templateUrl: 'datasets-autocomplete.component.html',
            providers: [CompleterService]
        }), 
        __metadata('design:paramtypes', [CompleterService, Configuration])
    ], DatasetsAutocompleteComponent);
    return DatasetsAutocompleteComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/modules/datasets-autocomplete/datasets-autocomplete.component.js.map
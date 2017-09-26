"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var ng2_completer_1 = require("ng2-completer");
var DatasetsAutocompleteComponent = (function () {
    function DatasetsAutocompleteComponent(completerService, config) {
        var _this = this;
        this.completerService = completerService;
        this.config = config;
        this.selected = new core_2.EventEmitter();
        this.data = [];
        this.dataService = completerService.remote(null, 'display_name', 'display_name');
        this.dataService.urlFormater(function (term) {
            return _this.config.AUTOCOMPLETE_URL(term);
        });
        this.dataService.subscribe(function (data) {
            _this.data = data;
        });
    }
    DatasetsAutocompleteComponent.prototype.onItemSelected = function (item, caller) {
        if (item) {
            var position = {
                position: {
                    lat: item.originalObject.lat,
                    lng: item.originalObject.lon
                },
                type: item.originalObject.type
            };
            this.selected.emit(position);
        }
    };
    DatasetsAutocompleteComponent.prototype.keyup = function (event) {
        // enter key
        if ((event.keyCode === 13 || event.code === 'Enter') && this.data && this.data.length > 0) {
            this.onItemSelected(this.data[0], this);
        }
    };
    return DatasetsAutocompleteComponent;
}());
__decorate([
    core_1.Output()
], DatasetsAutocompleteComponent.prototype, "selected");
__decorate([
    core_1.Input()
], DatasetsAutocompleteComponent.prototype, "placeholder");
DatasetsAutocompleteComponent = __decorate([
    core_1.Component({
        selector: 'app-datasets-autocomplete',
        templateUrl: 'datasets-autocomplete.component.html',
        providers: [ng2_completer_1.CompleterService]
    })
], DatasetsAutocompleteComponent);
exports.DatasetsAutocompleteComponent = DatasetsAutocompleteComponent;

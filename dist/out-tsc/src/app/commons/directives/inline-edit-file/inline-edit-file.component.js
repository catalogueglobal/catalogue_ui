var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Renderer } from "@angular/core";
import { Configuration } from "../../configuration";
import { UtilsService } from "../../services/utils.service";
import { InlineEditGenericComponent } from "../inline-edit-text/inline-edit-generic.component";
export var InlineEditFileComponent = (function (_super) {
    __extends(InlineEditFileComponent, _super);
    function InlineEditFileComponent(renderer, config, utils) {
        _super.call(this, renderer, config);
        this.renderer = renderer;
        this.config = config;
        this.utils = utils;
        // override parent properties
        this.onSave = new EventEmitter();
        this.initialValue = null;
    }
    InlineEditFileComponent.prototype.clicked = function (event) {
        try {
            this.editingValue = event.target.files[0];
        }
        catch (e) {
            this.editingValue = null;
        }
        this.doneEditing();
    };
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], InlineEditFileComponent.prototype, "onSave", void 0);
    InlineEditFileComponent = __decorate([
        Component({
            selector: 'app-inline-edit-file',
            templateUrl: 'inline-edit-file.component.html'
        }), 
        __metadata('design:paramtypes', [Renderer, Configuration, UtilsService])
    ], InlineEditFileComponent);
    return InlineEditFileComponent;
}(InlineEditGenericComponent));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/inline-edit-file/inline-edit-file.component.js.map
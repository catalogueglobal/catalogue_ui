"use strict";
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
var core_1 = require("@angular/core");
var inline_edit_generic_component_1 = require("../inline-edit-text/inline-edit-generic.component");
var InlineEditFileComponent = (function (_super) {
    __extends(InlineEditFileComponent, _super);
    function InlineEditFileComponent(renderer, config, utils) {
        var _this = _super.call(this, renderer, config) || this;
        _this.renderer = renderer;
        _this.config = config;
        _this.utils = utils;
        // override parent properties
        _this.onSave = new core_1.EventEmitter();
        _this.initialValue = null;
        return _this;
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
    return InlineEditFileComponent;
}(inline_edit_generic_component_1.InlineEditGenericComponent));
__decorate([
    core_1.Output()
], InlineEditFileComponent.prototype, "onSave");
InlineEditFileComponent = __decorate([
    core_1.Component({
        selector: 'app-inline-edit-file',
        templateUrl: 'inline-edit-file.component.html'
    })
], InlineEditFileComponent);
exports.InlineEditFileComponent = InlineEditFileComponent;

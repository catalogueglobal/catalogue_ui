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
var rxjs_1 = require("rxjs");
var inline_edit_generic_component_1 = require("./inline-edit-generic.component");
var InlineEditTextComponent = (function (_super) {
    __extends(InlineEditTextComponent, _super);
    function InlineEditTextComponent(renderer, config) {
        var _this = _super.call(this, renderer, config) || this;
        _this.renderer = renderer;
        _this.config = config;
        _this.onSave = new core_1.EventEmitter();
        return _this;
    }
    // override parent
    InlineEditTextComponent.prototype.startEditing = function () {
        var _this = this;
        _super.prototype.startEditing.call(this);
        // timer mandatory for select()
        this.editingValue = ''; // mandatory for cursor at end of input
        rxjs_1.Observable.timer(50).subscribe(function () {
            _this.renderer.invokeElementMethod(_this.inlineInput.nativeElement, 'focus');
            _this.editingValue = _this.initialValue;
        });
    };
    return InlineEditTextComponent;
}(inline_edit_generic_component_1.InlineEditGenericComponent));
__decorate([
    core_1.Input()
], InlineEditTextComponent.prototype, "initialValue");
__decorate([
    core_1.Output()
], InlineEditTextComponent.prototype, "onSave");
__decorate([
    core_1.ViewChild('inlineInput')
], InlineEditTextComponent.prototype, "inlineInput");
InlineEditTextComponent = __decorate([
    core_1.Component({
        selector: 'app-inline-edit-text',
        templateUrl: 'inline-edit-text.component.html'
    })
], InlineEditTextComponent);
exports.InlineEditTextComponent = InlineEditTextComponent;

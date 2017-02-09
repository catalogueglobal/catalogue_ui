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
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from "@angular/core";
import { Observable } from "rxjs";
import { Configuration } from "../../configuration";
import { InlineEditGenericComponent } from "./inline-edit-generic.component";
export var InlineEditTextComponent = (function (_super) {
    __extends(InlineEditTextComponent, _super);
    function InlineEditTextComponent(renderer, config) {
        _super.call(this, renderer, config);
        this.renderer = renderer;
        this.config = config;
        this.onSave = new EventEmitter();
    }
    // override parent
    InlineEditTextComponent.prototype.startEditing = function () {
        var _this = this;
        _super.prototype.startEditing.call(this);
        // timer mandatory for select()
        this.editingValue = ""; // mandatory for cursor at end of input
        Observable.timer(50).subscribe(function () {
            _this.renderer.invokeElementMethod(_this.inlineInput.nativeElement, 'focus');
            _this.editingValue = _this.initialValue;
        });
    };
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], InlineEditTextComponent.prototype, "initialValue", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], InlineEditTextComponent.prototype, "onSave", void 0);
    __decorate([
        ViewChild('inlineInput'), 
        __metadata('design:type', ElementRef)
    ], InlineEditTextComponent.prototype, "inlineInput", void 0);
    InlineEditTextComponent = __decorate([
        Component({
            selector: 'app-inline-edit-text',
            templateUrl: 'inline-edit-text.component.html'
        }), 
        __metadata('design:paramtypes', [Renderer, Configuration])
    ], InlineEditTextComponent);
    return InlineEditTextComponent;
}(InlineEditGenericComponent));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/inline-edit-text/inline-edit-text.component.js.map
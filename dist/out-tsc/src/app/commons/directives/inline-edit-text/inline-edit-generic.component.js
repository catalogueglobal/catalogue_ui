var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
export var KEYCODE_ESCAPE = 27;
export var InlineEditGenericComponent = (function () {
    function InlineEditGenericComponent(renderer, config) {
        var _this = this;
        this.renderer = renderer;
        this.config = config;
        this.onSave = new EventEmitter();
        this.confirm$ = new EventEmitter();
        this.confirm$.subscribe(function () {
            _this.editing = false;
            // highlight for a few seconds
            _this.highlight = true;
            Observable.timer(config.HIGHLIGHT_TIME).subscribe(function () { _this.highlight = false; });
        });
    }
    InlineEditGenericComponent.prototype.startEditing = function () {
        this.editingValue = this.initialValue;
        this.editing = true;
    };
    InlineEditGenericComponent.prototype.doneEditing = function () {
        if (!this.editing) {
            // editing was already cancelled (with ESC key)
            return;
        }
        if (this.editingValue != this.initialValue) {
            // wait confirmation before hiding form
            var event_1 = {
                value: this.editingValue,
                confirm$: this.confirm$
            };
            this.onSave.emit(event_1);
        }
        else {
            this.cancelEditing();
        }
    };
    InlineEditGenericComponent.prototype.cancelEditing = function () {
        this.editing = false;
    };
    InlineEditGenericComponent.prototype.keypressCancelOnEscape = function (event) {
        if (event.keyCode == KEYCODE_ESCAPE) {
            this.cancelEditing();
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], InlineEditGenericComponent.prototype, "initialValue", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], InlineEditGenericComponent.prototype, "onSave", void 0);
    return InlineEditGenericComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/inline-edit-text/inline-edit-generic.component.js.map
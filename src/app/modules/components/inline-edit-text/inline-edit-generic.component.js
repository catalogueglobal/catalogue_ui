"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
exports.KEYCODE_ESCAPE = 27;
var InlineEditGenericComponent = (function () {
    function InlineEditGenericComponent(renderer, config) {
        var _this = this;
        this.renderer = renderer;
        this.config = config;
        this.onSave = new core_1.EventEmitter();
        this.confirm$ = new core_1.EventEmitter();
        this.confirm$.subscribe(function () {
            _this.editing = false;
            // highlight for a few seconds
            _this.highlight = true;
            rxjs_1.Observable.timer(config.HIGHLIGHT_TIME).subscribe(function () { _this.highlight = false; });
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
        if (this.editingValue !== this.initialValue) {
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
        if (event.keyCode === exports.KEYCODE_ESCAPE) {
            this.cancelEditing();
        }
    };
    return InlineEditGenericComponent;
}());
__decorate([
    core_1.Input()
], InlineEditGenericComponent.prototype, "initialValue");
__decorate([
    core_1.Output()
], InlineEditGenericComponent.prototype, "onSave");
exports.InlineEditGenericComponent = InlineEditGenericComponent;

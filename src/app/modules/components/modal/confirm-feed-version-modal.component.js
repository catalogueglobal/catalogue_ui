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
var common_modal_component_1 = require("./common-modal.component");
var ConfirmFeedVersionModal = (function (_super) {
    __extends(ConfirmFeedVersionModal, _super);
    function ConfirmFeedVersionModal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfirmFeedVersionModal.prototype.validate = function () {
        if (this.onSubmit) {
            this.onSubmit(true);
        }
        _super.prototype.hide.call(this);
    };
    ConfirmFeedVersionModal.prototype.cancel = function () {
        _super.prototype.hide.call(this);
        if (this.onSubmit) {
            this.onSubmit(false);
        }
    };
    return ConfirmFeedVersionModal;
}(common_modal_component_1.CommonComponent));
__decorate([
    core_1.Input()
], ConfirmFeedVersionModal.prototype, "onSubmit");
ConfirmFeedVersionModal = __decorate([
    core_1.Component({
        selector: 'confirm-feed-version-modal',
        templateUrl: 'confirm-feed-version-modal.html'
    })
], ConfirmFeedVersionModal);
exports.ConfirmFeedVersionModal = ConfirmFeedVersionModal;

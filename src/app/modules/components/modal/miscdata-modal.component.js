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
var MiscDataModal = (function (_super) {
    __extends(MiscDataModal, _super);
    function MiscDataModal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MiscDataModal;
}(common_modal_component_1.CommonComponent));
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "newLicenseOrMiscData");
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "utils");
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "items");
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "onSelectionChange");
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "onItemChanged");
__decorate([
    core_1.Input()
], MiscDataModal.prototype, "onSubmit");
MiscDataModal = __decorate([
    core_1.Component({
        selector: 'miscdata-modal',
        templateUrl: 'miscdata-modal.html'
    })
], MiscDataModal);
exports.MiscDataModal = MiscDataModal;

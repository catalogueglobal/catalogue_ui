"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var angular2_toaster_1 = require("angular2-toaster/angular2-toaster");
var StatusComponent = (function () {
    function StatusComponent(config, toasterService, datasetsStore, datasetsAction, translateService) {
        this.config = config;
        this.toasterService = toasterService;
        this.datasetsStore = datasetsStore;
        this.datasetsAction = datasetsAction;
        this.translateService = translateService;
        this.toasterConfig = new angular2_toaster_1.ToasterConfig({
            showCloseButton: true,
            tapToDismiss: true,
            timeout: 0,
            positionClass: 'toast-bottom-left',
            bodyOutputType: angular2_toaster_1.BodyOutputType.TrustedHtml
        });
        this.status = datasetsStore.select('datasets').map(function (datasetsState) { return datasetsState.status; });
    }
    StatusComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.status.subscribe(function (statusValue) {
            if (statusValue.errorMessage) {
                var toast = {
                    type: 'error',
                    body: _this.translateService.instant(statusValue.errorMessage, statusValue.errorMessageArgs),
                    timeout: _this.config.NOTIFY_ERROR_TIMEOUT
                };
                _this.toasterService.pop(toast);
            }
        });
    };
    StatusComponent.prototype.getStatus = function () {
        return this.status;
    };
    StatusComponent.prototype.clearStatusNotifyMessage = function () {
        this.datasetsStore.dispatch(this.datasetsAction.statusClearNotifyMessage());
    };
    return StatusComponent;
}());
StatusComponent = __decorate([
    core_1.Component({
        selector: 'app-status',
        templateUrl: 'status.component.html'
    })
], StatusComponent);
exports.StatusComponent = StatusComponent;

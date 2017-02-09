var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { ToasterService, ToasterConfig, BodyOutputType } from "angular2-toaster/angular2-toaster";
import { TranslateService } from "ng2-translate/src/translate.service";
import { Configuration } from "../../../commons/configuration";
import { DatasetsActions } from "../../../state/datasets/datasets.actions";
export var StatusComponent = (function () {
    function StatusComponent(config, toasterService, datasetsStore, datasetsAction, translateService) {
        this.config = config;
        this.toasterService = toasterService;
        this.datasetsStore = datasetsStore;
        this.datasetsAction = datasetsAction;
        this.translateService = translateService;
        this.toasterConfig = new ToasterConfig({
            showCloseButton: true,
            tapToDismiss: true,
            timeout: 0,
            positionClass: 'toast-bottom-left',
            bodyOutputType: BodyOutputType.TrustedHtml
        });
        this.status = datasetsStore.select('datasets').map(function (datasetsState) { return datasetsState.status; });
    }
    StatusComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.status.subscribe(function (statusValue) {
            //console.log('statusValue', statusValue)
            if (statusValue.errorMessage) {
                var toast = {
                    type: 'error',
                    body: _this.translateService.get(statusValue.errorMessage, statusValue.errorMessageArgs),
                    timeout: _this.config.NOTIFY_ERROR_TIMEOUT
                };
                //console.log('toast error', toast);
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
    StatusComponent = __decorate([
        Component({
            selector: 'app-status',
            templateUrl: 'status.component.html'
        }), 
        __metadata('design:paramtypes', [Configuration, ToasterService, Store, DatasetsActions, TranslateService])
    ], StatusComponent);
    return StatusComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/status/status.component.js.map
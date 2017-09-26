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
var ngx_pagination_1 = require("ngx-pagination");
var validation_details_modal_component_1 = require("../modal/validation-details-modal.component");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var datasets_generic_component_1 = require("../datasets-generic/datasets-generic.component");
var DatasetsTableComponent = (function (_super) {
    __extends(DatasetsTableComponent, _super);
    function DatasetsTableComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.sortChange = new core_1.EventEmitter();
        _this.page = 1;
        _this.currentSort = {
            sort: 'name',
            order: 'asc'
        };
        _this.subscribeActions(_this.actions$);
        return _this;
    }
    Object.defineProperty(DatasetsTableComponent.prototype, "feeds", {
        // overriden by childs
        get: function () {
            return this._feeds;
        },
        // overriden by childs
        set: function (value) {
            this.getLicenses(value);
            if (!value) {
                this._feeds = null;
                return;
            }
            this._feeds = value;
        },
        enumerable: true,
        configurable: true
    });
    DatasetsTableComponent.prototype.setSort = function (sort) {
        this.sortChange.emit(sort);
    };
    DatasetsTableComponent.prototype.regionStateCountry = function (feed) {
        return this.utils.regionStateCountry(feed);
    };
    DatasetsTableComponent.prototype.subscribeActions = function (actions$) {
        var _this = this;
        // close inline edit form on setName() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(function () {
            console.log('USER_SUBSCRIBE setting profile');
            _this.sessionService.setProfile();
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS).subscribe(function () {
            console.log('UNSUBSCRIBE_FEED setting profile');
            _this.sessionService.setProfile();
        });
    };
    DatasetsTableComponent.prototype.openValidation = function (feed) {
        _super.prototype.openValidation.call(this, feed);
        if (feed && feed.selectedVersion && feed.selectedVersion.id) {
            this.validationDetailsModal.show();
        }
    };
    DatasetsTableComponent.prototype.resetPage = function () {
        this.page = 1;
    };
    return DatasetsTableComponent;
}(datasets_generic_component_1.DatasetsGenericComponent));
__decorate([
    core_1.Input()
], DatasetsTableComponent.prototype, "_feeds");
__decorate([
    core_1.Output()
], DatasetsTableComponent.prototype, "sortChange");
__decorate([
    core_1.ViewChild(validation_details_modal_component_1.ValidationDetailsModal)
], DatasetsTableComponent.prototype, "validationDetailsModal");
__decorate([
    core_1.Input()
], DatasetsTableComponent.prototype, "feeds");
DatasetsTableComponent = __decorate([
    core_1.Component({
        selector: 'app-datasets-table',
        templateUrl: 'datasets-table.component.html',
        providers: [ngx_pagination_1.PaginationService]
    })
], DatasetsTableComponent);
exports.DatasetsTableComponent = DatasetsTableComponent;

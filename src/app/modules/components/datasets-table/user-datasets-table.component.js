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
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var datasets_table_component_1 = require("../datasets-table/datasets-table.component");
var license_modal_component_1 = require("../modal/license-modal.component");
var miscdata_modal_component_1 = require("../modal/miscdata-modal.component");
var delete_feed_modal_component_1 = require("../modal/delete-feed-modal.component");
var CONFIRM_EDIT_IDX_SETFILE = 'setFile';
var UserDatasetsTableComponent = (function (_super) {
    __extends(UserDatasetsTableComponent, _super);
    function UserDatasetsTableComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.sortChange = new core_1.EventEmitter();
        _this.resetForm(_this._feeds);
        return _this;
    }
    UserDatasetsTableComponent.prototype.ngOnInit = function () {
        this.onSelectionChangeCallback = this.onSelectionChange.bind(this);
        this.onItemChangedCallback = this.onItemChanged.bind(this);
        this.onSubmitLicenseCallback = this.onSubmitLicense.bind(this);
        this.onSubmitMiscDataCallback = this.onSubmitMiscData.bind(this);
    };
    UserDatasetsTableComponent.prototype.subscribeActions = function (actions$) {
        var _this = this;
        // close inline edit form on setName() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_NAME_SUCCESS).subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.processConfirm('setName' + updatedFeed.id);
        });
        // close inline edit form on setFile() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.processConfirm(CONFIRM_EDIT_IDX_SETFILE + updatedFeed.id);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_LICENSE_FAIL).subscribe(function (action) {
            _this.createLicenseFail(action.payload.feed, action.payload.error);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm(_this._feeds);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm(_this._feeds);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm(_this._feeds);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_MISCDATA_FAIL).subscribe(function (action) {
            _this.createLicenseFail(action.payload.feed, action.payload.error);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm(_this._feeds);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm(_this._feeds);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm(_this._feeds);
        });
    };
    UserDatasetsTableComponent.prototype.displayLicense = function (feed) {
        _super.prototype.displayLicense.call(this, feed);
        this.licenseModal.show();
    };
    UserDatasetsTableComponent.prototype.displayMiscData = function (feed) {
        _super.prototype.displayMiscData.call(this, feed);
        this.miscDataModal.show();
    };
    UserDatasetsTableComponent.prototype.displayDeleteFeed = function (feed) {
        _super.prototype.displayDeleteFeed.call(this, feed);
        this.deleteFeedModal.show();
    };
    UserDatasetsTableComponent.prototype.setLicense = function () {
        var res = !_super.prototype.setLicense.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    UserDatasetsTableComponent.prototype.unsetLicense = function () {
        var res = _super.prototype.unsetLicense.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    UserDatasetsTableComponent.prototype.setMiscData = function () {
        var res = _super.prototype.setMiscData.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    UserDatasetsTableComponent.prototype.unsetMiscData = function () {
        var res = _super.prototype.unsetMiscData.call(this);
        if (!res) {
            this.miscDataModal.hide();
        }
        return res;
    };
    UserDatasetsTableComponent.prototype.setSort = function (sort) {
        this.sortChange.emit(sort);
    };
    return UserDatasetsTableComponent;
}(datasets_table_component_1.DatasetsTableComponent));
__decorate([
    core_1.Output()
], UserDatasetsTableComponent.prototype, "sortChange");
__decorate([
    core_1.Input()
], UserDatasetsTableComponent.prototype, "_feeds");
__decorate([
    core_1.ViewChild(license_modal_component_1.LicenseModal)
], UserDatasetsTableComponent.prototype, "licenseModal");
__decorate([
    core_1.ViewChild(miscdata_modal_component_1.MiscDataModal)
], UserDatasetsTableComponent.prototype, "miscDataModal");
__decorate([
    core_1.ViewChild(delete_feed_modal_component_1.DeleteFeedModal)
], UserDatasetsTableComponent.prototype, "deleteFeedModal");
UserDatasetsTableComponent = __decorate([
    core_1.Component({
        selector: 'app-user-datasets-table',
        templateUrl: 'user-datasets-table.component.html',
        providers: [ngx_pagination_1.PaginationService]
    })
], UserDatasetsTableComponent);
exports.UserDatasetsTableComponent = UserDatasetsTableComponent;

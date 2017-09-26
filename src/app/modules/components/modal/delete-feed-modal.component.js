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
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var DeleteFeedModal = (function (_super) {
    __extends(DeleteFeedModal, _super);
    function DeleteFeedModal(store, datasetsAction, actions$) {
        var _this = _super.call(this) || this;
        _this.store = store;
        _this.datasetsAction = datasetsAction;
        _this.actions$ = actions$;
        actions$.ofType(datasets_actions_1.DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS).subscribe(function (action) { return _this.deleteFeed(); });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(function (action) { return _this.deleteFeedSuccess(); });
        _this.deletedFeed = {
            deleteProject: false,
            clicked: false
        };
        return _this;
    }
    DeleteFeedModal.prototype.deleteFeedSuccess = function () {
        this.hide();
        this.deletedFeed = {
            deleteProject: false,
            clicked: false
        };
        if (this.feed.feedVersionCount <= 1 || !this.feed.feedVersionCount) {
            this.store.dispatch(this.datasetsAction.feedDeleteLicenses(this.licenses));
            this.store.dispatch(this.datasetsAction.feedDeleteMiscs(this.miscs));
        }
    };
    DeleteFeedModal.prototype.deleteFeed = function () {
        var feed = datasets_actions_1.toFeedReference(this.feed);
        if (feed) {
            this.licenses = {};
            this.miscs = {};
            if (this.feedsLicenses[feed.feedsourceId]) {
                if (!this.licenses[this.feedsLicenses[feed.feedsourceId].id]) {
                    this.licenses[this.feedsLicenses[feed.feedsourceId].id] = [];
                }
                this.licenses[this.feedsLicenses[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            if (this.feedsMiscDatas[feed.feedsourceId]) {
                if (!this.miscs[this.feedsMiscDatas[feed.feedsourceId].id]) {
                    this.miscs[this.feedsMiscDatas[feed.feedsourceId].id] = [];
                }
                this.miscs[this.feedsMiscDatas[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            feed.versionId = this.feed.selectedVersion.id;
            feed.feedVersionCount = this.feed.feedVersionCount;
            this.store.dispatch(this.datasetsAction.feedDelete([feed]));
        }
        return false;
    };
    DeleteFeedModal.prototype.validate = function () {
        this.deletedFeed.clicked = true;
        this.store.dispatch(this.datasetsAction.confirmationDeleteProject(this.deletedFeed.deleteProject));
    };
    return DeleteFeedModal;
}(common_modal_component_1.CommonComponent));
__decorate([
    core_1.Input()
], DeleteFeedModal.prototype, "feed");
__decorate([
    core_1.Input()
], DeleteFeedModal.prototype, "feedsLicenses");
__decorate([
    core_1.Input()
], DeleteFeedModal.prototype, "feedsMiscDatas");
DeleteFeedModal = __decorate([
    core_1.Component({
        selector: 'delete-feed-modal',
        templateUrl: 'delete-feed-modal.html'
    })
], DeleteFeedModal);
exports.DeleteFeedModal = DeleteFeedModal;

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
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var components_1 = require("app/modules/components");
var FeedPage = (function (_super) {
    __extends(FeedPage, _super);
    function FeedPage(injector, route, router) {
        var _this = _super.call(this, injector) || this;
        _this.route = route;
        _this.router = router;
        _this.feed = {};
        _this.isAuthorised = false;
        _this.clickAddNoteToFeed = false;
        _this.getPublicFeed = true;
        // Get the id of the feed
        _this.route.params.subscribe(function (params) {
            _this.feedId = params['id'];
            _this.getPublicFeed = params['public'] ? (params['public'].toString() === 'false' ? false : true) : true;
        });
        // Get the info from the feed id
        _this.notesFeed = [];
        _this.getFeed();
        return _this;
    }
    FeedPage.prototype.ngOnInit = function () {
        this.onSelectionChangeCallback = this.onSelectionChange.bind(this);
        this.onItemChangedCallback = this.onItemChanged.bind(this);
        this.onSubmitLicenseCallback = this.onSubmitLicense.bind(this);
        this.onSubmitMiscDataCallback = this.onSubmitMiscData.bind(this);
        this.onSubmitConfirmFeedVersionCallback = this.onSubmitConfirmFeedVersion.bind(this);
    };
    Object.defineProperty(FeedPage.prototype, "feeds", {
        // overriden by childs
        get: function () {
            return this._feeds;
        },
        set: function (value) {
            if (!value) {
                this._feeds = null;
                return;
            }
            this._feeds = value;
        },
        enumerable: true,
        configurable: true
    });
    FeedPage.prototype.getFeed = function () {
        var that = this;
        this.resetForm(null);
        this.feedsApiService.getFeed(this.feedId, this.getPublicFeed).then(function (data) {
            that.feed = data;
            that.feeds = [that.feed];
            that.getLicenses(that.feeds);
            that.mapPosition = that.feed.latestValidation ? that.utils.computeLatLng(that.feed.latestValidation.bounds) :
                that.mapPosition;
            if (that.sessionService.loggedIn === true) {
                that.checkAuthorisations();
                that.subscribeActions(that.actions$);
            }
            if (that.sessionService.loggedIn === true) {
                that.feedsApiService.getNotes(that.feedId, that.feed.isPublic).then(function (data) {
                    that.notesFeed = data.reverse();
                })["catch"](function (err) { return console.log(err); });
            }
        })["catch"](function (err) { return console.log(err); });
    };
    FeedPage.prototype.checkAuthorisations = function () {
        this.isAuthorised = this.utils.userHasRightsOnFeed(this.sessionService.userProfile, this.feed.projectId, this.feed.id);
    };
    FeedPage.prototype.subscribeActions = function (actions$) {
        var _this = this;
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS).subscribe(function (action) { return _this.resetForm([_this.feed]); });
        // close inline edit form on setName() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.SUBSCRIBE_FEED_SUCCESS).subscribe(function () {
            console.log('USER_SUBSCRIBE setting profile');
            _this.sessionService.setProfile();
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_NAME_SUCCESS).subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.feed.name = action.payload.feed.name;
            _this.processConfirm('setName' + updatedFeed.id);
        });
        // close inline edit form on setName() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_PUBLIC_SUCCESS).subscribe(function (action) {
            _this.feed.isPublic = action.payload.feed.isPublic;
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS).subscribe(function () {
            console.log('UNSUBSCRIBE_FEED setting profile');
            _this.sessionService.setProfile();
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_LICENSE_FAIL).subscribe(function (action) {
            _this.createLicenseFail(action.payload.feed, action.payload.error);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm([_this.feed]);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm([_this.feed]);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(function (action) {
            _this.licenseModal.hide();
            _this.resetForm([_this.feed]);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_MISCDATA_FAIL).subscribe(function (action) {
            _this.createLicenseFail(action.payload.feed, action.payload.error);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm([_this.feed]);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm([_this.feed]);
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS).subscribe(function (action) {
            _this.miscDataModal.hide();
            _this.resetForm([_this.feed]);
        });
        // close inline edit form on setFile() success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(function (action) {
            var updatedFeed = action.payload.feed;
            _this.processConfirm('setFile' + updatedFeed.id);
            _this.selectedFileTarget = null;
            _this.file = null;
        });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(function (action) { return _this.feedChanged(); });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(function () { return _this.feedChanged(); });
    };
    FeedPage.prototype.containsOnlySpace = function () {
        if (!this.note) {
            return true;
        }
        return this.utils.trim(this.note).length === 0;
    };
    FeedPage.prototype.addNotesToFeed = function () {
        // add note to feed if not empty
        if (this.note !== null && this.sessionService.userProfile) {
            var data = {
                body: this.note, date: Date.now(), userEmail: this.sessionService.userProfile.email,
                user: this.sessionService.userProfile.user_id
            };
            this.store.dispatch(this.datasetsAction.feedAddNotes(this.feedId, data));
            this.notesFeed.unshift(data);
        }
    };
    FeedPage.prototype.clickDisplayAddNoteToFeed = function () {
        if (!this.sessionService.loggedIn) {
            this.sessionService.login();
        }
        else {
            this.clickAddNoteToFeed = true;
        }
    };
    FeedPage.prototype.displayLicense = function (feed) {
        _super.prototype.displayLicense.call(this, feed);
        this.licenseModal.show();
    };
    FeedPage.prototype.displayMiscData = function (feed) {
        _super.prototype.displayMiscData.call(this, feed);
        this.miscDataModal.show();
    };
    FeedPage.prototype.setLicense = function () {
        var res = !_super.prototype.setLicense.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    FeedPage.prototype.unsetLicense = function () {
        var res = _super.prototype.unsetLicense.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    FeedPage.prototype.setMiscData = function () {
        var res = _super.prototype.setMiscData.call(this);
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    };
    FeedPage.prototype.unsetMiscData = function () {
        var res = _super.prototype.unsetMiscData.call(this);
        if (!res) {
            this.miscDataModal.hide();
        }
        return res;
    };
    FeedPage.prototype.resetForm = function (values) {
        _super.prototype.resetForm.call(this, values);
        this.note = '';
    };
    FeedPage.prototype.onSubmitConfirmFeedVersion = function (validate) {
        if (validate) {
            this.setFile(this.feed, {
                value: this.selectedFileTarget.files[0]
            });
        }
        else {
            this.selectedFileTarget = null;
        }
    };
    FeedPage.prototype.fileChanged = function (event) {
        try {
            this.selectedFileTarget = event.target;
            this.confirmFeedVersionModal.show();
        }
        catch (e) {
            console.log(e);
        }
    };
    FeedPage.prototype.openValidation = function (feed) {
        _super.prototype.openValidation.call(this, feed);
        if (feed && feed.selectedVersion && feed.selectedVersion.id) {
            this.validationDetailsModal.show();
        }
    };
    FeedPage.prototype.feedChanged = function () {
        console.log('getting versions');
        this.getFeedVersion(this.feed);
    };
    return FeedPage;
}(components_1.DatasetsGenericComponent));
__decorate([
    core_1.ViewChild(components_1.LicenseModal)
], FeedPage.prototype, "licenseModal");
__decorate([
    core_1.ViewChild(components_1.MiscDataModal)
], FeedPage.prototype, "miscDataModal");
__decorate([
    core_1.ViewChild(components_1.ConfirmFeedVersionModal)
], FeedPage.prototype, "confirmFeedVersionModal");
__decorate([
    core_1.ViewChild(components_1.ValidationDetailsModal)
], FeedPage.prototype, "validationDetailsModal");
__decorate([
    core_1.Input()
], FeedPage.prototype, "mapPosition");
FeedPage = __decorate([
    core_1.Component({
        selector: 'app-feed-page',
        templateUrl: 'feed.page.html'
    })
], FeedPage);
exports.FeedPage = FeedPage;

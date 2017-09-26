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
var _1 = require("app/modules/common/");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var datasets_abstract_component_1 = require("../datasets-abstract/datasets-abstract.component");
var DatasetsGenericComponent = (function (_super) {
    __extends(DatasetsGenericComponent, _super);
    function DatasetsGenericComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.feedsLicenses = {};
        _this.feedsMiscDatas = {};
        _this.confirmEditById = new Map();
        _this.FEED_RETRIEVAL_METHOD = _1.FEED_RETRIEVAL_METHOD; // used by the template
        return _this;
    }
    DatasetsGenericComponent.prototype.subscribeActions = function (actions) {
    };
    DatasetsGenericComponent.prototype.getFeedVersion = function (feed) {
        if (feed.feedVersionCount > 1) {
            var that_1 = this;
            this.feedsApiService.getFeedVersions(feed.id, feed.isPublic).then(function (versions) {
                feed.allVersions = versions.sort(function (a, b) {
                    return b.updated - a.updated;
                });
                feed.selectedVersion = feed.allVersions[0];
                feed.latestValidation = feed.selectedVersion.validationSummary || feed.latestValidation;
                feed.selectedVersion.id = feed.selectedVersion.id || feed.id;
                that_1.setLastVersionId(feed);
            });
        }
        else {
            var copy = Object.assign({}, feed);
            copy.updated = copy.lastUpdated;
            copy.id = copy.latestVersionId;
            feed.allVersions = [copy];
            feed.selectedVersion = feed.allVersions[0];
            feed.selectedVersion.id = feed.selectedVersion.id || feed.id;
            this.setLastVersionId(feed);
        }
    };
    DatasetsGenericComponent.prototype.setLastVersionId = function (feed) {
        for (var i = 0; i < feed.allVersions.length; i++) {
            if (!feed.allVersions[i].nextVersionId) {
                this.latestVersionId = feed.allVersions[i].id;
            }
        }
    };
    DatasetsGenericComponent.prototype.getLicenses = function (value) {
        var _this = this;
        var that = this;
        this.getMiscDatas(value);
        this.getFeedsVersion(value);
        this.licenseApiService.getLicenses().then(function (licenses) {
            that.licenses = licenses;
            _this.shared.setLicenses(licenses);
            that.feedsLicenses = {};
            that.setFeedsItemsObj(value, true);
        });
    };
    DatasetsGenericComponent.prototype.getFeedsVersion = function (values) {
        for (var i = 0; values && i < values.length; i++) {
            this.getFeedVersion(values[i]);
        }
    };
    DatasetsGenericComponent.prototype.getMiscDatas = function (value) {
        var _this = this;
        var that = this;
        this.licenseApiService.getMiscDatas()
            .then(function (miscDatas) {
            that.miscDatas = miscDatas;
            _this.shared.setMiscDatas(miscDatas);
            that.feedsMiscDatas = {};
            that.setFeedsItemsObj(value, false);
        })["catch"](function (error) {
            console.log(error);
        });
    };
    DatasetsGenericComponent.prototype.setFeedItemsObj = function (feed, license) {
        var itemsObj = this.feedsLicenses;
        var apiUrl = this.licenseApiService.FEED_LICENSE;
        var itemsList = this.licenses;
        var downloadUrl = 'licenseUrl';
        if (!license) {
            itemsObj = this.feedsMiscDatas;
            apiUrl = this.licenseApiService.FEED_MISC_DATA;
            itemsList = this.miscDatas;
            downloadUrl = 'miscDataUrl';
        }
        for (var i = 0; itemsList && i < itemsList.length; i++) {
            if (itemsList[i].feedIds) {
                for (var j = 0; itemsList[i].feedIds && j < itemsList[i].feedIds.length; j++) {
                    if (feed.id === itemsList[i].feedIds[j]) {
                        itemsObj[feed.id] = itemsList[i];
                        itemsObj[feed.id][downloadUrl] = apiUrl + '/' + itemsList[i].id;
                    }
                }
            }
        }
    };
    DatasetsGenericComponent.prototype.setFeedsItemsObj = function (value, license) {
        var itemsList = license ? this.licenses : this.miscDatas;
        if (itemsList && value) {
            for (var k = 0; k < value.length; k++) {
                this.setFeedItemsObj(value[k], license);
            }
        }
    };
    // Return true or false if the user is subscribe
    // or not to the feed
    DatasetsGenericComponent.prototype.isSubscribe = function (userInfos, feed_id) {
        if (!userInfos.app_metadata || userInfos.app_metadata.datatools[0].subscriptions === null) {
            return -1;
        }
        else {
            for (var i = 0; i < userInfos.app_metadata.datatools[0].subscriptions[0].target.length; i++) {
                if (userInfos.app_metadata.datatools[0].subscriptions[0].target[i] === feed_id) {
                    return i;
                }
            }
            return -1;
        }
    };
    DatasetsGenericComponent.prototype.checkSubscribed = function (feed_id) {
        var index = -1;
        if (this.sessionService.userProfile &&
            this.sessionService.userProfile.app_metadata &&
            this.sessionService.userProfile.app_metadata.datatools &&
            this.sessionService.userProfile.app_metadata.datatools[0] &&
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions &&
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0] &&
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0].target &&
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0].target.length > 0) {
            index = this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0].target.indexOf(feed_id);
        }
        if (index === -1) {
            return false;
        }
        return true;
    };
    DatasetsGenericComponent.prototype.actionOnFeed = function (feed_id) {
        var response = this.usersApiService.getUser(this.sessionService.userId);
        var that = this;
        response.then(function (data) {
            var isSubscribe = that.isSubscribe(data, feed_id);
            that.subscribeOrUnsubscribeFeed(data, feed_id, isSubscribe);
        });
    };
    DatasetsGenericComponent.prototype.subscribeOrUnsubscribeFeed = function (data, feed_id, isSubscribeIndex) {
        if (isSubscribeIndex === -1) {
            console.log('SUBSCRIBE');
            data = this.utils.addFeedIdToJson(data, feed_id);
            this.store.dispatch(this.datasetsAction.subscribeToFeed(data.user_id, { 'data': data.app_metadata.datatools }));
        }
        else {
            console.log('UNSUBSCRIBE');
            data.app_metadata.datatools[0].subscriptions[0].target.splice(isSubscribeIndex, 1);
            console.log(data.app_metadata.datatools[0]);
            this.store.dispatch(this.datasetsAction.unsubscribeToFeed(data.user_id, { 'data': data.app_metadata.datatools }));
        }
    };
    /**
     *EDITION
     *
     */
    DatasetsGenericComponent.prototype.resetForm = function (feedsValues) {
        //if (feedsValues) {
        if (this.currentFeed) {
            this.currentFeed = null;
            this.getLicenses(feedsValues);
        }
        this.newLicenseOrMiscData = {
            type: 'new',
            name: '',
            item: null,
            error: null,
            itemFile: {}
        };
        //};
    };
    DatasetsGenericComponent.prototype.createLicenseFail = function (feed, error) {
        this.newLicenseOrMiscData.error = error.message;
    };
    DatasetsGenericComponent.prototype.displayLicense = function (feed) {
        this.currentFeed = feed;
        for (var i = 0; this.licenses && i < this.licenses.length; i++) {
            if (this.feedsLicenses[this.currentFeed.id] && this.licenses[i].id ===
                this.feedsLicenses[this.currentFeed.id].id) {
                this.newLicenseOrMiscData.item = this.licenses[i];
            }
            if (!this.newLicenseOrMiscData.item && this.licenses[i].id === this.defaultLicenseId) {
                this.newLicenseOrMiscData.item = this.licenses[i];
            }
        }
        if (!this.newLicenseOrMiscData.item) {
            this.newLicenseOrMiscData.item = (this.licenses && this.licenses.length > 0) ? this.licenses[0] : null;
        }
    };
    DatasetsGenericComponent.prototype.displayMiscData = function (feed) {
        this.currentFeed = feed;
        this.newLicenseOrMiscData.item = (this.miscDatas && this.miscDatas.length > 0) ? this.miscDatas[0] : null;
        if (this.feedsLicenses[this.currentFeed.id] && this.miscDatas) {
            for (var i = 0; i < this.miscDatas.length; i++) {
                if (this.miscDatas[i].id === this.feedsLicenses[this.currentFeed.id].id) {
                    this.newLicenseOrMiscData.item = this.miscDatas[i];
                }
            }
        }
    };
    DatasetsGenericComponent.prototype.displayDeleteFeed = function (feed) {
        this.currentFeed = feed;
    };
    //lincense changed between existing licenses in the list (modal popup)
    DatasetsGenericComponent.prototype.onItemChanged = function (item) {
        console.log('selectedItem', item);
        this.newLicenseOrMiscData.item = item;
    };
    // type of the radio button changed (ex: no license, change license or custom license)
    DatasetsGenericComponent.prototype.onSelectionChange = function (type) {
        console.log('onSelectionChange', type);
        this.newLicenseOrMiscData.type = type;
    };
    DatasetsGenericComponent.prototype.setLicense = function () {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetLicense(datasets_actions_1.toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
            return true;
        }
        else {
            return false;
        }
    };
    DatasetsGenericComponent.prototype.unsetLicense = function () {
        if (this.feedsLicenses[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetLicense(datasets_actions_1.toFeedReference(this.currentFeed), this.feedsLicenses[this.currentFeed.id].id));
            return true;
        }
        else {
            return false;
        }
    };
    DatasetsGenericComponent.prototype.createLicense = function () {
        this.store.dispatch(this.datasetsAction.feedCreateLicense(datasets_actions_1.toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    };
    DatasetsGenericComponent.prototype.setMiscData = function () {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetMiscData(datasets_actions_1.toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
            return true;
        }
        else {
            return false;
        }
    };
    DatasetsGenericComponent.prototype.unsetMiscData = function () {
        if (this.feedsMiscDatas[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetMiscData(datasets_actions_1.toFeedReference(this.currentFeed), this.feedsMiscDatas[this.currentFeed.id].id));
            return true;
        }
        else {
            return false;
        }
    };
    DatasetsGenericComponent.prototype.createMiscData = function () {
        this.store.dispatch(this.datasetsAction.feedCreateMiscData(datasets_actions_1.toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    };
    DatasetsGenericComponent.prototype.onSubmitLicense = function () {
        switch (this.newLicenseOrMiscData.type) {
            case 'no':
                this.unsetLicense();
                break;
            case 'custom':
                this.createLicense();
                break;
            case 'new':
                this.setLicense();
                break;
            default:
                break;
        }
    };
    DatasetsGenericComponent.prototype.onSubmitMiscData = function () {
        switch (this.newLicenseOrMiscData.type) {
            case 'no':
                this.unsetMiscData();
                break;
            case 'custom':
                this.createMiscData();
                break;
            case 'new':
                this.setMiscData();
                break;
            default:
                break;
        }
    };
    DatasetsGenericComponent.prototype.togglePublic = function (feed) {
        var value = !feed.isPublic;
        this.store.dispatch(this.datasetsAction.feedSetPublic(datasets_actions_1.toFeedReference(feed), value));
        return false;
    };
    DatasetsGenericComponent.prototype.setName = function (feed, event) {
        this.confirmEditById.set('setName' + feed.id, event.confirm$);
        this.store.dispatch(this.datasetsAction.feedSetName(datasets_actions_1.toFeedReference(feed), event.value));
    };
    DatasetsGenericComponent.prototype.processConfirm = function (idx) {
        var confirmEdit = this.confirmEditById.get(idx);
        if (confirmEdit) {
            confirmEdit.emit(true);
            this.confirmEditById["delete"](idx);
        }
    };
    DatasetsGenericComponent.prototype.getDownloadUrl = function (feed) {
        this.feedsApiService.getDownloadUrl(feed, (feed.selectedVersion ? feed.selectedVersion.id : null), feed.isPublic).subscribe(function (url) {
            console.log('getDownloadUrl: ', url, feed);
            if (url) {
                window.open(url);
            }
        });
    };
    DatasetsGenericComponent.prototype.downloadFeed = function (feed) {
        this.getDownloadUrl(feed);
    };
    DatasetsGenericComponent.prototype.downloadValidation = function (feed) {
        window.open(this.getValidationUrl(feed));
    };
    DatasetsGenericComponent.prototype.getValidationUrl = function (feed) {
        return this.config.ROOT_API + '/api/manager/public/feedversion/' + feed.selectedVersion.id + '/validation';
    };
    DatasetsGenericComponent.prototype.openValidation = function (feed) {
        console.log(feed);
        this.validationUrl = this.getValidationUrl(feed);
    };
    DatasetsGenericComponent.prototype.onVersionChanged = function (feed, version) {
        feed.selectedVersion = version;
        feed.latestValidation = feed.selectedVersion.validationSummary;
        this.shared.notifyOther({
            event: 'onVersionChanged',
            value: feed
        });
        // this.feedsApiService.getFeedByVersion(version.id, feed.isPublic).then(data => {
        //   console.log(data);
        // })
    };
    DatasetsGenericComponent.prototype.fetchFeed = function (feed) {
        this.store.dispatch(this.datasetsAction.feedFetch(datasets_actions_1.toFeedReference(feed)));
    };
    DatasetsGenericComponent.prototype.setFile = function (feed, event) {
        // observer will be notified to close inline form on success
        this.confirmEditById.set('setFile' + feed.id, event.confirm$);
        // process
        this.store.dispatch(this.datasetsAction.feedSetFile(datasets_actions_1.toFeedReference(feed), event.value));
        return false;
    };
    return DatasetsGenericComponent;
}(datasets_abstract_component_1.DatasetsAbstractComponent));
DatasetsGenericComponent = __decorate([
    core_1.Component({
        template: ''
    })
], DatasetsGenericComponent);
exports.DatasetsGenericComponent = DatasetsGenericComponent;

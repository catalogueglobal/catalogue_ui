"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var datasets_actions_1 = require("app/state/datasets/datasets.actions");
var FeedCreateFormComponent = (function () {
    function FeedCreateFormComponent(sessionService, utils, store, datasetsAction, projectsService, licenseApiService, config, actions$) {
        var _this = this;
        this.sessionService = sessionService;
        this.utils = utils;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.projectsService = projectsService;
        this.licenseApiService = licenseApiService;
        this.config = config;
        this.simpleUpload = {};
        this.projectsName = [];
        this.licenses = [];
        this.RETRIEVAL_METHODS = {
            MANUAL: 'MANUALLY_UPLOADED',
            AUTO: 'FETCHED_AUTOMATICALLY',
            CREATE: 'PRODUCED_IN_HOUSE'
        };
        this.resetForm();
        // reset form on upload success
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function (action) { return _this.createSuccess(action.payload.feed); });
        actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_FAIL).subscribe(function () { return _this.resetForm(); });
        actions$.ofType(datasets_actions_1.DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(function () { return _this.resetForm(); });
        var that = this;
        that.simpleUpload.license = {};
        this.licenseApiService.getLicenses().then(function (licenses) {
            that.licenses = licenses;
        });
    }
    FeedCreateFormComponent.prototype.onChange = function (selectedLicense) {
        this.simpleUpload.license = selectedLicense;
    };
    FeedCreateFormComponent.prototype.submit = function () {
        if (this.simpleUpload.retrievalMethod === this.RETRIEVAL_METHODS.MANUAL &&
            !this.simpleUpload.file) {
            return;
        }
        var createFeed = {
            retrievalMethod: this.simpleUpload.retrievalMethod,
            projectName: this.simpleUpload.projectName,
            feedName: this.simpleUpload.feedName,
            isPublic: this.simpleUpload.isPrivate,
            file: this.simpleUpload.file,
            feedUrl: this.simpleUpload.feedUrl,
            autoFetchFeeds: this.simpleUpload.autoFetchFeeds || false,
            licenseName: this.simpleUpload.licenseName,
            licenseId: this.simpleUpload.license.id,
            metadataFile: this.simpleUpload.metadataFile,
            licenseFile: this.simpleUpload.licenseFile,
            feedDesc: this.simpleUpload.feedDesc
        };
        this.store.dispatch(this.datasetsAction.feedCreate(createFeed));
    };
    FeedCreateFormComponent.prototype.createSuccess = function (feed) {
        if (this.simpleUpload.retrievalMethod === this.RETRIEVAL_METHODS.CREATE) {
            window.location.href = this.config.EDITION_URL + '/feed/' + feed.id;
        }
        else {
            this.resetForm();
        }
    };
    FeedCreateFormComponent.prototype.toggleShowOptionsUpload = function ($event) {
        this.showOptionsUpload = !this.showOptionsUpload;
        return false;
    };
    FeedCreateFormComponent.prototype.toggleAddToProject = function ($event) {
        this.addToProject = !this.addToProject;
    };
    FeedCreateFormComponent.prototype.getAllProjectNames = function () {
        var _this = this;
        if (this.sessionService.loggedIn === true) {
            this.projectsService.getAllSecureProject().subscribe(function (response) {
                var name;
                var id;
                for (var i = 0; response && i < response.length; i++) {
                    name = response[i]['name'];
                    id = response[i]['id'];
                    _this.projectsName[i] = {
                        name: name,
                        id: id
                    };
                    _this.simpleUpload.projectId = _this.projectsName[0]['id'];
                }
            });
        }
    };
    FeedCreateFormComponent.prototype.resetForm = function () {
        this.showOptionsUpload = false;
        this.simpleUpload = {
            feedName: '',
            file: null,
            license: {},
            newLicense: false,
            metadataFile: null,
            licenseFile: null,
            isPrivate: false,
            autoFetchFeeds: false
        };
        this.onSelectionChange(this.RETRIEVAL_METHODS.MANUAL);
    };
    FeedCreateFormComponent.prototype.onSelectionChange = function (type) {
        this.simpleUpload.retrievalMethod = type;
    };
    return FeedCreateFormComponent;
}());
FeedCreateFormComponent = __decorate([
    core_1.Component({
        selector: 'app-feed-create-form',
        templateUrl: 'feed-create-form.component.html'
    })
], FeedCreateFormComponent);
exports.FeedCreateFormComponent = FeedCreateFormComponent;

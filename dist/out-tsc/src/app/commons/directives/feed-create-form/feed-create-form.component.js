var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { ProjectsApiService } from "../../services/api/projectsApi.service";
import { SessionService } from "../../services/session.service";
import { UtilsService } from "../../services/utils.service";
export var FeedCreateFormComponent = (function () {
    function FeedCreateFormComponent(sessionService, utils, store, datasetsAction, projectsService, actions$) {
        var _this = this;
        this.sessionService = sessionService;
        this.utils = utils;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.projectsService = projectsService;
        this.projectsName = [];
        this.resetForm();
        // reset form on upload success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(function () { return _this.resetForm(); });
        actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(function () { return _this.resetForm(); });
    }
    FeedCreateFormComponent.prototype.submit = function () {
        if (!this.simpleUpload.file) {
            return;
        }
        var createFeed = {
            projectName: this.simpleUpload.projectName,
            feedName: this.simpleUpload.feedName,
            isPublic: this.simpleUpload.isPrivate,
            file: this.simpleUpload.file,
            licenceFile: this.simpleUpload.licence
        };
        this.store.dispatch(this.datasetsAction.feedCreate(createFeed));
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
        if (this.sessionService.loggedIn == true) {
            this.projectsService.getAllSecureProject().subscribe(function (response) {
                var name;
                var id;
                for (var i = 0; i < response.length; i++) {
                    name = response[i]["name"];
                    id = response[i]["id"];
                    _this.projectsName[i] = {
                        name: name,
                        id: id
                    };
                    _this.simpleUpload.projectId = _this.projectsName[0]["id"];
                }
            });
        }
    };
    FeedCreateFormComponent.prototype.resetForm = function () {
        this.showOptionsUpload = false;
        this.simpleUpload = {
            feedName: "",
            file: null,
            licence: null,
            newLicence: false,
            isPrivate: false
        };
    };
    FeedCreateFormComponent = __decorate([
        Component({
            selector: 'app-feed-create-form',
            templateUrl: 'feed-create-form.component.html'
        }), 
        __metadata('design:paramtypes', [SessionService, UtilsService, Store, DatasetsActions, ProjectsApiService, Actions])
    ], FeedCreateFormComponent);
    return FeedCreateFormComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/feed-create-form/feed-create-form.component.js.map
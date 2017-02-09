var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsComponent } from "../../../modules/datasets/datasets.component";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { Configuration } from "../../configuration";
import { FeedsApiService } from "../../services/api/feedsApi.service";
import { LocalFiltersService } from "../../services/api/localFilters.service";
import { ProjectsApiService } from "../../services/api/projectsApi.service";
import { UtilsService } from "../../services/utils.service";
export var DeleteFeedConfirmationComponent = (function () {
    function DeleteFeedConfirmationComponent(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$, myDatasets) {
        var _this = this;
        this.utils = utils;
        this.projectsApiService = projectsApiService;
        this.store = store;
        this.datasetsAction = datasetsAction;
        this.config = config;
        this.feedsApi = feedsApi;
        this.localFilters = localFilters;
        this.myDatasets = myDatasets;
        this.submitForm = new EventEmitter();
        this.resetForm();
        actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(function (action) { return _this.resetForm(); });
    }
    DeleteFeedConfirmationComponent.prototype.submit = function () {
        event.preventDefault();
        this.store.dispatch(this.datasetsAction.confirmationDeleteProject(this.deleteFeed.deleteProject));
    };
    DeleteFeedConfirmationComponent.prototype.toggleDeleteProject = function () {
        this.deleteFeed.deleteProject = !this.deleteFeed.deleteProject;
    };
    DeleteFeedConfirmationComponent.prototype.resetForm = function () {
        this.deleteFeed = {
            deleteProject: false
        };
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], DeleteFeedConfirmationComponent.prototype, "submitForm", void 0);
    DeleteFeedConfirmationComponent = __decorate([
        Component({
            selector: 'app-delete-feed-confirmation',
            templateUrl: 'delete-feed-confirmation.component.html',
            providers: [DatasetsComponent]
        }), 
        __metadata('design:paramtypes', [UtilsService, ProjectsApiService, Store, DatasetsActions, Configuration, FeedsApiService, LocalFiltersService, Actions, DatasetsComponent])
    ], DeleteFeedConfirmationComponent);
    return DeleteFeedConfirmationComponent;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/directives/delete-feed-confirmation/delete-feed-confirmation.component.js.map
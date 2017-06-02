import { Component } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "app/state/datasets/datasets.actions";
import { ICreateFeed } from "app/state/datasets/datasets.effects";
import { DatasetsState } from "app/state/datasets/datasets.reducer";
import { ProjectsApiService } from "app/commons/services/api/projectsApi.service";
import { FeedsApiService } from "app/commons/services/api/feedsApi.service";
import { SessionService } from "app/commons/services/session.service";
import { UtilsService } from "app/commons/services/utils.service";
import { Configuration } from "app/commons/configuration";

@Component({
    selector: 'app-feed-create-form',
    templateUrl: 'feed-create-form.component.html'
})
export class FeedCreateFormComponent {
    public simpleUpload: any = {};
    public showOptionsUpload: boolean;
    public addToProject: boolean;
    public projectsName = [];
    public licenses = [];
    private newFeed: any = {};
    private submitIsEnabled;

    constructor(
        private sessionService: SessionService,
        private utils: UtilsService,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        private projectsService: ProjectsApiService,
        private feedsService: FeedsApiService,
        private config: Configuration,
        actions$: Actions) {
        this.resetForm();
        // reset form on upload success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(
            action => this.createSuccess(action.payload.feed)
        );
        actions$.ofType(DatasetsActionType.FEED_CREATE_FAIL).subscribe(() => this.resetForm());
        actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(() => this.resetForm());
        let that = this;
        that.simpleUpload.license = {};
        this.feedsService.getLicenses().then(licenses => {
            that.licenses = licenses;
        });
    }

    onChange(selectedLicense) {
        this.simpleUpload.license = selectedLicense;
    }

    private submit(): void {
        if (!this.simpleUpload.file && this.newFeed.type === 'zip') {
            return;
        }
        let createFeed: ICreateFeed = {
            projectName: this.simpleUpload.projectName,
            feedName: this.simpleUpload.feedName,
            isPublic: this.simpleUpload.isPrivate,
            file: this.simpleUpload.file,
            feedUrl: this.newFeed.type === 'url' ? this.simpleUpload.feedUrl : null,
            licenseName: this.simpleUpload.licenseName,
            licenseId: this.simpleUpload.license.id,
            metadataFile: this.simpleUpload.metadataFile,
            licenseFile: this.simpleUpload.licenseFile,
            feedDesc: this.simpleUpload.feedDesc
        }
        this.store.dispatch(this.datasetsAction.feedCreate(createFeed));
    }

    private createSuccess(feed) {
        this.resetForm();
        if (this.newFeed.type === 'create') {
            window.location.href = this.config.EDITION_URL + '/feed/' + feed.id;
        }
    }

    private toggleShowOptionsUpload($event) {
        this.showOptionsUpload = !this.showOptionsUpload;
        return false;
    }

    private toggleAddToProject($event) {
        this.addToProject = !this.addToProject;
    }

    public getAllProjectNames() {
        if (this.sessionService.loggedIn == true) {
            this.projectsService.getAllSecureProject().subscribe(response => {
                let name;
                let id;
                for (var i = 0; response && i < response.length; i++) {
                    name = response[i]["name"];
                    id = response[i]["id"];
                    this.projectsName[i] = {
                        name: name,
                        id: id
                    }
                    this.simpleUpload.projectId = this.projectsName[0]["id"];
                }
            });
        }
    }

    private resetForm() {
        this.showOptionsUpload = false;
        this.simpleUpload = {
            feedName: "",
            file: null,
            license: null,
            newLicense: false,
            metadataFile: null,
            licenseFile: null,
            isPrivate: false
        };
        this.onSelectionChange('zip');
    }

    private onSelectionChange(type) {
        this.newFeed.type = type;
    }
}

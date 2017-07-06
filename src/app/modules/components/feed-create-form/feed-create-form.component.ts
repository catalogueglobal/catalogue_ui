import { Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatasetsActions, DatasetsActionType } from 'app/state/datasets/datasets.actions';
import { ICreateFeed } from 'app/state/datasets/datasets.effects';
import { DatasetsState } from 'app/state/datasets/datasets.reducer';
import { ProjectsApiService,
    FeedsApiService,
    SessionService,
    UtilsService,
    Configuration
} from 'app/modules/common/';

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

    public RETRIEVAL_METHODS = {
        MANUAL: 'MANUALLY_UPLOADED',
        AUTO: 'FETCHED_AUTOMATICALLY',
        CREATE: 'PRODUCED_IN_HOUSE'
    };

    private submitIsEnabled;

    constructor(
        public sessionService: SessionService,
        public utils: UtilsService,
        public store: Store<DatasetsState>,
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

    public submit(): void {
        if (this.simpleUpload.retrievalMethod === this.RETRIEVAL_METHODS.MANUAL &&
            !this.simpleUpload.file) {
            return;
        }
        let createFeed: ICreateFeed = {
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
    }

    private createSuccess(feed) {
        if (this.simpleUpload.retrievalMethod === this.RETRIEVAL_METHODS.CREATE) {
            window.location.href = this.config.EDITION_URL + '/feed/' + feed.id;
        } else {
            this.resetForm();

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
        if (this.sessionService.loggedIn === true) {
            this.projectsService.getAllSecureProject().subscribe(response => {
                let name;
                let id;
                for (let i = 0; response && i < response.length; i++) {
                    name = response[i]['name'];
                    id = response[i]['id'];
                    this.projectsName[i] = {
                        name: name,
                        id: id
                    };
                    this.simpleUpload.projectId = this.projectsName[0]['id'];
                }
            });
        }
    }

    private resetForm() {
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
    }

    public onSelectionChange(type) {
        this.simpleUpload.retrievalMethod = type;
    }
}

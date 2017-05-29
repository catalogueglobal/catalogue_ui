import { Component, ViewChild, Input }                           from "@angular/core";
import { Router, ActivatedRoute }              from '@angular/router';
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { FeedsApiService, FEED_RETRIEVAL_METHOD, IFeed }                     from 'app/commons/services/api/feedsApi.service';
import { SessionService }                      from "app/commons/services/session.service";
import { DatasetsActions, DatasetsActionType } from "app/state/datasets/datasets.actions";
import { DatasetsState }                       from "app/state/datasets/datasets.reducer";
import { Configuration } from "app/commons/configuration";
import { UtilsService } from "app/commons/services/utils.service";
import { UsersApiService } from "app/commons/services/api/usersApi.service";
import { SharedService } from "app/commons/services/shared.service";
import { DatatoolComponent } from "app/commons/components/datatool.component";
import { LicenseModal } from 'app/commons/directives/modal/license-modal.component';
import { MiscDataModal } from 'app/commons/directives/modal/miscdata-modal.component';
import {ConfirmFeedVersionModal} from 'app/commons/directives/modal/confirm-feed-version-modal.component';

@Component({
    selector: 'app-feeds',
    templateUrl: 'feeds.component.html',
})
export class FeedsComponent extends DatatoolComponent {
    public note: string;
    public feedId: string;
    public notesFeed: Array<any>;
    public feed: any = {};
    private isAuthorised: boolean = false;
    private file;
    private selectedFileTarget;
    @ViewChild(LicenseModal)
    public readonly licenseModal: LicenseModal;
    @ViewChild(MiscDataModal)
    public readonly miscDataModal: MiscDataModal;
    @ViewChild(ConfirmFeedVersionModal)
    public readonly confirmFeedVersionModal: ConfirmFeedVersionModal;

    @Input() private mapPosition;
    private _feeds: any;
    private clickAddNoteToFeed = false;
    private onSubmitConfirmFeedVersionCallback: Function;

    constructor(
        private route: ActivatedRoute,
        private router: Router,

        protected config: Configuration,
        protected utils: UtilsService,
        protected sessionService: SessionService,
        protected feedsApiService: FeedsApiService,
        protected usersApiService: UsersApiService,
        protected store: Store<DatasetsState>,
        protected actions$: Actions,
        protected datasetsAction: DatasetsActions,
        protected shared: SharedService) {
        super(config, utils, sessionService, feedsApiService, usersApiService, store,
            actions$, datasetsAction, shared);
        // Get the id of the feed
        this.route.params.subscribe(params => { this.feedId = params["id"]; });
        // Get the info from the feed id
        this.notesFeed = [];
        this.getFeed();
    }

    public ngOnInit() {
        this.onSelectionChangeCallback = this.onSelectionChange.bind(this);
        this.onItemChangedCallback = this.onItemChanged.bind(this);
        this.onSubmitLicenseCallback = this.onSubmitLicense.bind(this);
        this.onSubmitMiscDataCallback = this.onSubmitMiscData.bind(this);
        this.onSubmitConfirmFeedVersionCallback = this.onSubmitConfirmFeedVersion.bind(this);
    }

    set feeds(value: any) {

        if (!value) {
            this._feeds = null
            return
        }
        this._feeds = value
    }

    // overriden by childs
    get feeds() {
        return this._feeds;
    }


    private getFeed() {
        let that = this;
        this.resetForm(null);
        this.feedsApiService.getPublic(this.feedId).then(function(data) {
            that.feed = data;
            that.feeds = [that.feed];
            that.getLicenses(that.feeds);
            that.mapPosition =  that.feed.latestValidation ? that.utils.computeLatLng(that.feed.latestValidation.bounds) :
                that.mapPosition;
            if (that.sessionService.loggedIn === true) {
                that.checkAuthorisations();
                that.subscribeActions(that.actions$);
            }
            console.log(that.feed)
            if (that.sessionService.loggedIn === true) {
                that.feedsApiService.getNotes(that.feedId).then(function(data) {
                    that.notesFeed = data.reverse();
                    console.log(that.notesFeed);
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
    }

    private checkAuthorisations() {
        this.isAuthorised = this.utils.userHasRightsOnFeed(this.sessionService.userProfile, this.feed.projectId, this.feed.id);
    }

    protected subscribeActions(actions$) {
        actions$.ofType(DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS).subscribe(action => this.resetForm([this.feed]));

        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.SUBSCRIBE_FEED_SUCCESS).subscribe(
            () => {
                console.log('USER_SUBSCRIBE setting profile');
                this.sessionService.setProfile();
            }
        );

        actions$.ofType(DatasetsActionType.FEED_SET_NAME_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed;
                this.feed.name = action.payload.feed.name;
                this.processConfirm('setName' + updatedFeed.id);
            }
        )

        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.FEED_SET_PUBLIC_SUCCESS).subscribe(
            action => {
                this.feed.isPublic = action.payload.feed.isPublic;
            }
        );
        actions$.ofType(DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS).subscribe(
            () => {
                console.log('UNSUBSCRIBE_FEED setting profile');
                this.sessionService.setProfile();
            }
        );

        actions$.ofType(DatasetsActionType.FEED_CREATE_LICENSE_FAIL).subscribe(
            action => {
                this.createLicenseFail(action.payload.feed, action.payload.error)
            }
        );

        actions$.ofType(DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm([this.feed]);
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm([this.feed]);
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm([this.feed]);
            }
        );

        actions$.ofType(DatasetsActionType.FEED_CREATE_MISCDATA_FAIL).subscribe(
            action => {
                this.createLicenseFail(action.payload.feed, action.payload.error)
            }
        );

        actions$.ofType(DatasetsActionType.FEED_CREATE_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm([this.feed]);
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm([this.feed]);
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm([this.feed]);
            }
        );

        // close inline edit form on setFile() success
        actions$.ofType(DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed;
                this.processConfirm('setFile' + updatedFeed.id);
                this.selectedFileTarget.value = null;
                this.file = null;
            }
        )
    }


    containsOnlySpace() {
        if (!this.note) {
            return true;
        }
        return this.utils.trim(this.note).length === 0;
    }

    addNotesToFeed() {
        // add note to feed if not empty
        if (this.note != null && this.sessionService.userProfile) {
            let data = { body: this.note, date: Date.now(), userEmail: this.sessionService.userProfile.email }
            this.store.dispatch(this.datasetsAction.feedAddNotes(this.feedId, data));
            this.notesFeed.unshift(data);
        }
    }

    private clickDisplayAddNoteToFeed() {
        if (!this.sessionService.loggedIn) {
            this.sessionService.login();
        } else {
            this.clickAddNoteToFeed = true;
        }
    }

    protected displayLicense(feed: IFeed) {
        super.displayLicense(feed);
        this.licenseModal.show();
    }

    protected displayMiscData(feed: IFeed) {
        super.displayMiscData(feed);
        this.miscDataModal.show();
    }

    protected setLicense(): boolean {
        let res = !super.setLicense();
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    }

    protected unsetLicense(): boolean {
        let res = super.unsetLicense();
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    }

    protected setMiscData(): boolean {
        let res = super.setMiscData();
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    }

    protected unsetMiscData(): boolean {
        let res = super.unsetMiscData();
        if (!res) {
            this.miscDataModal.hide();
        }
        return res;
    }

    protected resetForm(values: any) {
        super.resetForm(values);
        this.note = "";
    }

    protected onSubmitConfirmFeedVersion(validate) {
        if (validate) {
            this.setFile(this.feed, {
                value: this.selectedFileTarget.files[0]
            });
        } else {
            this.selectedFileTarget.value = null;
        }
    }

    protected fileChanged(event) {
        try {
            let file = event.target.files[0];
            this.selectedFileTarget = event.target;
            this.confirmFeedVersionModal.show();
        }
        catch (e) {
            console.log(e);
        }
    }

}

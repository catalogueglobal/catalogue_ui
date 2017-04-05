import { Component, Output, EventEmitter, Input, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PaginationService } from "ng2-pagination";
import { Configuration } from "../../commons/configuration";
import { InlineEditEvent } from "../../commons/directives/inline-edit-text/inline-edit-generic.component";
import { IFeed, FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { UsersApiService } from "../../commons/services/api/usersApi.service";
import { SessionService } from "../../commons/services/session.service";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActions, toFeedReference, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { DatasetsState } from "../../state/datasets/datasets.reducer";
import { DatasetsTableComponent } from "../datasets-table/datasets-table.component";
import { IFeedRow } from "../datasets/datasets.component";
import { SharedService } from "../../commons/services/shared.service";
import { LicenseModal } from '../../commons/directives/modal/license-modal.component';
import { MiscDataModal } from '../../commons/directives/modal/miscdata-modal.component';


const CONFIRM_EDIT_IDX_SETFILE = "setFile"

@Component({
    selector: 'app-my-datasets-table',
    templateUrl: 'my-datasets-table.component.html',
    providers: [PaginationService]
})
export class MyDatasetsTableComponent extends DatasetsTableComponent {
    @Output() protected sortChange = new EventEmitter();
    @Input() protected _feeds: IFeedRow[];
    @ViewChild(LicenseModal)
    public readonly licenseModal: LicenseModal;

    @ViewChild(MiscDataModal)
    public readonly miscDataModal: MiscDataModal;

    constructor(
        protected config: Configuration,
        protected utils: UtilsService,
        protected feedsApi: FeedsApiService,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        protected actions$: Actions,
        protected usersApiService: UsersApiService,
        protected sessionService: SessionService,
        protected shared: SharedService) {
        super(config, utils, sessionService, feedsApi, usersApiService, store, actions$, datasetsAction, shared);

        this.resetForm(this._feeds);
        this.subscribeActions(actions$);
    }

    public ngOnInit() {
        this.onSelectionChangeCallback = this.onSelectionChange.bind(this);
        this.onItemChangedCallback = this.onItemChanged.bind(this);
        this.onSubmitLicenseCallback = this.onSubmitLicense.bind(this);
        this.onSubmitMiscDataCallback = this.onSubmitMiscData.bind(this);
    }

    protected subscribeActions(actions$) {
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.FEED_SET_NAME_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed;
                this.processConfirm('setName' + updatedFeed.id);
            }
        )
        // close inline edit form on setFile() success
        actions$.ofType(DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed;
                this.processConfirm(CONFIRM_EDIT_IDX_SETFILE + updatedFeed.id);
            }
        )
        actions$.ofType(DatasetsActionType.FEED_CREATE_LICENSE_FAIL).subscribe(
            action => {
                this.createLicenseFail(action.payload.feed, action.payload.error)
            }
        );

        actions$.ofType(DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm(this._feeds);
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm(this._feeds);
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm(this._feeds);
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
                this.resetForm(this._feeds);
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm(this._feeds);
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm(this._feeds);
            }
        );
    }

    protected displayLicense(feed: IFeed) {
        super.displayLicense(feed);
        this.licenseModal.show();
    }

    protected displayMiscData(feed: IFeed) {
        super.displayMiscData(feed);
        this.miscDataModal.show();
    }

    protected setLicense():boolean {
        let res = !super.setLicense();
        if (!res) {
          this.licenseModal.hide();
        }
        return res;
    }

    protected unsetLicense():boolean {
        let res = super.unsetLicense();
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    }

    protected setMiscData(): boolean{
        let res = super.setMiscData();
        if (!res) {
            this.licenseModal.hide();
        }
        return res;
    }

    protected unsetMiscData():boolean {
      let res = super.unsetMiscData();
        if (!res) {
            this.miscDataModal.hide();
        }
        return res;
    }

    setSort(sort) {
        this.sortChange.emit(sort);
    }

    setFile(feed, event: InlineEditEvent<File>) {
        // observer will be notified to close inline form on success
        this.confirmEditById.set(CONFIRM_EDIT_IDX_SETFILE + feed.id, event.confirm$)
        // process
        this.store.dispatch(this.datasetsAction.feedSetFile(toFeedReference(feed), event.value));
        return false;
    }

    fetchFeed(feed) {
        this.store.dispatch(this.datasetsAction.feedFetch(toFeedReference(feed)));
    }
}

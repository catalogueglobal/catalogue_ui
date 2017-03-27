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


const CONFIRM_EDIT_IDX_SETNAME = "setName"
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
    public testLicenses: any;
    private confirmEditById: Map<string, EventEmitter<any>> = new Map();
    public newLicenseOrMiscData;
    public onSelectionChangeCallback: Function;
    public onItemChangedCallback: Function;
    public onSubmitLicenseCallback: Function;
    public onSubmitMiscDataCallback: Function;
    constructor(
        config: Configuration,
        utils: UtilsService,
        private feedsApi: FeedsApiService,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        protected actions$: Actions,
        usersApiService: UsersApiService,
        sessionService: SessionService,
        protected shared: SharedService) {
        super(config, utils, sessionService, feedsApi, usersApiService, store, actions$, datasetsAction, shared);

        this.resetForm();
        this.subscribeActions(actions$);
    }

    public ngOnInit() {
        this.onSelectionChangeCallback = this.onSelectionChange.bind(this);
        this.onItemChangedCallback = this.onItemChanged.bind(this);
        this.onSubmitLicenseCallback = this.onSubmitLicense.bind(this);
        this.onSubmitMiscDataCallback = this.onSubmitMiscData.bind(this);
    }

    private processConfirm(idx: string) {
        let confirmEdit = this.confirmEditById.get(idx)
        if (confirmEdit) {
            confirmEdit.emit(true);
            this.confirmEditById.delete(idx)
        }
    }

    private resetForm() {
        if (this.currentFeed) {
            this.currentFeed = null;
            this.getLicenses(this._feeds);
        }

        this.newLicenseOrMiscData = {
            type: 'new',
            name: '',
            item: null,
            error: null,
            itemFile: {}
        };
    }

    private createLicenseFail(feed, error) {
        this.newLicenseOrMiscData.error = error.message;
    }

    protected subscribeActions(actions$) {
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.FEED_SET_NAME_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed
                this.processConfirm(CONFIRM_EDIT_IDX_SETNAME + updatedFeed.id)
            }
        )
        // close inline edit form on setFile() success
        actions$.ofType(DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(
            action => {
                let updatedFeed = action.payload.feed
                this.processConfirm(CONFIRM_EDIT_IDX_SETFILE + updatedFeed.id)
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
                this.resetForm();
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm();
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(
            action => {
                this.licenseModal.hide();
                this.resetForm();
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
                this.resetForm();
            }
        );

        actions$.ofType(DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm();
            }
        );
        actions$.ofType(DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS).subscribe(
            action => {
                this.miscDataModal.hide();
                this.resetForm();
            }
        );
    }

    displayLicense(feed: IFeed) {
        this.currentFeed = feed;
        console.log('feed', feed);
        for (let i = 0; i < this.licenses.length; i++) {
            if (this.feedsLicenses[this.currentFeed.id] && this.licenses[i].id === this.feedsLicenses[this.currentFeed.id].id) {
                this.newLicenseOrMiscData.item = this.licenses[i];
            }
            if (!this.newLicenseOrMiscData.item && this.licenses[i].id === 'a0e867a2-a2c9-4180-9249-4fe7e97e6c61') {
                this.newLicenseOrMiscData.item = this.licenses[i];
            }
        }
        if (!this.newLicenseOrMiscData.item){
            this.newLicenseOrMiscData.item = this.licenses.length > 0 ? this.licenses[0] : null;
        }
        this.licenseModal.show();
    }

    displayMiscData(feed: IFeed) {
        this.currentFeed = feed;
        this.newLicenseOrMiscData.item = this.miscDatas.length > 0 ? this.miscDatas[0] : null;
        if (this.feedsLicenses[this.currentFeed.id]) {
            for (let i = 0; i < this.miscDatas.length; i++) {
                if (this.miscDatas[i].id === this.feedsLicenses[this.currentFeed.id].id) {
                    this.newLicenseOrMiscData.item = this.miscDatas[i];
                }
            }
        }
        this.miscDataModal.show();
    }

    onItemChanged(item) {
        console.log('selectedItem', item);
        this.newLicenseOrMiscData.item = item;
    }

    setLicense() {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetLicense(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
        } else {
            this.licenseModal.hide();
        }
    }

    unsetLicense() {
        if (this.feedsLicenses[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetLicense(toFeedReference(this.currentFeed), this.feedsLicenses[this.currentFeed.id].id));
        } else {
            this.licenseModal.hide();
        }
    }

    createLicense() {
        this.store.dispatch(this.datasetsAction.feedCreateLicense(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    }

    setMiscData() {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetMiscData(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
        } else {
            this.licenseModal.hide();
        }
    }

    unsetMiscData() {
        if (this.feedsMiscDatas[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetMiscData(toFeedReference(this.currentFeed), this.feedsMiscDatas[this.currentFeed.id].id));
        } else {
            this.miscDataModal.hide();
        }
    }

    createMiscData() {
        this.store.dispatch(this.datasetsAction.feedCreateMiscData(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    }

    setSort(sort) {
        this.sortChange.emit(sort);
    }

    togglePublic(feed: IFeed) {
        let value = !feed.isPublic;
        this.store.dispatch(this.datasetsAction.feedSetPublic(toFeedReference(feed), value));
        return false;
    }

    setName(feed, event: InlineEditEvent<string>) {
        // observer will be notified to close inline form on success
        this.confirmEditById.set(CONFIRM_EDIT_IDX_SETNAME + feed.id, event.confirm$)
        // process
        this.store.dispatch(this.datasetsAction.feedSetName(toFeedReference(feed), event.value));
        return false;
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

    onSelectionChange(type) {
        console.log('onSelectionChange', type);
        this.newLicenseOrMiscData.type = type;
    }

    onSubmitLicense() {
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
    }

    onSubmitMiscData() {
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

    }
}

import { Component, Output, EventEmitter, Input } from "@angular/core";
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
  private confirmEditById: Map<string, EventEmitter<any>> = new Map();
  public newLicense;
  
  constructor(
    config: Configuration,
    utils: UtilsService,
    private feedsApi: FeedsApiService,
    protected store: Store<DatasetsState>,
    protected datasetsAction: DatasetsActions,
    protected actions$: Actions,
    usersApiService: UsersApiService,
    sessionService: SessionService) {
    super(config, utils, sessionService, feedsApi, usersApiService, store, actions$, datasetsAction);

    this.resetForm(null);
    this.subscribeActions(actions$);

  }

  private processConfirm(idx: string) {
    let confirmEdit = this.confirmEditById.get(idx)
    if (confirmEdit) {
      confirmEdit.emit(true);
      this.confirmEditById.delete(idx)
    }
  }

  private resetForm(license: any) {
    if (this.currentFeed) {
      this.currentFeed = null;
      this.getLicenses(this._feeds);
    }
    
    this.newLicense = {
      type: 'new',
      name: '',
      lincense: null,
      error: null,
      licenseFile: {}
    };
  }

  private createLicenseFail(feed, error) {
    this.newLicense.error = error.message;
  }

  subscribeActions(actions$) {
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
        this.modal.hide();
        this.resetForm(action.payload.license);
      }
    );

    actions$.ofType(DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS).subscribe(
      action => {
        this.modal.hide();
        this.resetForm(action.payload.license);
      }
    );
    actions$.ofType(DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS).subscribe(
      action => {
        this.modal.hide();
        this.resetForm(action.payload.license);
      }
    );
  }

  displayLicense(feed: IFeed) {
    this.currentFeed = feed;
    this.newLicense.license = this.licenses.length > 0 ? this.licenses[0] : null;
    if (this.feedsLicenses[this.currentFeed.id]) {
      for (let i = 0; i < this.licenses.length; i++) {
        if (this.licenses[i].id === this.feedsLicenses[this.currentFeed.id].id) {
          this.newLicense.license = this.licenses[i];
        }
      }
    }
    this.modal.show();
  }

  onLicenseChanged(selectedLicense) {
    this.newLicense.license = selectedLicense;
  }

  setLicense() {
    if (this.newLicense.license.id) {
      this.store.dispatch(this.datasetsAction.feedSetLicense(toFeedReference(this.currentFeed), this.newLicense.license.id));
    } else {
      this.modal.hide();
    }
  }

  unsetLicense() {
    if (this.feedsLicenses[this.currentFeed.id]) {
      this.store.dispatch(this.datasetsAction.feedUnsetLicense(toFeedReference(this.currentFeed), this.feedsLicenses[this.currentFeed.id].id));
    } else {
      this.modal.hide();
    }
  }

  createLicense() {
    this.store.dispatch(this.datasetsAction.feedCreateLicense(toFeedReference(this.currentFeed), this.newLicense.name, this.newLicense.licenseFile.file));
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
    this.newLicense.type = type;
  }

  onSubmitLicense() {
    switch (this.newLicense.type) {
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
}

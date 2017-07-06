import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PaginationService } from "ng2-pagination";
import { ValidationDetailsModal } from "../modal/validation-details-modal.component";

import { Configuration,
    ProjectsApiService,
    IFeed,
    IProject,
    IFeedRow,
    MapUtilsService,
    SessionService,
    SharedService,
    FeedsApiService,
    UtilsService,
    UsersApiService,
    FEED_RETRIEVAL_METHOD,
    ILicense,
    SortOrder
} from "app/modules/common/";

import { DatasetsActions, DatasetsActionType } from "app/state/datasets/datasets.actions";
import { DatasetsState } from "app/state/datasets/datasets.reducer";
import { DatasetsGenericComponent } from "../datasets-generic/datasets-generic.component";

@Component({
    selector: 'app-datasets-table',
    templateUrl: 'datasets-table.component.html',
    providers: [PaginationService]
})
export class DatasetsTableComponent extends DatasetsGenericComponent{
    @Input() protected _feeds: IFeedRow[];
    @Output() protected sortChange = new EventEmitter();
    @ViewChild(ValidationDetailsModal)
    public readonly validationDetailsModal: ValidationDetailsModal;

    private page: number;

    protected currentSort: SortOrder = {
        sort: 'name',
        order: 'asc'
    };

    constructor(
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
        this.subscribeActions(actions$);
    }

    // overriden by childs
    @Input() set feeds(value: any) {

        this.getLicenses(value);
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

    protected setSort(sort) {
        this.sortChange.emit(sort);
    }

    protected regionStateCountry(feed) {
        return this.utils.regionStateCountry(feed);
    }

    protected subscribeActions(actions$) {
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(
            () => {
                console.log('USER_SUBSCRIBE setting profile');
                this.sessionService.setProfile();
            }
        );
        actions$.ofType(DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS).subscribe(
            () => {
                console.log('UNSUBSCRIBE_FEED setting profile');
                this.sessionService.setProfile();
            }
        );
    }

    protected openValidation(feed){
      super.openValidation(feed);
      if (feed && feed.selectedVersion && feed.selectedVersion.id){
        this.validationDetailsModal.show();
      }
    }

    public resetPage() {
        this.page = 1;
    }
}

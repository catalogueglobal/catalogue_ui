import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PaginationService } from "ng2-pagination";
import { Configuration } from "app/commons/configuration";
import { SortOrder } from "app/commons/directives/sort-link/sort-link.component";
import { FeedsApiService, FEED_RETRIEVAL_METHOD, ILicense, IFeed } from "app/commons/services/api/feedsApi.service";
import { UsersApiService } from "app/commons/services/api/usersApi.service";
import { SessionService } from "app/commons/services/session.service";
import { UtilsService } from "app/commons/services/utils.service";
import { DatasetsActions, DatasetsActionType } from "app/state/datasets/datasets.actions";
import { DatasetsState } from "app/state/datasets/datasets.reducer";
import { IFeedRow } from "app/modules/datasets/datasets.component";
import { SharedService } from "app/commons/services/shared.service";
import { DatatoolComponent } from "app/commons/components/datatool.component";

@Component({
    selector: 'app-datasets-table',
    templateUrl: 'datasets-table.component.html',
    providers: [PaginationService]
})
export class DatasetsTableComponent extends DatatoolComponent{
    @Input() protected _feeds: IFeedRow[];
    @Output() protected sortChange = new EventEmitter();

    private FEED_RETRIEVAL_METHOD = FEED_RETRIEVAL_METHOD; // used by the template
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

    protected getFeedsVersion(values: any) {
        for (var i = 0; values && i < values.length; i++) {
            this.getFeedVersion(values[i]);
        }
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

    public resetPage() {
        this.page = 1;
    }
}

import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Actions }                             from '@ngrx/effects';
import { Store }                               from '@ngrx/store';
import { Observable }                          from 'rxjs/Rx';
import { Configuration,
    ProjectsApiService,
    IFeed,
    IFeedRow,
    IBounds,
    FeedsApiService,
    UtilsService,
    LocalFiltersService,
    SortOrder,
    AutocompleteItem
} from 'app/modules/common/';

import { DatasetsState }                       from 'app/state/datasets/datasets.reducer';
import { DatasetsActions, DatasetsActionType } from 'app/state/datasets/datasets.actions';
import {
    DatasetsMapComponent,
    DatasetsTableComponent
} from 'app/modules/components';
import LatLngExpression = L.LatLngExpression;

const INITIAL_SORT = {
    sort: 'name',
    order: 'asc'
};

@Component({
    selector: 'app-explore-page',
    templateUrl: 'explore.page.html',
    providers: [ProjectsApiService]
})

export class ExplorePage implements AfterViewInit {
    public feeds$: Observable<IFeed[]>;
    public feeds: IFeedRow[] = [];
    public mapPosition: LatLngExpression;
    public mapZoom: number;
    private currentSort: SortOrder;
    private currentBounds: IBounds;
    // properties below are overriden by children
    @ViewChild(DatasetsMapComponent) public mapComponent: DatasetsMapComponent;
    @ViewChild(DatasetsTableComponent) public tableComponent: DatasetsTableComponent;
    protected isSecure: boolean;

    constructor(
        protected utils: UtilsService,
        protected projectsApiService: ProjectsApiService,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        protected config: Configuration,
        protected feedsApi: FeedsApiService,
        protected localFilters: LocalFiltersService,
        private actions$: Actions) {
        // request feeds
        this.currentSort = INITIAL_SORT;
        this.currentBounds = null;
        this.initDatasets(false); // show public feeds
        // refresh feeds on upload success
        this.createStore();
    }

    protected createStore() {
        this.feeds$ = this.store.select('datasets').map(<DatasetsState>(datasets) => datasets.feeds);
        this.subscribeActions();
    }

    protected subscribeActions() {
        this.actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(
            () => this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams())));
        this.actions$.ofType(DatasetsActionType.FEED_SET_FILE_SUCCESS).subscribe(
            () => this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams())));
        this.actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(action => {
            if (action.payload.feedRefs && action.payload.feedRefs[0].feedVersionCount > 1) {
                this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams()));
            }
        });
        this.feeds$.subscribe(
            feeds => {
                if (feeds) {
                    console.log('FEEDS:', feeds.length);
                    this.feeds = feeds.map(feed => <IFeedRow> feed);
                } else {
                    this.feeds = [];
                }
            }
        );
    }

    protected initDatasets(isSecure: boolean) {
        this.isSecure = isSecure;
    }

    ngAfterViewInit() {
        this.fetchFeeds();
    }

    private getFeedsParams() {
        return {
            sortOrder: this.currentSort,
            bounds: this.currentBounds,
            secure: this.isSecure
        };
    }

    public onAutocompleteSelected(selected: AutocompleteItem) {
        console.log('onAutocompleteSelected', selected);
        this.mapPosition = selected.position;
        this.mapZoom = this.config.MAP_ZOOM_BY_AUTOCOMPLETE_TYPE(selected.type);
    }

    public onSortChange(value: SortOrder) {
        this.currentSort = value;
        this.tableComponent.resetPage();
        // uncomment this when sort is ready on server-side API
        //this.fetchFeeds();
        // for now, sort is executed locally - comment this when sort is ready on server-side API
        let sortedFeeds = this.localFilters.sortFeeds(this.feeds, value);
        this.store.dispatch(this.datasetsAction.feedsGetLocally(this.getFeedsParams(), sortedFeeds));
    }

    public onBoundsChange(value: IBounds) {
        this.tableComponent.resetPage();
        this.currentBounds = value;
        this.fetchFeeds();
    }

    public fetchFeeds() {
        this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams()));
    }

    public resetSearch() {
        this.currentSort = INITIAL_SORT;
        this.mapComponent.reset();
        this.tableComponent.resetPage();
        this.onBoundsChange(null); // show feeds with no bounds
    }
}

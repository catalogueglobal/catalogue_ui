import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { Observable }                          from "rxjs/Rx";
import { Configuration }                       from "../../commons/configuration";
import { SortOrder }                           from "../../commons/directives/sort-link/sort-link.component";
import { IFeed, IBounds, FeedsApiService }     from "../../commons/services/api/feedsApi.service";
import { LocalFiltersService }                 from "../../commons/services/api/localFilters.service";
import { ProjectsApiService }                  from "../../commons/services/api/projectsApi.service";
import { UtilsService }                        from "../../commons/services/utils.service";
import { DatasetsState }                       from "../../state/datasets/datasets.reducer";
import { DatasetsActions, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { DatasetsMapComponent }                from "../datasets-map/datasets-map.component";
import { AutocompleteItem }                    from "../datasets-autocomplete/datasets-autocomplete.component";
import { DatasetsTableComponent }              from "../datasets-table/datasets-table.component";
import LatLngExpression = L.LatLngExpression;

export type IFeedRow = IFeed & {
    checked
}

const INITIAL_SORT = {
    sort: 'name',
    order: 'asc'
};

@Component({
    selector:    'app-datasets',
    templateUrl: 'datasets.component.html',
    providers:   [ProjectsApiService]
})

export class DatasetsComponent implements AfterViewInit {
    protected feeds$: Observable<IFeed[]>;
    protected feeds: IFeedRow[] = [];
    private mapPosition: LatLngExpression;
    private mapZoom: number;
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
        actions$: Actions)
    {
        this.feeds$ = store.select('datasets').map(<DatasetsState>(datasets) => datasets.feeds);
        this.feeds$.subscribe(
            feeds => {
                if (feeds) {
                    console.log('FEEDS:', feeds.length);
                    this.feeds = feeds.map(feed => <IFeedRow>feed);
                }
            }
        );
        // request feeds
        this.currentSort = INITIAL_SORT;
        this.currentBounds = null;
        this.initDatasets(false); // show public feeds
        // refresh feeds on upload success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(() => this.store.dispatch(datasetsAction.feedsGet(this.getFeedsParams())));
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
        }
    }

    protected getCheckedFeeds(): any[] {
        return this.tableComponent.getCheckedFeeds();
    }

    protected downloadFeeds(event: Event) {
        let checkedFeeds = this.getCheckedFeeds();
        checkedFeeds.forEach(
            feed => {
                this.feedsApi.getDownloadUrl(feed, feed.selectedVersion ? feed.selectedVersion.id : null).subscribe(
                    url => {
                      console.log('getDownloadUrl: ', url, feed);
                        if (url) {
                            console.log('getDownloadUrl: ', url);
                            //window.location.assign(url);
                            window.open(url);
                        }
                    }
                )
            }
        );
        event.preventDefault();
    }

    protected onAutocompleteSelected(selected: AutocompleteItem) {
        console.log('onAutocompleteSelected', selected);
        this.mapPosition = selected.position;
        this.mapZoom = this.config.MAP_ZOOM_BY_AUTOCOMPLETE_TYPE(selected.type);
    }

    protected onSortChange(value: SortOrder) {
        this.currentSort = value;
        this.tableComponent.resetPage();
        // uncomment this when sort is ready on server-side API
        //this.fetchFeeds();
        // for now, sort is executed locally - comment this when sort is ready on server-side API
        let sortedFeeds = this.localFilters.sortFeeds(this.feeds, value)
        this.store.dispatch(this.datasetsAction.feedsGetLocally(this.getFeedsParams(), sortedFeeds));
    }

    protected onBoundsChange(value: IBounds) {
        this.tableComponent.resetPage();
        this.currentBounds = value;
        this.fetchFeeds();
    }

    private fetchFeeds() {
        this.store.dispatch(this.datasetsAction.feedsGet(this.getFeedsParams()));
    }

    private resetSearch() {
        this.currentSort = INITIAL_SORT;
        this.mapComponent.reset();
        this.tableComponent.resetPage();
        this.onBoundsChange(null); // show feeds with no bounds
    }
}

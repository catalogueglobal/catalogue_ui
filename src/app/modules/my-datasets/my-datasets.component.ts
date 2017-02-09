import { Component, ViewChild } from "@angular/core";
import { DatasetsComponent } from "../datasets/datasets.component";
import { ProjectsApiService } from "../../commons/services/api/projectsApi.service";
import { Store } from "@ngrx/store";
import { DatasetsState } from "../../state/datasets/datasets.reducer";
import { DatasetsActions, toFeedReference, IFeedReference } from "../../state/datasets/datasets.actions";
import { Configuration } from "../../commons/configuration";
import { DatasetsMapComponent } from "../datasets-map/datasets-map.component";
import { MyDatasetsTableComponent } from "../my-datasets-table/my-datasets-table.component";
import { IFeed, FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActionType } from "../../state/datasets/datasets.actions";
import { Actions } from "@ngrx/effects";
import { LocalFiltersService } from "../../commons/services/api/localFilters.service";

@Component({
    selector:    'app-my-datasets',
    templateUrl: 'my-datasets.component.html'
})
export class MyDatasetsComponent extends DatasetsComponent {
    // override parent properties
    @ViewChild(DatasetsMapComponent) public mapComponent: DatasetsMapComponent;
    @ViewChild(MyDatasetsTableComponent) public tableComponent: MyDatasetsTableComponent;
    
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
        super(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$);
        this.initDatasets(true); // show private feeds
        actions$.ofType(DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS).subscribe(action => this.deleteFeeds());
    }
    
    deleteFeeds() {
        let feedRefsToDelete: IFeedReference[] = this.getCheckedFeeds().map((feed: IFeed) => toFeedReference(feed));
        if (feedRefsToDelete.length > 0) {
            this.store.dispatch(this.datasetsAction.feedDelete(feedRefsToDelete));
        }
        return false;
    }
}

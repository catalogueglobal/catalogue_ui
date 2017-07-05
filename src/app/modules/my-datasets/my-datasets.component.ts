import { Component, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsComponent } from "app/modules/datasets/datasets.component";
import { DatasetsState } from "app/state/datasets/datasets.reducer";
import { DatasetsActions, toFeedReference, IFeedReference } from "app/state/datasets/datasets.actions";
import { DatasetsMapComponent } from "app/modules/datasets-map/datasets-map.component";
import { MyDatasetsTableComponent } from "app/modules/my-datasets-table/my-datasets-table.component";
import { DatasetsActionType } from "app/state/datasets/datasets.actions";

import { Configuration,
    FeedsApiService,
    IFeed,
    ProjectsApiService,
    UtilsService,
    LocalFiltersService
} from "app/modules/common/";

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
    }

    protected createStore(){
      this.feeds$ = this.store.select('mydatasets').map(<DatasetsState>(datasets) => datasets.feeds);
      this.subscribeActions();
    }
}

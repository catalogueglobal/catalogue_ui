import { Component, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ExplorePage } from 'app/pages/explore/explore.page';
import { DatasetsState } from 'app/state/datasets/datasets.reducer';
import { DatasetsActions, toFeedReference } from 'app/state/datasets/datasets.actions';
import { DatasetsMapComponent } from 'app/modules/components';
import { UserDatasetsTableComponent } from 'app/modules/components';
import { DatasetsActionType } from 'app/state/datasets/datasets.actions';

import { Configuration,
    FeedsApiService,
    IFeed,
    ProjectsApiService,
    UtilsService,
    LocalFiltersService,
    IFeedReference
} from 'app/modules/common/';

@Component({
    selector: 'app-managment-page',
    templateUrl: 'managment.page.html'
})
export class ManagmentPage extends ExplorePage {
    // override parent properties
    @ViewChild(DatasetsMapComponent) public mapComponent: DatasetsMapComponent;
    @ViewChild(UserDatasetsTableComponent) public tableComponent: UserDatasetsTableComponent;

    constructor(
        protected utils: UtilsService,
        protected projectsApiService: ProjectsApiService,
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        protected config: Configuration,
        protected feedsApi: FeedsApiService,
        protected localFilters: LocalFiltersService,
        actions$: Actions) {
        super(utils, projectsApiService, store, datasetsAction, config, feedsApi, localFilters, actions$);
        this.initDatasets(true); // show private feeds
    }

    protected createStore() {
        this.feeds$ = this.store.select('mydatasets').map(<DatasetsState>(datasets) => datasets.feeds);
        this.subscribeActions();
    }
}

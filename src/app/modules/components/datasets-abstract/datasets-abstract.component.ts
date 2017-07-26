import { Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { DatasetsState } from 'app/state/datasets/datasets.reducer';
import { DatasetsActions, toFeedReference, DatasetsActionType } from 'app/state/datasets/datasets.actions';

import {
    FeedsApiService,
    FEED_RETRIEVAL_METHOD,
    ILicense,
    Configuration,
    UtilsService,
    SessionService,
    UsersApiService,
    SharedService,
    InlineEditEvent,
    LicenseApiService,
    IFeed } from 'app/modules/common/';

export class DatasetsAbstractComponent {
    protected config: Configuration;
    protected utils: UtilsService;
    protected sessionService: SessionService;
    protected feedsApiService: FeedsApiService;
    protected usersApiService: UsersApiService;
    protected store: Store<DatasetsState>;
    protected actions$: Actions;
    protected datasetsAction: DatasetsActions;
    protected shared: SharedService;
    protected licenseApiService: LicenseApiService;

    constructor(injector: Injector) {
        this.config = injector.get(Configuration);
        this.utils = injector.get(UtilsService);
        this.sessionService = injector.get(SessionService);
        this.feedsApiService = injector.get(FeedsApiService);
        this.usersApiService = injector.get(UsersApiService);
        this.store = injector.get(Store);
        this.actions$ = injector.get(Actions);
        this.datasetsAction = injector.get(DatasetsActions);
        this.shared = injector.get(SharedService);
        this.licenseApiService = injector.get(LicenseApiService);
    }
}

import { CommonModule }                                             from "@angular/common";
import { NgModule }                                                 from "@angular/core";
import { FormsModule }                                              from "@angular/forms";
import { Http, HttpModule }                                         from "@angular/http";
import { BrowserModule }                                            from "@angular/platform-browser";
import { compose }                                                  from "@ngrx/core/compose";
import { EffectsModule }                                            from "@ngrx/effects";
import { combineReducers, StoreModule }                             from "@ngrx/store";
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { ConfirmationPopoverModule }                                from 'angular-confirmation-popover';
import { AuthConfig, AuthHttp }                                     from "angular2-jwt";
import { ToasterModule }                                            from "angular2-toaster";
import { Ng2CompleterModule  }                                      from "ng2-completer";
import { TranslateModule }                                          from "ng2-translate";
import { TranslateService, TranslateLoader, TranslateStaticLoader } from "ng2-translate/src/translate.service";
import { storeLogger }                                              from "ngrx-store-logger";
import { Ng2PaginationModule }                                      from "ng2-pagination";
import { AppComponent }                                             from "./app.component";
import { routing }                                                  from "./app.routes";
import { Configuration }                                            from "./commons/configuration";
import { CustomFileinputDirective }                                 from "./commons/directives/customFileinput.directive";
import { FeedCreateFormComponent }                                  from "./commons/directives/feed-create-form/feed-create-form.component";
import { InlineEditFileComponent }                                  from "./commons/directives/inline-edit-file/inline-edit-file.component";
import { InlineEditTextComponent }                                  from "./commons/directives/inline-edit-text/inline-edit-text.component";
import { ModalComponent } from './commons/directives/modal/modal.component';
import { SortLinkComponent }                                        from "./commons/directives/sort-link/sort-link.component";
import { SpinnerComponent }                                         from "./commons/directives/spinner/spinner.component";
import { StatusComponent }                                          from "./commons/directives/status/status.component";
import { SubscribeFormComponent }                                   from './commons/directives/subscribe-form/subscribe-form.component';
import { AuthGuard }                                                from "./commons/guards/AuthGuard";
import { InstitutionalUrlPipe }                                     from "./commons/pipes/institutionalUrl.pipe";
import { OrderByPipe }                                              from "./commons/pipes/orderby";
import { FeedsApiService }                                          from "./commons/services/api/feedsApi.service";
import { LocalFiltersService }                                      from "./commons/services/api/localFilters.service";
import { ProjectsApiService }                                       from "./commons/services/api/projectsApi.service";
import { UsersApiService }                                          from "./commons/services/api/usersApi.service";
import { MapUtilsService }                                          from "./commons/services/mapUtils.service";
import { SessionService }                                           from "./commons/services/session.service";
import { SharedService }                                            from "./commons/services/shared.service";
import { UploadService }                                            from "./commons/services/upload.service";
import { UtilsService }                                             from "./commons/services/utils.service";
import { LayoutComponent }                                          from "./layout/layout.component";
import { DatasetsComponent }                                        from "./modules/datasets/datasets.component";
import { DatasetsAutocompleteComponent }                            from "./modules/datasets-autocomplete/datasets-autocomplete.component";
import { DatasetsMapComponent }                                     from "./modules/datasets-map/datasets-map.component";
import { DatasetsTableComponent }                                   from "./modules/datasets-table/datasets-table.component";
import { FeedsComponent }                                           from "./modules/feeds/feeds.component";
import { MyDatasetsComponent }                                      from "./modules/my-datasets/my-datasets.component";
import { MyDatasetsTableComponent }                                 from "./modules/my-datasets-table/my-datasets-table.component";
import { DatasetsActions }                                          from "./state/datasets/datasets.actions";
import { DatasetsEffects }                                          from "./state/datasets/datasets.effects";
import { appReducer }                                               from "./state/index.reducer";
import { TooltipModule } from 'ng2-bootstrap';
import {CommonComponent} from './commons/directives/modal/common-modal.component';
import { MiscDataModal } from './commons/directives/modal/miscdata-modal.component';
import { LicenseModal } from './commons/directives/modal/license-modal.component';
import { DeleteFeedModal } from './commons/directives/modal/delete-feed-modal.component';
import { DatatoolComponent }                                            from "./commons/components/datatool.component";
import { FeedMapComponent }                                            from "./commons/components/feed-map/feed-map.component";
import {FeedMapUtilsService} from "./commons/components/feed-map/feed-map-utils.service";
import {RouteFilter} from  "./commons/components/feed-map/route.filter";

export function httpFactory(http: Http) {
    return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}

export function sessionServiceFactory(sessionService) {
    return new AuthConfig({
        tokenGetter: () => {
            return sessionService._tokenGetter();
        },
        noJwtError: false,
    });
}

export function httpAuthConfigFactory(http, authConfig) {
    return new AuthHttp(authConfig, http);
}

const allReducers = compose(storeLogger(), combineReducers)(appReducer);

export function composeProvider(state: any, action: any) {
    return allReducers(state, action);
}

@NgModule({
    declarations: [
        AppComponent,
        DatasetsComponent,
        MyDatasetsComponent,
        FeedsComponent,

        // directives
        CustomFileinputDirective,
        LayoutComponent,

        //ToasterContainerComponent,
        DatasetsMapComponent,
        DatasetsTableComponent,
        DatasetsAutocompleteComponent,
        SortLinkComponent,
        MyDatasetsTableComponent,

        // pipes
        InstitutionalUrlPipe,
        RouteFilter,
        OrderByPipe,
        SpinnerComponent,
        StatusComponent,
        FeedCreateFormComponent,
        InlineEditTextComponent,
        InlineEditFileComponent,
        SubscribeFormComponent,
        CommonComponent,
        ModalComponent,
        LicenseModal,
        MiscDataModal,
        DeleteFeedModal,
        DatatoolComponent,
        FeedMapComponent
    ],

    imports: [
        BrowserModule,
        CommonModule,
        Ng2CompleterModule,
        FormsModule,
        HttpModule,
        ToasterModule,
        routing,
        Ng2PaginationModule,

        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
        }),

        StoreModule.provideStore(composeProvider),
        EffectsModule.run(DatasetsEffects),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),

        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: httpFactory,
            deps: [Http]
        }),
        TooltipModule.forRoot()
    ],

    entryComponents: [AppComponent],

    bootstrap: [AppComponent],

    providers: [
        TranslateService, SessionService, Configuration, UploadService,
        UtilsService, MapUtilsService, ProjectsApiService, FeedsApiService, UsersApiService, LocalFiltersService,
        DatasetsActions, SharedService, FeedMapUtilsService,
        AuthGuard,
        //NG2_WEBSTORAGE,

        {
            provide: AuthConfig,
            useFactory: sessionServiceFactory,
            deps: [SessionService]
        },

        {
            provide: AuthHttp,
            useFactory: httpAuthConfigFactory,
            deps: [Http, AuthConfig]
        },
    ]
})
export class AppModule { }

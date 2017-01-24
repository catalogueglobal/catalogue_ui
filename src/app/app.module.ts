import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {DatasetsEffects} from "./state/datasets/datasets.effects";
import {TranslateService, TranslateLoader, TranslateStaticLoader} from "ng2-translate/src/translate.service";
import {SessionService} from "./commons/services/session.service";
import {Configuration} from "./commons/configuration";
import {UploadService} from "./commons/services/upload.service";
import {UtilsService} from "./commons/services/utils.service";
import {MapUtilsService} from "./commons/services/mapUtils.service";
import {ProjectsApiService} from "./commons/services/api/projectsApi.service";
import {FeedsApiService} from "./commons/services/api/feedsApi.service";
import {DatasetsActions} from "./state/datasets/datasets.actions";
import {CustomFileinputDirective} from "./commons/directives/customFileinput.directive";
import {InstitutionalUrlPipe} from "./commons/pipes/institutionalUrl.pipe";
import {Http, HttpModule} from "@angular/http";
import {AuthConfig, AuthHttp} from "angular2-jwt";
//import {NG2_WEBSTORAGE} from "ng2-webstorage";
import {storeLogger} from "ngrx-store-logger";
import {combineReducers, StoreModule} from "@ngrx/store";
import {appReducer} from "./state/index.reducer";
import {compose} from "@ngrx/core/compose";
import {routing} from "./app.routes";
import {TranslateModule} from "ng2-translate";
import {AuthGuard} from "./commons/guards/AuthGuard";
import {OrderByPipe} from "./commons/pipes/orderby";
import {LocalFiltersService} from "./commons/services/api/localFilters.service";
import {SpinnerComponent} from "./commons/directives/spinner/spinner.component";
import {ToasterModule} from "angular2-toaster/angular2-toaster";
//import {ToasterContainerComponent} from "angular2-toaster/angular2-toaster";
import {StatusComponent} from "./commons/directives/status/status.component";
import {FeedCreateFormComponent} from "./commons/directives/feed-create-form/feed-create-form.component";
import {DeleteFeedConfirmationComponent} from "./commons/directives/delete-feed-confirmation/delete-feed-confirmation.component";
import {InlineEditTextComponent} from "./commons/directives/inline-edit-text/inline-edit-text.component";
import {InlineEditFileComponent} from "./commons/directives/inline-edit-file/inline-edit-file.component";
import {SubscribeFormComponent} from './commons/directives/subscribe-form/subscribe-form.component';
import {UsersApiService} from "./commons/services/api/usersApi.service";
import {SharedService} from "./commons/services/shared.service";
import {TranslatePipe} from "ng2-translate/src/translate.pipe";
import {LayoutComponent} from "./layout/layout.component";
import {DatasetsAutocompleteComponent} from "./modules/datasets-autocomplete/datasets-autocomplete.component";
import {DatasetsMapComponent} from "./modules/datasets-map/datasets-map.component";
import {DatasetsTableComponent} from "./modules/datasets-table/datasets-table.component";
import {PaginationControlsCmp} from "ng2-pagination";
import {SortLinkComponent} from "./commons/directives/sort-link/sort-link.component";
import {MyDatasetsTableComponent} from "./modules/my-datasets-table/my-datasets-table.component";
import {PaginatePipe} from "ng2-pagination";
import {Ng2CompleterModule } from "ng2-completer";
import {DatasetsComponent} from "./modules/datasets/datasets.component";
import {FeedsComponent} from "./modules/feeds/feeds.component";
import {MyDatasetsComponent} from "./modules/my-datasets/my-datasets.component";
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';


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
    PaginationControlsCmp,
    SortLinkComponent,
    MyDatasetsTableComponent,

    // pipes
    InstitutionalUrlPipe,
    OrderByPipe,
    SpinnerComponent,
    StatusComponent,
    FeedCreateFormComponent,
    InlineEditTextComponent,
    InlineEditFileComponent,
    SubscribeFormComponent,
    PaginatePipe,
    DeleteFeedConfirmationComponent
  ],

  imports: [
    BrowserModule,
    CommonModule,
    Ng2CompleterModule,
    FormsModule,
    HttpModule,
    ToasterModule,
    routing,

    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),

    StoreModule.provideStore(
      compose(
        storeLogger(),
        combineReducers
      )(appReducer)
    ),
    EffectsModule.run(DatasetsEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],

  

  entryComponents: [AppComponent],

  bootstrap: [AppComponent],

  providers: [
    TranslateService, SessionService, Configuration, UploadService,
    UtilsService, MapUtilsService, ProjectsApiService, FeedsApiService, UsersApiService, LocalFiltersService,
    DatasetsActions, SharedService,
    AuthGuard,
    //NG2_WEBSTORAGE,

    {
      provide: AuthConfig,
      useFactory: (sessionService) => {
        return new AuthConfig({
          tokenGetter: () => {
            return sessionService._tokenGetter();
          },
          noJwtError: false,
        });
      },
      deps: [SessionService]
    },

    {
      provide: AuthHttp,
      useFactory: (http, authConfig) => {
        return new AuthHttp(authConfig, http);
      },
      deps: [Http, AuthConfig]
    },
  ]
})
export class AppModule { }

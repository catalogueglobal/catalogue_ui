import { CommonModule }                                             from '@angular/common';
import { NgModule }                                                 from '@angular/core';
import { FormsModule }                                              from '@angular/forms';
import { Http, HttpModule }                                         from '@angular/http';
import { BrowserModule }                                            from '@angular/platform-browser';
import { compose }                                                  from '@ngrx/core/compose';
import { EffectsModule }                                            from '@ngrx/effects';
import { combineReducers, StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { ConfirmationPopoverModule }                                from 'angular-confirmation-popover';
import { AuthConfig, AuthHttp }                                     from 'angular2-jwt';
import { ToasterModule }                                            from 'angular2-toaster';
import { TranslateModule }                                          from 'ng2-translate';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { storeLogger }                                              from 'ngrx-store-logger';
import { Ng2PaginationModule }                                      from 'ng2-pagination';
import { TooltipModule } from 'ng2-bootstrap';

import { AppComponent }                                             from './app.component';
import { routing }                                                  from './app.routes';
import { LayoutComponent }                                          from './layout/layout.component';
import { ExplorePage }                                              from './pages/explore/explore.page';
import { FeedPage }                                                 from './pages/feed/feed.page';
import { ManagmentPage }                                            from './pages/managment/managment.page';
import { DatasetsActions }                                          from './state/datasets/datasets.actions';
import { DatasetsEffects }                                          from './state/datasets/datasets.effects';
import { appReducer }                                               from './state/index.reducer';

import { CtCommonModule, SessionService } from './modules/common/';
import { ComponentsModule } from './modules/components/';

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
        ExplorePage,
        ManagmentPage,
        FeedPage,

        // directives
        LayoutComponent
    ],

    imports: [
        BrowserModule,
        CommonModule,
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
        TooltipModule.forRoot(),
        CtCommonModule,
        ComponentsModule
    ],

    entryComponents: [AppComponent],

    bootstrap: [AppComponent],

    providers: [
        TranslateService,
        DatasetsActions,
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
        }
    ]
})
export class AppModule { }

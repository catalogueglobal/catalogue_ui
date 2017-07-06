import { NgModule } from '@angular/core';
import { CommonModule }                                             from '@angular/common';
import { FormsModule }                                              from '@angular/forms';
import { Http, HttpModule }                                         from '@angular/http';
import { BrowserModule }                                            from '@angular/platform-browser';
import { compose }                                                  from '@ngrx/core/compose';

import { StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { TranslateModule }                                          from 'ng2-translate';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

import {
    Configuration,
    InstitutionalUrlPipe,
    OrderByPipe,
    FilterPipe,
    FilterByVisibilityPipe,
    TruncatePipe,

    AuthGuard,
    FeedsApiService,
    LocalFiltersService,
    ProjectsApiService,
    UsersApiService,
    MapUtilsService,
    SessionService,
    SharedService,
    UploadService,
    UtilsService
} from './';

let _entryPoints = [
];

let _declarations: Array<any> = [
    InstitutionalUrlPipe,
    OrderByPipe,
    FilterPipe,
    FilterByVisibilityPipe,
    TruncatePipe
];

export function entryPoints() {
    return _entryPoints;
}

export function exports() {
    return declarations().concat();
}

export function declarations() {
    return _declarations.concat(_entryPoints);
}

export function providers() {
    return [
        AuthGuard,
        FeedsApiService,
        LocalFiltersService,
        ProjectsApiService,
        UsersApiService,
        MapUtilsService,
        SessionService,
        SharedService,
        UploadService,
        UtilsService,
        Configuration,
        InstitutionalUrlPipe,
        OrderByPipe,
        FilterPipe,
        FilterByVisibilityPipe,
        TruncatePipe
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        CommonModule,
        HttpModule,
        StoreModule,
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        TranslateModule
    ],
    entryComponents: entryPoints(),
    providers: providers(),
    exports: exports()
})
export class CtCommonModule { }

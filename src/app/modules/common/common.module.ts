import { NgModule } from '@angular/core';
import { CommonModule }                                             from '@angular/common';
import { FormsModule }                                              from '@angular/forms';
import { Http, HttpModule }                                         from '@angular/http';
import { BrowserModule }                                            from '@angular/platform-browser';

import { StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { TranslateModule }                                          from 'ng2-translate';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

import {
    Configuration,
    InstitutionalUrlPipe,
    FilterPipe,
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
    UtilsService,
    LicenseApiService
} from './';

export const declarations = [
    InstitutionalUrlPipe,
    FilterPipe,
    TruncatePipe
];

export const exports = declarations;
export const entryPoints = [];
export const providers = [
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
    FilterPipe,
    TruncatePipe,
    LicenseApiService
];

@NgModule({
    declarations: declarations,
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
    entryComponents: entryPoints,
    providers: providers,
    exports: exports
})
export class CtCommonModule { }

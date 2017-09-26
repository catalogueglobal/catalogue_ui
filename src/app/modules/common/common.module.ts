import { AuthGuard } from './guards/AuthGuard';
import { FilterPipe } from './pipes/filter.pipe';
import { InstitutionalUrlPipe } from './pipes/institutionalUrl.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { FeedsApiService } from './services/api/feedsApi.service';
import { LicenseApiService } from './services/api/licenseApi.service';
import { LocalFiltersService } from './services/api/localFilters.service';
import { ProjectsApiService } from './services/api/projectsApi.service';
import { UsersApiService } from './services/api/usersApi.service';
import { Configuration } from './services/configuration';
import { MapUtilsService } from './services/mapUtils.service';
import { SessionService } from './services/session.service';
import { SharedService } from './services/shared.service';
import { UploadService } from './services/upload.service';
import { UtilsService } from './services/utils.service';
import { NgModule } from '@angular/core';
import { CommonModule }                                             from '@angular/common';
import { FormsModule }                                              from '@angular/forms';
import { Http, HttpModule }                                         from '@angular/http';
import { BrowserModule }                                            from '@angular/platform-browser';

import { StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { TranslateModule }                                          from 'ng2-translate';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
/*
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
*/

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

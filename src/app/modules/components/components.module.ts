import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule } from 'ng2-translate';
import { Ng2CompleterModule  }                                      from 'ng2-completer';
import { StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { Ng2PaginationModule }                                      from 'ng2-pagination';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ToasterModule }                                            from 'angular2-toaster';

import { CtCommonModule } from 'app/modules/common';

import {
    DatasetsMapComponent,
    DatasetsAutocompleteComponent,
    DatasetsTableComponent,
    UserDatasetsTableComponent,
    SortLinkComponent,
    CommonComponent,
    ConfirmFeedVersionModal,
    DeleteFeedModal,
    LicenseModal,
    MiscDataModal,
    ModalComponent,
    ValidationDetailsModal,
    CustomFileinputDirective,
    FeedCreateFormComponent,
    InlineEditFileComponent,
    InlineEditTextComponent,
    SpinnerComponent,
    StatusComponent,
    SubscribeFormComponent,
    FeedRouteFilter,
    FeedMapComponent,
    FeedMapUtilsService,
    DatasetsGenericComponent,
    LayoutComponent
} from './';

let _entryPoints = [
];

let _declarations: Array<any> = [
    LayoutComponent,
    DatasetsMapComponent,
    DatasetsAutocompleteComponent,
    DatasetsTableComponent,
    UserDatasetsTableComponent,
    SortLinkComponent,

    CommonComponent,
    ConfirmFeedVersionModal,
    DeleteFeedModal,
    LicenseModal,
    MiscDataModal,
    ModalComponent,
    ValidationDetailsModal,
    CustomFileinputDirective,
    FeedCreateFormComponent,
    InlineEditFileComponent,
    InlineEditTextComponent,
    SpinnerComponent,
    StatusComponent,
    SubscribeFormComponent,
    FeedRouteFilter,
    FeedMapComponent,
    DatasetsGenericComponent
];

export function entryPoints() {
    return _entryPoints;
}

export function declarations() {
    return _declarations.concat(_entryPoints);
}

export function providers() {
    return [
        FeedMapUtilsService
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        Ng2CompleterModule,
        Ng2PaginationModule,
        StoreModule,
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        RouterModule.forRoot([]),
        TooltipModule.forRoot(),
        ToasterModule,
        ChartsModule,
        CtCommonModule
    ],
    entryComponents: entryPoints(),
    providers: providers(),
    exports: declarations()
})
export class ComponentsModule { }

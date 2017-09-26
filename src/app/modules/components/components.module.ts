import { CustomFileinputDirective } from './custom-file-input/custom-file-input.directive';
import { DatasetsAutocompleteComponent } from './datasets-autocomplete/datasets-autocomplete.component';
import { DatasetsGenericComponent } from './datasets-generic/datasets-generic.component';
import { DatasetsMapComponent } from './datasets-map/datasets-map.component';
import { DatasetsTableComponent } from './datasets-table/datasets-table.component';
import { UserDatasetsTableComponent } from './datasets-table/user-datasets-table.component';
import { FeedCreateFormComponent } from './feed-create-form/feed-create-form.component';
import { FeedMapUtilsService } from './feed-map/feed-map-utils.service';
import { FeedMapComponent } from './feed-map/feed-map.component';
import { FeedRouteFilter } from './feed-map/feed-route.filter';
import { InlineEditFileComponent } from './inline-edit-file/inline-edit-file.component';
import { InlineEditTextComponent } from './inline-edit-text/inline-edit-text.component';
import { LayoutComponent } from './layout/layout.component';
import { CommonComponent } from './modal/common-modal.component';
import { ConfirmFeedVersionModal } from './modal/confirm-feed-version-modal.component';
import { DeleteFeedModal } from './modal/delete-feed-modal.component';
import { LicenseModal } from './modal/license-modal.component';
import { MiscDataModal } from './modal/miscdata-modal.component';
import { ModalComponent } from './modal/modal.component';
import { ValidationDetailsModal } from './modal/validation-details-modal.component';
import { SortLinkComponent } from './sort-link/sort-link.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { StatusComponent } from './status/status.component';
import { SubscribeFormComponent } from './subscribe-form/subscribe-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule } from 'ng2-translate';
import { Ng2CompleterModule  }                                      from 'ng2-completer';
import { StoreModule }                             from '@ngrx/store';
import { StoreDevtoolsModule }                                      from '@ngrx/store-devtools';
import { NgxPaginationModule }                                      from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ToasterModule }                                            from 'angular2-toaster';

import { CtCommonModule } from 'app/modules/common';

/*import {
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
*/

export const entryPoints = [
];

export const declarations = [
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

export const providers = [
    FeedMapUtilsService
];

@NgModule({
    declarations: declarations,
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        Ng2CompleterModule,
        NgxPaginationModule,
        StoreModule,
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        RouterModule.forRoot([]),
        TooltipModule.forRoot(),
        ToasterModule,
        ChartsModule,
        CtCommonModule
    ],
    entryComponents: entryPoints,
    providers: providers,
    exports: declarations
})
export class ComponentsModule { }

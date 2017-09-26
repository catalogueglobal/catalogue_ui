"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var custom_file_input_directive_1 = require("./custom-file-input/custom-file-input.directive");
var datasets_autocomplete_component_1 = require("./datasets-autocomplete/datasets-autocomplete.component");
var datasets_generic_component_1 = require("./datasets-generic/datasets-generic.component");
var datasets_map_component_1 = require("./datasets-map/datasets-map.component");
var datasets_table_component_1 = require("./datasets-table/datasets-table.component");
var user_datasets_table_component_1 = require("./datasets-table/user-datasets-table.component");
var feed_create_form_component_1 = require("./feed-create-form/feed-create-form.component");
var feed_map_utils_service_1 = require("./feed-map/feed-map-utils.service");
var feed_map_component_1 = require("./feed-map/feed-map.component");
var feed_route_filter_1 = require("./feed-map/feed-route.filter");
var inline_edit_file_component_1 = require("./inline-edit-file/inline-edit-file.component");
var inline_edit_text_component_1 = require("./inline-edit-text/inline-edit-text.component");
var layout_component_1 = require("./layout/layout.component");
var common_modal_component_1 = require("./modal/common-modal.component");
var confirm_feed_version_modal_component_1 = require("./modal/confirm-feed-version-modal.component");
var delete_feed_modal_component_1 = require("./modal/delete-feed-modal.component");
var license_modal_component_1 = require("./modal/license-modal.component");
var miscdata_modal_component_1 = require("./modal/miscdata-modal.component");
var modal_component_1 = require("./modal/modal.component");
var validation_details_modal_component_1 = require("./modal/validation-details-modal.component");
var sort_link_component_1 = require("./sort-link/sort-link.component");
var spinner_component_1 = require("./spinner/spinner.component");
var status_component_1 = require("./status/status.component");
var subscribe_form_component_1 = require("./subscribe-form/subscribe-form.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_translate_1 = require("ng2-translate");
var ng2_completer_1 = require("ng2-completer");
var store_1 = require("@ngrx/store");
var store_devtools_1 = require("@ngrx/store-devtools");
var ngx_pagination_1 = require("ngx-pagination");
var router_1 = require("@angular/router");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ng2_charts_1 = require("ng2-charts");
var angular2_toaster_1 = require("angular2-toaster");
var common_2 = require("app/modules/common");
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
exports.entryPoints = [];
exports.declarations = [
    layout_component_1.LayoutComponent,
    datasets_map_component_1.DatasetsMapComponent,
    datasets_autocomplete_component_1.DatasetsAutocompleteComponent,
    datasets_table_component_1.DatasetsTableComponent,
    user_datasets_table_component_1.UserDatasetsTableComponent,
    sort_link_component_1.SortLinkComponent,
    common_modal_component_1.CommonComponent,
    confirm_feed_version_modal_component_1.ConfirmFeedVersionModal,
    delete_feed_modal_component_1.DeleteFeedModal,
    license_modal_component_1.LicenseModal,
    miscdata_modal_component_1.MiscDataModal,
    modal_component_1.ModalComponent,
    validation_details_modal_component_1.ValidationDetailsModal,
    custom_file_input_directive_1.CustomFileinputDirective,
    feed_create_form_component_1.FeedCreateFormComponent,
    inline_edit_file_component_1.InlineEditFileComponent,
    inline_edit_text_component_1.InlineEditTextComponent,
    spinner_component_1.SpinnerComponent,
    status_component_1.StatusComponent,
    subscribe_form_component_1.SubscribeFormComponent,
    feed_route_filter_1.FeedRouteFilter,
    feed_map_component_1.FeedMapComponent,
    datasets_generic_component_1.DatasetsGenericComponent
];
exports.providers = [
    feed_map_utils_service_1.FeedMapUtilsService
];
var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    return ComponentsModule;
}());
ComponentsModule = __decorate([
    core_1.NgModule({
        declarations: exports.declarations,
        imports: [
            platform_browser_1.BrowserModule,
            common_1.CommonModule,
            forms_1.FormsModule,
            ng2_translate_1.TranslateModule,
            ng2_completer_1.Ng2CompleterModule,
            ngx_pagination_1.NgxPaginationModule,
            store_1.StoreModule,
            store_devtools_1.StoreDevtoolsModule.instrumentOnlyWithExtension(),
            router_1.RouterModule.forRoot([]),
            ngx_bootstrap_1.TooltipModule.forRoot(),
            angular2_toaster_1.ToasterModule,
            ng2_charts_1.ChartsModule,
            common_2.CtCommonModule
        ],
        entryComponents: exports.entryPoints,
        providers: exports.providers,
        exports: exports.declarations
    })
], ComponentsModule);
exports.ComponentsModule = ComponentsModule;

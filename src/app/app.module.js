"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var compose_1 = require("@ngrx/core/compose");
var effects_1 = require("@ngrx/effects");
var store_1 = require("@ngrx/store");
var store_devtools_1 = require("@ngrx/store-devtools");
var ngrx_store_logger_1 = require("ngrx-store-logger");
var angular2_jwt_1 = require("angular2-jwt");
var ng2_translate_1 = require("ng2-translate");
var translate_service_1 = require("ng2-translate/src/translate.service");
var ngx_pagination_1 = require("ngx-pagination");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var app_config_1 = require("./app.config");
var app_component_1 = require("./app.component");
var app_routes_1 = require("./app.routes");
var explore_page_1 = require("./pages/explore/explore.page");
var feed_page_1 = require("./pages/feed/feed.page");
var managment_page_1 = require("./pages/managment/managment.page");
var datasets_actions_1 = require("./state/datasets/datasets.actions");
var datasets_effects_1 = require("./state/datasets/datasets.effects");
var index_reducer_1 = require("./state/index.reducer");
var _1 = require("./modules/common/");
var _2 = require("./modules/components/");
function httpFactory(http) {
    return new translate_service_1.TranslateStaticLoader(http, '/assets/i18n', '.json');
}
exports.httpFactory = httpFactory;
function sessionServiceFactory(sessionService) {
    return new angular2_jwt_1.AuthConfig({
        tokenGetter: function () {
            return sessionService._tokenGetter();
        },
        noJwtError: false
    });
}
exports.sessionServiceFactory = sessionServiceFactory;
function httpAuthConfigFactory(http, authConfig) {
    return new angular2_jwt_1.AuthHttp(authConfig, http);
}
exports.httpAuthConfigFactory = httpAuthConfigFactory;
function getConfigFactory() {
    return app_config_1.AppConfig.getInstance('./environment.json');
}
exports.getConfigFactory = getConfigFactory;
var allReducers = compose_1.compose(ngrx_store_logger_1.storeLogger(), store_1.combineReducers)(index_reducer_1.appReducer);
function composeProvider(state, action) {
    return allReducers(state, action);
}
exports.composeProvider = composeProvider;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            explore_page_1.ExplorePage,
            managment_page_1.ManagmentPage,
            feed_page_1.FeedPage
        ],
        imports: [
            platform_browser_1.BrowserModule,
            common_1.CommonModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routes_1.routing,
            ngx_pagination_1.NgxPaginationModule,
            store_1.StoreModule.provideStore(composeProvider),
            effects_1.EffectsModule.run(datasets_effects_1.DatasetsEffects),
            store_devtools_1.StoreDevtoolsModule.instrumentOnlyWithExtension(),
            ng2_translate_1.TranslateModule.forRoot({
                provide: translate_service_1.TranslateLoader,
                useFactory: httpFactory,
                deps: [http_1.Http]
            }),
            ngx_bootstrap_1.TooltipModule.forRoot(),
            _1.CtCommonModule,
            _2.ComponentsModule
        ],
        entryComponents: [app_component_1.AppComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [
            {
                provide: app_config_1.AppConfig,
                useFactory: getConfigFactory
            },
            translate_service_1.TranslateService,
            datasets_actions_1.DatasetsActions,
            //NG2_WEBSTORAGE,
            {
                provide: angular2_jwt_1.AuthConfig,
                useFactory: sessionServiceFactory,
                deps: [_1.SessionService]
            },
            {
                provide: angular2_jwt_1.AuthHttp,
                useFactory: httpAuthConfigFactory,
                deps: [http_1.Http, angular2_jwt_1.AuthConfig]
            }
        ]
    })
], AppModule);
exports.AppModule = AppModule;

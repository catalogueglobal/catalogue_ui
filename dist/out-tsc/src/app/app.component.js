var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { TranslateService } from "ng2-translate";
import { Router, NavigationEnd } from "@angular/router";
import { Store } from "@ngrx/store";
import { DatasetsActions } from "./state/datasets/datasets.actions";
export var AppComponent = (function () {
    function AppComponent(translate, router, appStore, datasetsStore, datasetsAction) {
        this.translate = translate;
        this.router = router;
        this.appStore = appStore;
        this.datasetsStore = datasetsStore;
        this.datasetsAction = datasetsAction;
        initLanguage(translate, 'en');
        // apply general.js to all views
        router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                applyGeneralJs();
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [TranslateService, Router, Store, Store, DatasetsActions])
    ], AppComponent);
    return AppComponent;
}());
/**
 * init ng2-translate: use navigator lang if available, or defaultLang
 * @param translate
 * @param defaultLang
 */
function initLanguage(translate, defaultLang) {
    var userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : defaultLang;
    translate.setDefaultLang(defaultLang);
    translate.use(userLang);
}
/**
 * Apply scripts from general.js to current view.
 */
function applyGeneralJs() {
    try {
        console.log("generalJs()");
        generalJs();
    }
    catch (e) {
        console.log('generalJs error', e);
    }
}
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/app.component.js.map
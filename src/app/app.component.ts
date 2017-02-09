import { Component, OnInit }            from "@angular/core";
import { TranslateService }             from "ng2-translate";
import { Router, NavigationEnd, Event } from "@angular/router";
import { Store }                        from "@ngrx/store";
import { DatasetsActions }              from "./state/datasets/datasets.actions";
import { DatasetsState }                from "./state/datasets/datasets.reducer";
import { AppState }                     from "./state/index.reducer";

@Component({
    selector:    'app-root',
    templateUrl: 'app.component.html',
    styleUrls:   ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
	private translate: TranslateService, private router: Router,
	private appStore: Store<AppState>,
	private datasetsStore: Store<DatasetsState>,
	private datasetsAction: DatasetsActions)
    {
	initLanguage(translate, 'en');
	// apply general.js to all views
	router.events.subscribe(
	    (event: Event) => {
		if (event instanceof NavigationEnd) {
		    applyGeneralJs();
		}
	    }
	);
    }
    
    ngOnInit() {
    }
}

/**
 * init ng2-translate: use navigator lang if available, or defaultLang
 * @param translate
 * @param defaultLang
 */
function initLanguage(translate: TranslateService, defaultLang: string): void {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : defaultLang;
    translate.setDefaultLang(defaultLang);
    translate.use(userLang);
}

/**
 * Apply scripts from general.js to current view.
 */
function applyGeneralJs(): void {
    try {
	console.log("generalJs()");
	generalJs();
    } catch (e) {
	console.log('generalJs error', e);
    }
}

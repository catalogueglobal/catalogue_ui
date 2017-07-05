import { Component }          from "@angular/core";
import { Actions }            from "@ngrx/effects";
import { SessionService }     from "app/modules/common/";
import { DatasetsActionType } from "app/state/datasets/datasets.actions";

@Component({
    selector:    'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls:   ['layout.component.css']
})
export class LayoutComponent {
    mainTitle: string;

    constructor(
        private sessionService: SessionService,
        protected actions$: Actions)
    {
        this.mainTitle = "";
        // close popup on feed creation success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(action => closePopup('#createfeed'))
        // close popup on feed added to project
        actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(action => closePopup('#createfeed'))
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(action => openPopup('#uploadingfeed'))
        // close popup on user subscribe success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(action => closePopup('#subscribepopup'));
    }
}

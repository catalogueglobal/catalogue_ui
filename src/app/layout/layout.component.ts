import {Component} from "@angular/core";
import {SessionService} from "../commons/services/session.service";
import {DatasetsActions, DatasetsActionType} from "../state/datasets/datasets.actions";
import {Actions} from "@ngrx/effects";

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.css']
})
export class LayoutComponent {
  mainTitle: string;

  constructor(private sessionService: SessionService, protected actions$: Actions) {
    this.mainTitle = "";

    // close popup on feed creation success
    actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS)
      .subscribe(action => closePopup('#createfeed'))

    // close popup on feed added to project 
    actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS)
      .subscribe(action => closePopup('#createfeed'))

    actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS)
      .subscribe(action => openPopup('#uploadingfeed'))

    // close popup on user subscribe success
    actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS)
      .subscribe(action => closePopup('#subscribepopup'))

    actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS)
      .subscribe(action => closePopup('#deletefeedpopup'))
  }

}

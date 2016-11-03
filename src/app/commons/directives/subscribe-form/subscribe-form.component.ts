import {Component} from "@angular/core";
import {DatasetsActions, DatasetsActionType} from "../../../state/datasets/datasets.actions";
import {UserSubscribeParams} from "../../services/api/usersApi.service";
import {Store} from "@ngrx/store";
import {DatasetsState} from "../../../state/datasets/datasets.reducer";
import {Actions} from "@ngrx/effects";

@Component({
  selector: 'app-subscribe-form',
  templateUrl: 'subscribe-form.component.html'
})
export class SubscribeFormComponent {
  private now = Date.now();
  private userSubscribeParams: UserSubscribeParams = {
    NAME: "",
    EMAIL: "",
    COMPANY: "",
    TYPE: ""
  };

  constructor(private datasetsAction: DatasetsActions, private store: Store<DatasetsState>, actions$: Actions) {
    this.resetForm();

    // reset form on subscribe success
    actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(() => this.resetForm())
  }

  private submit(): void {
    this.store.dispatch(this.datasetsAction.userSubscribe(this.userSubscribeParams));
  }

  private resetForm() {
    this.userSubscribeParams = {
      NAME: "",
      EMAIL: "",
      COMPANY: "",
      TYPE: ""
    };
  }

}

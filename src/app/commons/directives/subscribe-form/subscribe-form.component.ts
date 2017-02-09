import { Component }                           from "@angular/core";
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { DatasetsState }                       from "../../../state/datasets/datasets.reducer";
import { UserSubscribeParams }                 from "../../services/api/usersApi.service";

@Component({
    selector:    'app-subscribe-form',
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

    constructor(
        private datasetsAction: DatasetsActions,
        private store: Store<DatasetsState>,
        actions$: Actions)
    {
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

import {Component, OnInit} from "@angular/core";
import {UtilsService} from "../../services/utils.service";
import {DatasetsActions, DatasetsActionType} from "../../../state/datasets/datasets.actions";
import {DatasetsState} from "../../../state/datasets/datasets.reducer";
import {Store} from "@ngrx/store";
import {DatasetsEffects, ICreateFeed} from "../../../state/datasets/datasets.effects";
import {Actions} from "@ngrx/effects";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-feed-create-form',
  templateUrl: 'feed-create-form.component.html'
})
export class FeedCreateFormComponent {
  public simpleUpload;
  public showOptionsUpload: boolean;

  constructor(private sessionService:SessionService, private utils: UtilsService, protected store: Store<DatasetsState>, protected datasetsAction: DatasetsActions, actions$: Actions) {
    this.resetForm();

    // reset form on upload success
    actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(() => this.resetForm())
  }

  private submit(): void {
    if (!this.simpleUpload.file) {
      return;
    }

    let createFeed: ICreateFeed = {
      projectName: this.simpleUpload.projectName,
      feedName: this.simpleUpload.feedName,
      isPublic: this.simpleUpload.isPrivate,
      file: this.simpleUpload.file
    }
    this.store.dispatch(this.datasetsAction.feedCreate(createFeed));
  }

  private toggleShowOptionsUpload($event) {
    this.showOptionsUpload = !this.showOptionsUpload;
    return false;
  }

  private resetForm() {
    this.showOptionsUpload = false;
    this.simpleUpload = {
      projectName: "",
      feedName: "",
      file: null,
      isPrivate: false
    };
  }

}

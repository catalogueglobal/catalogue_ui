import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Actions} from "@ngrx/effects";
import {Store, Action} from "@ngrx/store";
import {DatasetsState} from "../../../state/datasets/datasets.reducer";
//import {DatasetsComponent} from "../../../modules/datasets/datasets.component";
import {DatasetsActions, toFeedReference, IFeedReference, DatasetsActionType} from "../../../state/datasets/datasets.actions";
import {IFeed, FeedsApiService} from "../../services/api/feedsApi.service";
import {ProjectsApiService} from "../../services/api/projectsApi.service";
import {UtilsService} from "../../services/utils.service";
import {Configuration} from "../../configuration";
import {LocalFiltersService} from "../../services/api/localFilters.service";
import {DatasetsTableComponent} from "../../../modules/datasets-table/datasets-table.component";
import {DatasetsComponent} from "../../../modules/datasets/datasets.component";

@Component({
  selector: 'app-delete-feed-confirmation',
  templateUrl: 'delete-feed-confirmation.component.html',
  providers: [DatasetsComponent]
})
export class DeleteFeedConfirmationComponent {
  public deleteFeed;


  @Output() protected submitForm = new EventEmitter();
  
  constructor(protected utils: UtilsService, protected projectsApiService: ProjectsApiService, protected store: Store<DatasetsState>, protected datasetsAction: DatasetsActions, protected config: Configuration, protected feedsApi: FeedsApiService, protected localFilters: LocalFiltersService, actions$: Actions, protected myDatasets: DatasetsComponent) {

    this.resetForm();
    actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(action => this.resetForm());
  }

  private submit(){
    event.preventDefault(); 
    this.store.dispatch(this.datasetsAction.confirmationDeleteProject(this.deleteFeed.deleteProject));
  }

  private toggleDeleteProject(){
    this.deleteFeed.deleteProject = !this.deleteFeed.deleteProject;
  }


  private resetForm(){
    this.deleteFeed = {
      deleteProject: false
    }
  }
}
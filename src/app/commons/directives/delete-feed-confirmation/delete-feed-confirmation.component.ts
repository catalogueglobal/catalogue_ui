import { Component, Output, EventEmitter }     from "@angular/core";
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { DatasetsComponent }                   from "../../../modules/datasets/datasets.component";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { DatasetsState }                       from "../../../state/datasets/datasets.reducer";
import { Configuration }                       from "../../configuration";
import { FeedsApiService }                     from "../../services/api/feedsApi.service";
import { LocalFiltersService }                 from "../../services/api/localFilters.service";
import { ProjectsApiService }                  from "../../services/api/projectsApi.service";
import { UtilsService }                        from "../../services/utils.service";

@Component({
    selector:    'app-delete-feed-confirmation',
    templateUrl: 'delete-feed-confirmation.component.html',
    providers:   [DatasetsComponent]
})
export class DeleteFeedConfirmationComponent {
    public deleteFeed;
    @Output() protected submitForm = new EventEmitter();
  
    constructor(
        protected utils:              UtilsService,
        protected projectsApiService: ProjectsApiService,
        protected store:              Store<DatasetsState>,
        protected datasetsAction:     DatasetsActions,
        protected config:             Configuration,
        protected feedsApi:           FeedsApiService,
        protected localFilters:       LocalFiltersService,
        actions$:                     Actions,
        protected myDatasets:         DatasetsComponent)
    {
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

import { Component }                           from "@angular/core";
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { ICreateFeed }                         from "../../../state/datasets/datasets.effects";
import { DatasetsState }                       from "../../../state/datasets/datasets.reducer";
import { ProjectsApiService }                  from "../../services/api/projectsApi.service";
import { SessionService }                      from "../../services/session.service";
import { UtilsService }                        from "../../services/utils.service";

@Component({
    selector:    'app-feed-create-form',
    templateUrl: 'feed-create-form.component.html'
})
export class FeedCreateFormComponent {
    public simpleUpload;
    public showOptionsUpload: boolean;
    public addToProject: boolean;
    public projectsName = [];
    
    constructor(
        private sessionService:   SessionService,
        private utils:            UtilsService,
        protected store:          Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        private projectsService:  ProjectsApiService,
        actions$:                 Actions)
    {
        this.resetForm();
        // reset form on upload success
        actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(() => this.resetForm());
        actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(() => this.resetForm());
    }
    
    private submit(): void {
        if (!this.simpleUpload.file) {
            return;
        }
        let createFeed: ICreateFeed = {
            projectName: this.simpleUpload.projectName,
            feedName: this.simpleUpload.feedName,
            isPublic: this.simpleUpload.isPrivate,
            file: this.simpleUpload.file,
            licenceFile: this.simpleUpload.licence
        }
        this.store.dispatch(this.datasetsAction.feedCreate(createFeed));    
    }
    
    private toggleShowOptionsUpload($event) {
        this.showOptionsUpload = !this.showOptionsUpload;
        return false;
    }
    
    private toggleAddToProject($event){
        this.addToProject = !this.addToProject;
    }
    
    public getAllProjectNames(){
        if (this.sessionService.loggedIn == true){
            this.projectsService.getAllSecureProject().subscribe(response => {
                let name;
                let id;
                for (var i = 0; i < response.length; i++) {
                    name = response[i]["name"];
                    id = response[i]["id"];
                    this.projectsName[i] = {
                        name: name,
                        id: id
                    }
                    this.simpleUpload.projectId = this.projectsName[0]["id"];
                }});
             }
    }
    
    private resetForm() {
        this.showOptionsUpload = false;
        this.simpleUpload = {
            feedName: "",
            file: null,
            licence: null,
            newLicence: false,
            isPrivate: false
        };
    }
}

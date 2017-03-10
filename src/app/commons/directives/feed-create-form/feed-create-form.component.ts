import { Component } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsActions, DatasetsActionType } from "../../../state/datasets/datasets.actions";
import { ICreateFeed } from "../../../state/datasets/datasets.effects";
import { DatasetsState } from "../../../state/datasets/datasets.reducer";
import { ProjectsApiService } from "../../services/api/projectsApi.service";
import { FeedsApiService } from "../../services/api/feedsApi.service";
import { SessionService } from "../../services/session.service";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: 'app-feed-create-form',
  templateUrl: 'feed-create-form.component.html'
})
export class FeedCreateFormComponent {
  public simpleUpload:any = {};
  public showOptionsUpload: boolean;
  public addToProject: boolean;
  public projectsName = [];
  public licenses = [];

  constructor(
    private sessionService: SessionService,
    private utils: UtilsService,
    protected store: Store<DatasetsState>,
    protected datasetsAction: DatasetsActions,
    private projectsService: ProjectsApiService,
    private feedsService: FeedsApiService,
    actions$: Actions) {
    this.resetForm();
    // reset form on upload success
    actions$.ofType(DatasetsActionType.FEED_CREATE_SUCCESS).subscribe(() => this.resetForm());
    actions$.ofType(DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS).subscribe(() => this.resetForm());
    let that = this;
    this.feedsService.getLicenses().then(licenses => {
      that.licenses = licenses;
      that.simpleUpload.license = licenses.length > 0 ? licenses[0] : null;
    });
  }

  onChange(selectedLicense) {
    this.simpleUpload.license = selectedLicense;
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
      licenseName: this.simpleUpload.licenseName,
      licenseId: this.simpleUpload.license.id,
      metadataFile: this.simpleUpload.metadataFile,
      licenseFile: this.simpleUpload.licenseFile
    }
    this.store.dispatch(this.datasetsAction.feedCreate(createFeed));
  }

  private toggleShowOptionsUpload($event) {
    this.showOptionsUpload = !this.showOptionsUpload;
    return false;
  }

  private toggleAddToProject($event) {
    this.addToProject = !this.addToProject;
  }

  public getAllProjectNames() {
    if (this.sessionService.loggedIn == true) {
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
        }
      });
    }
  }

  private resetForm() {
    this.showOptionsUpload = false;
    this.simpleUpload = {
      feedName: "",
      file: null,
      license: null,
      newLicense: false,
      metadataFile: null,
      licenseFile: null,
      isPrivate: false
    };
  }
}

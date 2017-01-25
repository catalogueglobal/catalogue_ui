import {Component} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FeedsApiService, IFeedApi} from '../../commons/services/api/feedsApi.service';
import {SessionService} from "../../commons/services/session.service";
import {Store, Action} from "@ngrx/store";
import {DatasetsState} from "../../state/datasets/datasets.reducer";
import {DatasetsActions, DatasetsActionType} from "../../state/datasets/datasets.actions";

import {Actions} from "@ngrx/effects";

@Component({
  selector: 'app-feeds',
  templateUrl: 'feeds.component.html',
  
})

export class FeedsComponent {
  public note: string;
  public feedId: string;
  public notesFeed: Array<Object>;
  public infoFeed: Object;


    constructor(private route: ActivatedRoute, private router: Router, feedsApi: FeedsApiService, protected store: Store<DatasetsState>, protected actions$: Actions,
  protected datasetsAction: DatasetsActions, public sessionService: SessionService){
        // Get the id of the feed
        this.route.params.subscribe(params => {
          this.feedId = params["id"];
        });

      // Get the info from the feed id
      this.notesFeed = [];
      let that = this;

      feedsApi.getPublic(this.feedId).then(function(data){
        that.infoFeed = data;
      });

      

      if (sessionService.loggedIn == true){
        feedsApi.getNotes(this.feedId).then(function(data){
        for (var i = 0; i < data.length; i++){
          that.notesFeed.push(data[i]);
        }
        });
      }
      console.log("hi");
      console.log(this.infoFeed);
      console.log("hi");

      actions$.ofType(DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS)
      .subscribe(action => this.resetForm());
    }


  addNotesToFeed(){
    // add note to feed if not empty
    if (this.note != null){
      let data = {body: this.note}
      this.store.dispatch(this.datasetsAction.feedAddNotes(this.feedId, data));
      this.notesFeed.push(data);
    }
  }

  resetForm(){
    this.note = "";
  }

}
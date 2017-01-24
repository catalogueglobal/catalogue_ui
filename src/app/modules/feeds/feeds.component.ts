import {Component} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FeedsApiService, IFeedApi} from '../../commons/services/api/feedsApi.service';
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


    constructor(private route: ActivatedRoute, private router: Router, feedsApi: FeedsApiService, protected store: Store<DatasetsState>, protected actions$: Actions,
  protected datasetsAction: DatasetsActions){
        // Get the id of the feed
        this.route.params.subscribe(params => {
          this.feedId = params["id"];
        });

      // Get the info from the feed id
      this.notesFeed = [];
      let that = this;
      feedsApi.getNotes(this.feedId).then(function(data){
        for (var i = 0; i < data.length; i++){
          console.log(data[i]);
          that.notesFeed.push(data[i]);
        }
      });


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
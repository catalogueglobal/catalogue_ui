import { Component }                           from "@angular/core";
import { Router, ActivatedRoute }              from '@angular/router';
import { Actions }                             from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { FeedsApiService }                     from '../../commons/services/api/feedsApi.service';
import { SessionService }                      from "../../commons/services/session.service";
import { DatasetsActions, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { DatasetsState }                       from "../../state/datasets/datasets.reducer";

@Component({
    selector:    'app-feeds',
    templateUrl: 'feeds.component.html',    
})
export class FeedsComponent {
    public note: string;
    public feedId: string;
    public notesFeed: Array<any>;
    public infoFeed: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        feedsApi: FeedsApiService,
        protected store: Store<DatasetsState>,
        protected actions$: Actions,
        protected datasetsAction: DatasetsActions,
        public sessionService: SessionService)
    {
        // Get the id of the feed
        this.route.params.subscribe(params => { this.feedId = params["id"]; });
        // Get the info from the feed id
        this.notesFeed = [];
        let that = this;
        feedsApi.getPublic(this.feedId).then(function(data){ that.infoFeed = data; });
        if (sessionService.loggedIn === true){
            feedsApi.getNotes(this.feedId).then(function(data){
                that.notesFeed = data.reverse();
            }).catch(function(err){
              console.log(err);
            });
        }
        actions$.ofType(DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS).subscribe(action => this.resetForm());
    }
    
    addNotesToFeed(){
        // add note to feed if not empty
        if (this.note != null){
            let data = {body: this.note, date: Date.now(), userEmail: this.sessionService.session.user.email}
            this.store.dispatch(this.datasetsAction.feedAddNotes(this.feedId, data));
            this.notesFeed.unshift(data);
        }
    }
    
    resetForm(){
        this.note = "";
    }
}

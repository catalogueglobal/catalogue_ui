import {Component} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FeedsApiService, IFeedApi} from '../../commons/services/api/feedsApi.service';

@Component({
  selector: 'app-feeds',
  templateUrl: 'feeds.component.html',
  
})

export class FeedsComponent {
  feedId: string;
  feedInfo;


    constructor(private route: ActivatedRoute, private router: Router, feedsApi: FeedsApiService){
        // Get the id of the feed
        this.route.params.subscribe(params => {
          this.feedId = params["id"];
        });

      // Get the info from the feed id
      console.log("DATA", feedsApi.get(this.feedId));
      console.log("FEEEEEED", this.feedInfo);
    }

}
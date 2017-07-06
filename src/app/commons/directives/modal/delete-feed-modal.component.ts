import {Component, ViewChild, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';
import { Store } from "@ngrx/store";
import { DatasetsState } from "app/state/datasets/datasets.reducer";
import { DatasetsActions, toFeedReference, DatasetsActionType, IFeedReference } from "app/state/datasets/datasets.actions";
import { Actions } from "@ngrx/effects";

@Component({
    selector: 'delete-feed-modal',
    templateUrl: 'delete-feed-modal.html'
})
export class DeleteFeedModal extends CommonComponent {

    @Input()
    public feed: any;

    @Input()
    feedsLicenses: any;

    @Input()
    feedsMiscDatas: any;

    private licenses;
    private miscs;
    private deletedFeed: any;
    constructor(
        protected store: Store<DatasetsState>,
        protected datasetsAction: DatasetsActions,
        protected actions$: Actions,
    ) {
        super();
        actions$.ofType(DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS).subscribe(
            action => this.deleteFeed());
        actions$.ofType(DatasetsActionType.FEED_DELETE_SUCCESS).subscribe(action => this.deleteFeedSuccess());
        this.deletedFeed = {
            deleteProject: false,
            clicked: false
        }
    }

    protected deleteFeedSuccess() {
        this.hide();
        this.deletedFeed = {
            deleteProject: false,
            clicked: false
        };
        if (this.feed.feedVersionCount <= 1 || !this.feed.feedVersionCount){
          this.store.dispatch(this.datasetsAction.feedDeleteLicenses(this.licenses));
          this.store.dispatch(this.datasetsAction.feedDeleteMiscs(this.miscs));
        }
    }
    protected deleteFeed() {
        let feed: IFeedReference = toFeedReference(this.feed);
        if (feed) {
            this.licenses = {};
            this.miscs = {};
            if (this.feedsLicenses[feed.feedsourceId]) {
                if (!this.licenses[this.feedsLicenses[feed.feedsourceId].id]) {
                    this.licenses[this.feedsLicenses[feed.feedsourceId].id] = [];
                }
                this.licenses[this.feedsLicenses[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            if (this.feedsMiscDatas[feed.feedsourceId]) {
                if (!this.miscs[this.feedsMiscDatas[feed.feedsourceId].id]) {
                    this.miscs[this.feedsMiscDatas[feed.feedsourceId].id] = [];
                }
                this.miscs[this.feedsMiscDatas[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            feed.versionId = this.feed.selectedVersion.id;
            feed.feedVersionCount = this.feed.feedVersionCount;
            this.store.dispatch(this.datasetsAction.feedDelete([feed]));
        }
        return false;
    }

    validate() {
        this.deletedFeed.clicked = true;
        this.store.dispatch(this.datasetsAction.confirmationDeleteProject(this.deletedFeed.deleteProject));
    }
}

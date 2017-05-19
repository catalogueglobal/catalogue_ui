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
        }
    }
    protected deleteFeed() {
        let feed: IFeedReference = toFeedReference(this.feed);
        if (feed) {
            var licenses = {};
            var miscs = {};
            if (this.feedsLicenses[feed.feedsourceId]) {
                if (!licenses[this.feedsLicenses[feed.feedsourceId].id]) {
                    licenses[this.feedsLicenses[feed.feedsourceId].id] = [];
                }
                licenses[this.feedsLicenses[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            if (this.feedsMiscDatas[feed.feedsourceId]) {
                if (!miscs[this.feedsMiscDatas[feed.feedsourceId].id]) {
                    miscs[this.feedsMiscDatas[feed.feedsourceId].id] = [];
                }
                miscs[this.feedsMiscDatas[feed.feedsourceId].id].push(feed.feedsourceId);
            }
            this.store.dispatch(this.datasetsAction.feedDeleteLicenses(licenses));
            this.store.dispatch(this.datasetsAction.feedDeleteMiscs(miscs));
            this.store.dispatch(this.datasetsAction.feedDelete([feed]));
        }
        return false;
    }

    validate() {
        this.deletedFeed.clicked = true;
        this.store.dispatch(this.datasetsAction.confirmationDeleteProject(this.deletedFeed.deleteProject));
    }
}

import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PaginationService } from "ng2-pagination";
import { Configuration } from "../../commons/configuration";
import { SortOrder } from "../../commons/directives/sort-link/sort-link.component";
import { FeedsApiService, FEED_RETRIEVAL_METHOD, ILicense, IFeed } from "../../commons/services/api/feedsApi.service";
import { UsersApiService } from "../../commons/services/api/usersApi.service";
import { SessionService } from "../../commons/services/session.service";
import { UtilsService } from "../../commons/services/utils.service";
import { DatasetsActions, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { DatasetsState } from "../../state/datasets/datasets.reducer";
import { IFeedRow } from "../datasets/datasets.component";
import { SharedService } from "../../commons/services/shared.service";

@Component({
    selector: 'app-datasets-table',
    templateUrl: 'datasets-table.component.html',
    providers: [PaginationService]
})
export class DatasetsTableComponent {
    @Input() protected _feeds: IFeedRow[];
    @Input() protected chkAll: boolean = false;
    @Output() protected sortChange = new EventEmitter();
    private FEED_RETRIEVAL_METHOD = FEED_RETRIEVAL_METHOD; // used by the template
    private checkById: Map<string, boolean> = new Map<string, boolean>();
    private page: number;
    private indexToUnsubscribe: number;
    private feedSubscribed: Array<String>;
    protected licenses: Array<ILicense>;
    protected feedsLicenses = {};
    protected miscDatas: Array<ILicense>;
    protected feedsMiscDatas = {};

    protected currentFeed: IFeed;

    protected currentSort: SortOrder = {
        sort: 'name',
        order: 'asc'
    };

    constructor(
        protected config: Configuration,
        private utils: UtilsService,
        private sessionService: SessionService,
        private feedsApiService: FeedsApiService,
        private usersApiService: UsersApiService,
        protected store: Store<DatasetsState>,
        actions$: Actions,
        protected datasetsAction: DatasetsActions,
        protected shared: SharedService) {
        this.subscribeActions(actions$);
    }

    // overriden by childs
    @Input() set feeds(value: any) {

        this.getLicenses(value);
        if (!value) {
            this._feeds = null
            return
        }
        this._feeds = value
    }

    // overriden by childs
    get feeds() {
        return this._feeds;
    }

    getFeedsVersion(values: any) {
        for (var i = 0; values && i < values.length; i++) {
            let feed = values[i];
            if (feed.feedVersionCount > 1) {
                this.feedsApiService.getFeedVersions(feed.id, feed.isPublic).then(versions => {
                    feed.allVersions = versions;
                    feed.selectedVersion = feed.allVersions[0];
                });
            }else{
              var copy = Object.assign({}, feed);
              copy.updated = copy.lastUpdated;
              copy.id = copy.latestVersionId;
              feed.allVersions = [copy];
              feed.selectedVersion = feed.allVersions[0];
            }
        }
    }

    getLicenses(value: any) {
        let that = this;
        this.getMiscDatas(value);
        this.getFeedsVersion(value);
        this.feedsApiService.getLicenses().then(licenses => {
            that.licenses = licenses;
            this.shared.setLicenses(licenses);
            that.feedsLicenses = {};
            that.setFeedsItemsObj(value, true);
        });
    }

    getMiscDatas(value: any) {
        let that = this;
        this.feedsApiService.getMiscDatas().then(miscDatas => {
            that.miscDatas = miscDatas;
            this.shared.setMiscDatas(miscDatas);
            that.feedsMiscDatas = {};
            that.setFeedsItemsObj(value, false);
        });
    }

    setFeedsItemsObj(value: any, license: boolean) {
        let itemsObj = this.feedsLicenses;
        let apiUrl = this.feedsApiService.FEED_LICENSE;
        let itemsList = this.licenses;
        let downloadUrl = 'licenseUrl';
        if (!license) {
            itemsObj = this.feedsMiscDatas;
            apiUrl = this.feedsApiService.FEED_MISC_DATA;
            itemsList = this.miscDatas;
            downloadUrl = 'miscDataUrl';
        }

        if (itemsList && value) {
            for (let k = 0; k < value.length; k++) {
                let feed = value[k];
                for (let i = 0; i < itemsList.length; i++) {
                    if (itemsList[i].feedIds) {
                        for (let j = 0; j < itemsList[i].feedIds.length; j++) {
                            if (feed.id === itemsList[i].feedIds[j]) {
                                itemsObj[feed.id] = itemsList[i];
                                itemsObj[feed.id][downloadUrl] = apiUrl + '/' + itemsList[i].id;
                            }
                        }
                    }
                }
            }
        }
    }

    protected setSort(sort) {
        this.sortChange.emit(sort);
    }

    protected checkAll() {
        let newValue = !this.chkAll;
        this.feeds.forEach(feed => { this.checkById[feed.id] = newValue; });
        this.chkAll = newValue;
    }

    protected regionStateCountry(feed) {
        return this.utils.regionStateCountry(feed);
    }

    public getCheckedFeeds(): IFeedRow[] {
        if (!this.feeds) {
            // component not initialized yet
            return [];
        }
        return this.feeds.filter(feed => this.checkById[feed.id]);
    }

    public actionOnFeed(feed_id) {
        var response = this.usersApiService.getUser(this.sessionService.userId);
        let that = this;
        response.then(function(data) {
            let isSubscribe = that.isSubscribe(data, feed_id);
            that.subscribeOrUnsubscribeFeed(data, feed_id, isSubscribe);
        });
    }

    public subscribeOrUnsubscribeFeed(data, feed_id, isSubscribe) {
        if (isSubscribe == false) {
            console.log("SUBSCRIBE");
            data = this.utils.addFeedIdToJson(data, feed_id);
            this.store.dispatch(this.datasetsAction.subscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        } else {
            console.log("UNSUBSCRIBE");
            data.app_metadata.datatools[0].subscriptions[0].target.splice(this.indexToUnsubscribe, 1);
            console.log(data.app_metadata.datatools[0]);
            this.store.dispatch(this.datasetsAction.unsubscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        }
    }

    protected subscribeActions(actions$) {
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE).subscribe(
            () => {
                console.log('USER_SUBSCRIBE setting profile');
                this.sessionService.setProfile();
            }
        );
        actions$.ofType(DatasetsActionType.UNSUBSCRIBE_FEED).subscribe(
            () => {
                console.log('UNSUBSCRIBE_FEED setting profile');
                this.sessionService.setProfile();
            }
        );
    }

    // Return true or false if the user is subscribe
    // or not to the feed
    public isSubscribe(userInfos, feed_id) {
        console.log(userInfos);
        if (!userInfos.app_metadata || userInfos.app_metadata.datatools[0].subscriptions == null) {
            return false;
        } else {
            for (var i = 0; i < userInfos.app_metadata.datatools[0].subscriptions[0].target.length; i++) {
                if (userInfos.app_metadata.datatools[0].subscriptions[0].target[i] == feed_id) {
                    this.indexToUnsubscribe = i;
                    return true;
                }
            }
            return false
        }
    }

    public checkSubscribed(feed_id) {
        var index = this.sessionService.userProfile && (this.sessionService.userProfile.app_metadata ?
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0].target.indexOf(feed_id) : -1);
        if (index == -1) {
            return false
        }
        return true
    }

    public resetPage() {
        this.page = 1;
    }
}

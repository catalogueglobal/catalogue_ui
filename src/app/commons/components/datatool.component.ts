import {Component, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { FeedsApiService, FEED_RETRIEVAL_METHOD, ILicense, IFeed } from '../services/api/feedsApi.service';
import { Configuration } from "../configuration";
import { UtilsService } from "./../services/utils.service";
import { SessionService } from "./../services/session.service";
import { UsersApiService } from "./../services/api/usersApi.service";
import { DatasetsState } from "../../state/datasets/datasets.reducer";
import { DatasetsActions, toFeedReference, DatasetsActionType } from "../../state/datasets/datasets.actions";
import { SharedService } from "../services/shared.service";
import { InlineEditEvent } from "../../commons/directives/inline-edit-text/inline-edit-generic.component";

@Component({
  template: ''
})
export class DatatoolComponent {

    protected licenses: Array<ILicense>;
    protected feedsLicenses = {};
    protected miscDatas: Array<ILicense>;
    protected feedsMiscDatas = {};
    protected currentFeed: IFeed;
    protected confirmEditById: Map<string, EventEmitter<any>> = new Map();

    //edition
    protected newLicenseOrMiscData;
    protected onSelectionChangeCallback: Function;
    protected onItemChangedCallback: Function;
    protected onSubmitLicenseCallback: Function;
    protected onSubmitMiscDataCallback: Function;
    protected defaultLicenseId;


    constructor(
      protected config: Configuration,
      protected utils: UtilsService,
      protected sessionService: SessionService,
      protected feedsApiService: FeedsApiService,
      protected usersApiService: UsersApiService,
      protected store: Store<DatasetsState>,
      protected actions$: Actions,
      protected datasetsAction: DatasetsActions,
      protected shared: SharedService
    ) {

    }

    protected subscribeActions(actions){

    }

    protected getFeedVersion(feed) {
        if (feed.feedVersionCount > 1) {
            this.feedsApiService.getFeedVersions(feed.id, feed.isPublic).then(versions => {
                feed.allVersions = versions;
                feed.selectedVersion = feed.allVersions[0];
            });
        } else {
            var copy = Object.assign({}, feed);
            copy.updated = copy.lastUpdated;
            copy.id = copy.latestVersionId;
            feed.allVersions = [copy];
            feed.selectedVersion = feed.allVersions[0];
        }
    }

    protected getLicenses(value: any) {
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

    protected getFeedsVersion(values){
    }

    protected getMiscDatas(value: any) {
        let that = this;
        this.feedsApiService.getMiscDatas().then(miscDatas => {
            that.miscDatas = miscDatas;
            this.shared.setMiscDatas(miscDatas);
            that.feedsMiscDatas = {};
            that.setFeedsItemsObj(value, false);
        });
    }

    protected getDownloadUrl(feed: any){
      this.feedsApiService.getDownloadUrl(feed, feed.selectedVersion ? feed.selectedVersion.id : null).subscribe(
          url => {
            console.log('getDownloadUrl: ', url, feed);
              if (url) {
                  window.open(url);
              }
          }
      );
    }

    protected setFeedItemsObj(feed: any, license: boolean) {
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

    protected setFeedsItemsObj(value: any, license: boolean) {
      let itemsList = license ? this.licenses : this.miscDatas;
      if (itemsList && value) {
          for (let k = 0; k < value.length; k++) {
            this.setFeedItemsObj(value[k], license);
          }
      }
    }

    // Return true or false if the user is subscribe
    // or not to the feed
    protected isSubscribe(userInfos, feed_id):number {
        if (!userInfos.app_metadata || userInfos.app_metadata.datatools[0].subscriptions == null) {
            return -1;
        } else {
            for (var i = 0; i < userInfos.app_metadata.datatools[0].subscriptions[0].target.length; i++) {
                if (userInfos.app_metadata.datatools[0].subscriptions[0].target[i] == feed_id) {
                    return i;
                }
            }
            return -1;
        }
    }

    protected checkSubscribed(feed_id) {
        var index = this.sessionService.userProfile && (this.sessionService.userProfile.app_metadata ?
            this.sessionService.userProfile.app_metadata.datatools[0].subscriptions[0].target.indexOf(feed_id) : -1);
        if (index == -1) {
            return false
        }
        return true
    }

    protected actionOnFeed(feed_id) {
        var response = this.usersApiService.getUser(this.sessionService.userId);
        let that = this;
        response.then(function(data) {
            let isSubscribe = that.isSubscribe(data, feed_id);
            that.subscribeOrUnsubscribeFeed(data, feed_id, isSubscribe);
        });
    }

    protected subscribeOrUnsubscribeFeed(data, feed_id, isSubscribeIndex) {
        if (isSubscribeIndex == -1) {
            console.log("SUBSCRIBE");
            data = this.utils.addFeedIdToJson(data, feed_id);
            this.store.dispatch(this.datasetsAction.subscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        } else {
            console.log("UNSUBSCRIBE");
            data.app_metadata.datatools[0].subscriptions[0].target.splice(isSubscribeIndex, 1);
            console.log(data.app_metadata.datatools[0]);
            this.store.dispatch(this.datasetsAction.unsubscribeToFeed(data.user_id, { "data": data.app_metadata.datatools }));
        }
    }

    /**
     *EDITION
     *
     */
     protected resetForm(feedsValues:any) {
         if (this.currentFeed) {
             this.currentFeed = null;
             this.getLicenses(feedsValues);
         }

         this.newLicenseOrMiscData = {
             type: 'new',
             name: '',
             item: null,
             error: null,
             itemFile: {}
         };
     }

     protected createLicenseFail(feed, error) {
         this.newLicenseOrMiscData.error = error.message;
     }

     protected displayLicense(feed: IFeed) {
         this.currentFeed = feed;
         for (let i = 0; i < this.licenses.length; i++) {
             if (this.feedsLicenses[this.currentFeed.id] && this.licenses[i].id === this.feedsLicenses[this.currentFeed.id].id) {
                 this.newLicenseOrMiscData.item = this.licenses[i];
             }
             if (!this.newLicenseOrMiscData.item && this.licenses[i].id === this.defaultLicenseId) {
                 this.newLicenseOrMiscData.item = this.licenses[i];
             }
         }
         if (!this.newLicenseOrMiscData.item){
             this.newLicenseOrMiscData.item = this.licenses.length > 0 ? this.licenses[0] : null;
         }
     }

     protected displayMiscData(feed: IFeed) {
         this.currentFeed = feed;
         this.newLicenseOrMiscData.item = this.miscDatas.length > 0 ? this.miscDatas[0] : null;
         if (this.feedsLicenses[this.currentFeed.id]) {
             for (let i = 0; i < this.miscDatas.length; i++) {
                 if (this.miscDatas[i].id === this.feedsLicenses[this.currentFeed.id].id) {
                     this.newLicenseOrMiscData.item = this.miscDatas[i];
                 }
             }
         }
    }

    //lincense changed between existing licenses in the list (modal popup)
    protected onItemChanged(item) {
        console.log('selectedItem', item);
        this.newLicenseOrMiscData.item = item;
    }

    // type of the radio button changed (ex: no license, change license or custom license)
    protected onSelectionChange(type) {
        console.log('onSelectionChange', type);
        this.newLicenseOrMiscData.type = type;
    }

    protected setLicense():boolean {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetLicense(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
            return true;
        } else {
            return false;
        }
    }

    protected unsetLicense():boolean {
        if (this.feedsLicenses[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetLicense(toFeedReference(this.currentFeed), this.feedsLicenses[this.currentFeed.id].id));
            return true;
        } else {
            return false;
        }
    }

    protected createLicense() {
        this.store.dispatch(this.datasetsAction.feedCreateLicense(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    }

    protected setMiscData():boolean {
        if (this.newLicenseOrMiscData.item.id) {
            this.store.dispatch(this.datasetsAction.feedSetMiscData(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.item.id));
            return true;
        } else {
            return false;
        }
    }

    protected unsetMiscData() {
        if (this.feedsMiscDatas[this.currentFeed.id]) {
            this.store.dispatch(this.datasetsAction.feedUnsetMiscData(toFeedReference(this.currentFeed), this.feedsMiscDatas[this.currentFeed.id].id));
            return true;
        } else {
            return false;
        }
    }

    protected createMiscData() {
        this.store.dispatch(this.datasetsAction.feedCreateMiscData(toFeedReference(this.currentFeed), this.newLicenseOrMiscData.name, this.newLicenseOrMiscData.itemFile.file));
    }

    protected onSubmitLicense() {
        switch (this.newLicenseOrMiscData.type) {
            case 'no':
                this.unsetLicense();
                break;
            case 'custom':
                this.createLicense();
                break;
            case 'new':
                this.setLicense();
                break;
            default:
                break;
        }
    }

    protected onSubmitMiscData() {
        switch (this.newLicenseOrMiscData.type) {
            case 'no':
                this.unsetMiscData();
                break;
            case 'custom':
                this.createMiscData();
                break;
            case 'new':
                this.setMiscData();
                break;
            default:
                break;
        }
    }

    protected togglePublic(feed: IFeed) {
        let value = !feed.isPublic;
        this.store.dispatch(this.datasetsAction.feedSetPublic(toFeedReference(feed), value));
        return false;
    }

    protected setName(feed, event: InlineEditEvent<string>) {
        this.confirmEditById.set('setName' + feed.id, event.confirm$)
        this.store.dispatch(this.datasetsAction.feedSetName(toFeedReference(feed), event.value));
    }

    protected processConfirm(idx: string) {
        let confirmEdit = this.confirmEditById.get(idx)
        if (confirmEdit) {
            confirmEdit.emit(true);
            this.confirmEditById.delete(idx)
        }
    }

}

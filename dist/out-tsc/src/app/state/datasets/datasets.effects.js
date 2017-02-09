var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Injectable } from "@angular/core";
import { Effect, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DatasetsActionType, DatasetsActions } from "./datasets.actions";
import { FeedsApiService } from "../../commons/services/api/feedsApi.service";
import { ProjectsApiService } from "../../commons/services/api/projectsApi.service";
import { UsersApiService } from "../../commons/services/api/usersApi.service";
export var DatasetsEffects = (function () {
    function DatasetsEffects(actions$, action, feedsApi, projectsApi, usersApi, store) {
        var _this = this;
        this.actions$ = actions$;
        this.action = action;
        this.feedsApi = feedsApi;
        this.projectsApi = projectsApi;
        this.usersApi = usersApi;
        this.store = store;
        this.USER_SUBSCRIBE$ = this.actions$
            .ofType(DatasetsActionType.USER_SUBSCRIBE)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var userSubscribeParams = payload.userSubscribeParams;
            return _this.usersApi.subscribe(userSubscribeParams)
                .map(function () { return _this.action.userSubscribeSuccess(userSubscribeParams); })
                .catch(function (e) { return Observable.of(_this.action.userSubscribeFail(userSubscribeParams, e)); });
        }).share();
        this.UPDATE_PROJECT$ = this.actions$
            .ofType(DatasetsActionType.UPDATE_PROJECT)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var projectId = payload.projectId;
            var updateProject = payload.updateProject;
            return _this.projectsApi.updateProject(updateProject, projectId)
                .map(function (project) { return _this.action.updateProjectSuccess(project); })
                .catch(function (e) { return Observable.of(_this.action.updateProjectFail(projectId, updateProject, e)); });
        }).share();
        this.FEEDS_GET$ = this.actions$
            .ofType(DatasetsActionType.FEEDS_GET)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedsGetParams = payload.feedsGetParams;
            return _this.feedsApi.getList(feedsGetParams)
                .map(function (feeds) { return _this.action.feedsGetSuccess(feeds); })
                .catch(function (e) { return Observable.of(_this.action.feedsGetFail(feedsGetParams, e)); });
        }).share();
        this.FEEDS_GET_LOCALLY$ = this.actions$
            .ofType(DatasetsActionType.FEEDS_GET_LOCALLY)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedsGetParams = payload.feedsGetParams;
            var feeds = payload.feeds;
            var feedsResponse = {
                feeds: feeds
            };
            return Observable.of(_this.action.feedsGetSuccess(feedsResponse));
        }).share();
        this.FEED_CREATE$ = this.actions$
            .ofType(DatasetsActionType.FEED_CREATE)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var createFeed = payload.createFeed;
            return _this.createProjectAndFeedAndSetFile(createFeed, function (progressInfo) {
                _this.store.dispatch(_this.action.feedCreateProgress(createFeed, progressInfo));
            }).map(function (feed) { return _this.action.feedCreateSuccess(createFeed, feed); }).catch(function (e) { return Observable.of(_this.action.feedCreateFail(createFeed, e)); });
        }).share();
        /*
        @Effect() ADD_FEED_TO_PROJECT$: Observable<Action> = this.actions$
        .ofType(DatasetsActionType.ADD_FEED_TO_PROJECT)
        .map(action => action.payload)
        .switchMap(payload => {
            const createFeed = payload.createFeed;
            return this.addFeedToProject(createFeed, progressInfo => {
            this.store.dispatch(this.action.feedCreateProgress(createFeed, progressInfo))
            })
            .map(feed => this.action.addFeedToProjectSuccess(feed))
            .catch(e => Observable.of(this.action.addFeedToProjectFail(createFeed, e)))
        }).share();
        */
        this.SET_PUBLIC$ = this.actions$
            .ofType(DatasetsActionType.FEED_SET_PUBLIC)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var isPublic = payload.isPublic;
            return _this.feedsApi.setPublic(feedRef.feedsourceId, isPublic)
                .map(function (updatedFeed) { return _this.action.feedSetPublicSuccess(updatedFeed); })
                .catch(function (e) { return Observable.of(_this.action.feedSetPublicFail(feedRef, e)); });
        }).share();
        this.FEED_ADD_NOTES$ = this.actions$
            .ofType(DatasetsActionType.FEEDS_ADD_NOTES)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            return _this.feedsApi.addNotes(payload.feedId, payload.data)
                .map(function (data) { return _this.action.feedAddNotesSuccess(payload.feedId, payload.data); })
                .catch(function (e) { return Observable.of(_this.action.feedAddNotesFail(payload.feedId, payload.data, e)); });
        }).share();
        this.SUBSCRIBE_FEED$ = this.actions$
            .ofType(DatasetsActionType.SUBSCRIBE_FEED)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            return _this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(function (updatedUser) { return _this.action.subscribeToFeedSuccess(updatedUser); })
                .catch(function (e) { return Observable.of(_this.action.subscribeToFeedFail(payload.userInfos, e)); });
        }).share();
        this.UNSUBSCRIBE_FEED$ = this.actions$
            .ofType(DatasetsActionType.UNSUBSCRIBE_FEED)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            return _this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(function (updatedUser) { return _this.action.unsubscribeToFeedSuccess(updatedUser); })
                .catch(function (e) { return Observable.of(_this.action.unsubscribeToFeedFail(payload.userInfos, e)); });
        }).share();
        this.FEED_SET_NAME$ = this.actions$
            .ofType(DatasetsActionType.FEED_SET_NAME)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var name = payload.name;
            return _this.feedsApi.setName(feedRef.feedsourceId, name)
                .map(function (updatedFeed) { return _this.action.feedSetNameSuccess(updatedFeed); })
                .catch(function (e) {
                return Observable.of(_this.action.feedSetNameFail(feedRef, e));
            });
        }).share();
        this.FEED_SET_FILE$ = this.actions$
            .ofType(DatasetsActionType.FEED_SET_FILE)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var file = payload.file;
            var setFile$ = Observable.create(function (obs$) {
                _this.feedsApi.setFile(feedRef.feedsourceId, file).subscribe(function (progress) {
                    var progressInfo = "uploading... " + progress + "%";
                    _this.store.dispatch(_this.action.feedSetFileProgress(feedRef, progressInfo));
                }, function (e) { return obs$.error(e); }, function () { return obs$.next(); });
            });
            return setFile$
                .switchMap(function () { return _this.feedsApi.get(feedRef.feedsourceId); })
                .map(function (feed) { return _this.action.feedSetFileSuccess(feed); })
                .catch(function (e) { return Observable.of(_this.action.feedSetFileFail(feedRef, e)); });
        }).share();
        this.FEED_DELETE$ = this.actions$
            .ofType(DatasetsActionType.FEED_DELETE)
            .map(function (action) { return action.payload; })
            .map(function (payload) {
            var feedRefs = payload.feedRefs;
            var feedRefsFailed = [];
            var errors = [];
            var nbSuccess = 0;
            feedRefs.forEach(function (feedRef) {
                console.log('deleting ' + nbSuccess + '/' + feedRefs.length, feedRef);
                _this.feedsApi.delete(feedRef.feedsourceId).subscribe(function () {
                    console.log('delete success');
                    nbSuccess++;
                }, function (e) {
                    console.log('delete failed', e);
                    feedRefsFailed.push(feedRef);
                    errors.push(e);
                });
            });
            if (feedRefsFailed.length == 0) {
                return _this.action.feedDeleteSuccess(feedRefs);
            }
            else {
                return _this.action.feedDeleteFail(feedRefsFailed, errors);
            }
        }).share();
        this.FEED_FETCH$ = this.actions$
            .ofType(DatasetsActionType.FEED_FETCH)
            .map(function (action) { return action.payload; })
            .switchMap(function (payload) {
            var feedRef = payload.feedRef;
            return _this.feedsApi.fetch(feedRef.feedsourceId)
                .switchMap(function () { return _this.feedsApi.get(feedRef.feedsourceId); })
                .map(function (feedApi) { return _this.action.feedFetchSuccess(feedApi); })
                .catch(function (e) {
                return Observable.of(_this.action.feedFetchFail(feedRef, e));
            });
        }).share();
        this.CONFIRM_DELETE_FEED$ = this.actions$
            .ofType(DatasetsActionType.CONFIRM_DELETE_FEED)
            .map(function (action) { return action.payload; })
            .map(function (payload) {
            return _this.action.confirmationDeleteProjectSuccess();
        }).share();
    }
    /*
    private addFeedToProject(createFeed: ICreateFeed, onProgress): Observable<IFeedApi> {
    return Observable.create(obs$ => {
        onProgress("creating feed")
        this.feedsApi.create(createFeed.feedName, createFeed.isPublic).subscribe(feed => {
        console.log("created feed:", feed);
        onProgress("uploading...")
        let setFile$ = this.feedsApi.setFile(feed.id, createFeed.file);
        setFile$.subscribe(progress => {
                    console.log('setFile progress', progress)
                    onProgress("uploading... " + progress + "%")
                }, err => {
                    console.log('setFile error', err);
                    obs$.error(err);
                }, () => {
                    console.log('setFile complete')
                    obs$.next(feed);
                    obs$.complete();
                });
        return setFile$;
        }, err => {
        console.log('feed creation error', err);
        obs$.error(err);
            });
    });
    }
    */
    // TODO. ADD LICENCE SETTING
    DatasetsEffects.prototype.createProjectAndFeedAndSetFile = function (createFeed, onProgress) {
        var _this = this;
        return Observable.create(function (obs$) {
            onProgress("creating project");
            _this.projectsApi.create(createFeed.projectName).subscribe(function (project) {
                console.log("created project:", project);
                onProgress("creating feed");
                _this.feedsApi.create(createFeed.feedName, project.id, createFeed.isPublic).subscribe(function (feed) {
                    console.log("created feed:", feed);
                    onProgress("uploading...");
                    var setFile$ = _this.feedsApi.setFile(feed.id, createFeed.file);
                    setFile$.subscribe(function (progress) {
                        console.log('setFile progress', progress);
                        onProgress("uploading... " + progress + "%");
                    }, function (err) {
                        console.log('setFile error', err);
                        obs$.error(err);
                    }, function () {
                        console.log('setFile complete');
                        obs$.next(feed);
                        obs$.complete();
                    });
                    return setFile$;
                }, function (err) {
                    console.log('feed creation error', err);
                    obs$.error(err);
                });
            }, function (err) {
                console.log('project creation error', err);
                obs$.error(err);
            });
        });
    };
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "USER_SUBSCRIBE$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "UPDATE_PROJECT$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEEDS_GET$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEEDS_GET_LOCALLY$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_CREATE$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "SET_PUBLIC$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_ADD_NOTES$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "SUBSCRIBE_FEED$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "UNSUBSCRIBE_FEED$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_SET_NAME$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_SET_FILE$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_DELETE$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Observable)
    ], DatasetsEffects.prototype, "FEED_FETCH$", void 0);
    __decorate([
        Effect(), 
        __metadata('design:type', Object)
    ], DatasetsEffects.prototype, "CONFIRM_DELETE_FEED$", void 0);
    DatasetsEffects = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Actions, DatasetsActions, FeedsApiService, ProjectsApiService, UsersApiService, Store])
    ], DatasetsEffects);
    return DatasetsEffects;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/state/datasets/datasets.effects.js.map
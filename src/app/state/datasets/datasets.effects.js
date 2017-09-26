"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import "rxjs/Rx";
var core_1 = require("@angular/core");
var effects_1 = require("@ngrx/effects");
var Observable_1 = require("rxjs/Observable");
var datasets_actions_1 = require("./datasets.actions");
var DatasetsEffects = (function () {
    function DatasetsEffects(actions$, action, feedsApi, licenseApi, projectsApi, usersApi, store) {
        var _this = this;
        this.actions$ = actions$;
        this.action = action;
        this.feedsApi = feedsApi;
        this.licenseApi = licenseApi;
        this.projectsApi = projectsApi;
        this.usersApi = usersApi;
        this.store = store;
        this.USER_SUBSCRIBE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var userSubscribeParams = payload.userSubscribeParams;
            return _this.usersApi.subscribe(userSubscribeParams).map(function () { return _this.action.userSubscribeSuccess(userSubscribeParams); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.userSubscribeFail(userSubscribeParams, e)); });
        }).share();
        this.UPDATE_PROJECT$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.UPDATE_PROJECT)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var projectId = payload.projectId;
            var updateProject = payload.updateProject;
            return _this.projectsApi.updateProject(updateProject, projectId).map(function (project) { return _this.action.updateProjectSuccess(project); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.updateProjectFail(projectId, updateProject, e)); });
        }).share();
        this.FEEDS_GET$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEEDS_GET)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedsGetParams = payload.feedsGetParams;
            return _this.feedsApi.getList(feedsGetParams)
                .map(function (feeds) { return _this.action.feedsGetSuccess(feeds); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedsGetFail(feedsGetParams, e)); });
        }).share();
        this.FEEDS_GET_LOCALLY$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEEDS_GET_LOCALLY)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedsGetParams = payload.feedsGetParams;
            var feeds = payload.feeds;
            var feedsResponse = {
                feeds: feeds
            };
            return Observable_1.Observable.of(_this.action.feedsGetSuccess(feedsResponse));
        }).share();
        this.FEED_CREATE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var createFeed = payload.createFeed;
            return _this.createProjectAndFeedAndSetFile(createFeed, function (progressInfo) {
                _this.store.dispatch(_this.action.feedCreateProgress(createFeed, progressInfo));
            }).map(function (feed) { return _this.action.feedCreateSuccess(createFeed, feed); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedCreateFail(createFeed, e)); });
        }).share();
        this.SET_PUBLIC$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_PUBLIC)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var isPublic = payload.isPublic;
            return _this.feedsApi.setPublic(feedRef.feedsourceId, isPublic)
                .map(function (updatedFeed) { return _this.action.feedSetPublicSuccess(updatedFeed); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedSetPublicFail(feedRef, e)); });
        }).share();
        this.FEED_ADD_NOTES$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEEDS_ADD_NOTES)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            return _this.feedsApi.addNotes(payload.feedId, payload.data)
                .map(function (data) { return _this.action.feedAddNotesSuccess(payload.feedId, payload.data); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedAddNotesFail(payload.feedId, payload.data, e)); });
        }).share();
        this.SUBSCRIBE_FEED$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.SUBSCRIBE_FEED)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            return _this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(function (updatedUser) { return _this.action.subscribeToFeedSuccess(updatedUser); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.subscribeToFeedFail(payload.userInfos, e)); });
        }).share();
        this.UNSUBSCRIBE_FEED$ = this.actions$
            .ofType(datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED).map(function (action) { return action.payload; }).switchMap(function (payload) {
            return _this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(function (updatedUser) { return _this.action.unsubscribeToFeedSuccess(updatedUser); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.unsubscribeToFeedFail(payload.userInfos, e)); });
        }).share();
        this.FEED_SET_NAME$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_NAME)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var name = payload.name;
            return _this.feedsApi.setName(feedRef.feedsourceId, name)
                .map(function (updatedFeed) { return _this.action.feedSetNameSuccess(updatedFeed); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedSetNameFail(feedRef, e));
            });
        }).share();
        this.FEED_SET_FILE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_SET_FILE)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var file = payload.file;
            var setFile$ = Observable_1.Observable.create(function (obs$) {
                _this.feedsApi.setFile(feedRef.feedsourceId, file).subscribe(function (progress) {
                    var progressInfo = 'uploading... ' + progress + '%';
                    _this.store.dispatch(_this.action.feedSetFileProgress(feedRef, progressInfo));
                }, function (e) { return obs$.error(e); }, function () { return obs$.next(); });
            });
            return setFile$
                .switchMap(function () { return _this.feedsApi.getFeed(feedRef.feedsourceId, false); })
                .map(function (feed) { return _this.action.feedSetFileSuccess(feed); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedSetFileFail(feedRef, e)); });
        }).share();
        this.FEED_DELETE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE)
            .map(function (action) { return action.payload; }).map(function (payload) {
            var feedRefs = payload.feedRefs;
            var feedRefsFailed = [];
            var errors = [];
            var nbSuccess = 0;
            feedRefs.forEach(function (feedRef) {
                console.log('deleting ' + nbSuccess + '/' + feedRefs.length, feedRef);
                _this.feedsApi["delete"](feedRef.feedsourceId, feedRef.versionId).subscribe(function () {
                    console.log('delete success');
                    feedRef.feedVersionCount -= 1;
                    nbSuccess++;
                }, function (e) {
                    console.log('delete failed', e);
                    feedRefsFailed.push(feedRef);
                    errors.push(e);
                });
            });
            if (feedRefsFailed.length === 0) {
                return _this.action.feedDeleteSuccess(feedRefs);
            }
            else {
                return _this.action.feedDeleteFail(feedRefsFailed, errors);
            }
        }).share();
        this.FEED_FETCH$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_FETCH)
            .map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            return _this.feedsApi.fetch(feedRef.feedsourceId)
                .switchMap(function () { return _this.feedsApi.getFeed(feedRef.feedsourceId); })
                .map(function (feedApi) { return _this.action.feedFetchSuccess(feedApi); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedFetchFail(feedRef, e));
            });
        }).share();
        this.CONFIRM_DELETE_FEED$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.CONFIRM_DELETE_FEED)
            .map(function (action) { return action.payload; }).map(function (payload) {
            return _this.action.confirmationDeleteProjectSuccess();
        }).share();
        this.FEED_CHANGE_LICENSE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_LICENSE).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var licenseId = payload.licenseId;
            return _this.licenseApi.setLicense([feedRef.feedsourceId], licenseId)
                .map(function (license) { return _this.action.feedSetLicenseSuccess(license); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedSetLicenseFail(feedRef, e));
            });
        }).share();
        this.FEED_UNSET_LICENSE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_LICENSE).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var licenseId = payload.licenseId;
            console.log(feedRef.feedsourceId, licenseId);
            return _this.licenseApi.unsetLicense([feedRef.feedsourceId], licenseId)
                .map(function (license) { return _this.action.feedSetLicenseSuccess(license); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedSetLicenseFail(feedRef, e));
            });
        }).share();
        this.FEED_CREATE_LICENSE$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_LICENSE).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            return _this.createLicenseOrMiscDataAndSetFile(feedRef, payload.licenseName, payload.licenseFile, true)
                .map(function (license) { return _this.action.feedCreateLicenseSuccess(license); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedCreateLicenseFail(feedRef, e)); });
        }).share();
        this.FEED_CHANGE_MISCDATA$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CHANGE_MISCDATA).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var licenseId = payload.licenseId;
            return _this.licenseApi.setMiscData([feedRef.feedsourceId], licenseId)
                .map(function (license) { return _this.action.feedSetMiscDataSuccess(license); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedSetMiscDataFail(feedRef, e));
            });
        }).share();
        this.FEED_UNSET_MISCDATA$ = this.actions$.
            ofType(datasets_actions_1.DatasetsActionType.FEED_UNSET_MISCDATA).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            var licenseId = payload.licenseId;
            console.log(feedRef.feedsourceId, licenseId);
            return _this.licenseApi.unsetMiscData([feedRef.feedsourceId], licenseId)
                .map(function (license) { return _this.action.feedSetMiscDataSuccess(license); })["catch"](function (e) {
                return Observable_1.Observable.of(_this.action.feedSetMiscDataFail(feedRef, e));
            });
        }).share();
        this.FEED_CREATE_MISCDATA$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_CREATE_MISCDATA).map(function (action) { return action.payload; }).switchMap(function (payload) {
            var feedRef = payload.feedRef;
            return _this.createLicenseOrMiscDataAndSetFile(feedRef, payload.licenseFile
                ? payload.licenseFile.name : null, payload.licenseFile, false)
                .map(function (license) { return _this.action.feedCreateMiscDataSuccess(license); })["catch"](function (e) { return Observable_1.Observable.of(_this.action.feedCreateMiscDataFail(feedRef, e)); });
        }).share();
        this.FEED_DELETE_LICENSES$ = this.actions$.
            ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE_LICENSES).map(function (action) { return action.payload; }).map(function (payload) {
            var licenses = payload.licenses;
            var failedLicenses = [];
            var errors = [];
            var nbSuccess = 0;
            var keys = Object.keys(licenses);
            keys.forEach(function (key) {
                console.log('deleting ' + nbSuccess + '/' + keys.length, key, licenses[key]);
                _this.licenseApi.unsetLicense(licenses[key], key).subscribe(function () {
                    console.log('delete success');
                    nbSuccess++;
                }, function (e) {
                    console.log('delete failed', e);
                    failedLicenses.push(key);
                    errors.push(e);
                });
            });
            if (failedLicenses.length === 0) {
                return _this.action.feedDeleteLicensesSuccess(licenses);
            }
            else {
                return _this.action.feedDeleteLicensesFail(failedLicenses, errors);
            }
        }).share();
        this.FEED_DELETE_MISCS$ = this.actions$.ofType(datasets_actions_1.DatasetsActionType.FEED_DELETE_MISCS).map(function (action) { return action.payload; }).map(function (payload) {
            var miscs = payload.miscs;
            var failedMiscs = [];
            var errors = [];
            var nbSuccess = 0;
            var keys = Object.keys(miscs);
            var failedCb = function (e, key) {
                console.log('delete failed', e);
                failedMiscs.push(key);
                errors.push(e);
            };
            keys.forEach(function (key) {
                console.log('deleting ' + nbSuccess + '/' + keys.length, key, miscs[key]);
                // remove the miscdata from the list
                _this.licenseApi.unsetMiscData(miscs[key], key).subscribe(function () {
                    // delete the miscdata file
                    _this.licenseApi.deletMiscData(key).subscribe(function () {
                        console.log('delete success');
                        nbSuccess++;
                    }, function (e) {
                        failedCb(e, key);
                    });
                }, function (e) {
                    failedCb(e, key);
                });
            });
            if (failedMiscs.length === 0) {
                return _this.action.feedDeleteMiscsSuccess(miscs);
            }
            else {
                return _this.action.feedDeleteMiscsFail(failedMiscs, errors);
            }
        }).share();
    }
    DatasetsEffects.prototype.createLicenseOrMiscDataAndSetFile = function (feed, licenseName, licenseFile, license) {
        var myobservable;
        if (!licenseName || !licenseFile) {
            myobservable = Observable_1.Observable.create(function (observer) {
                observer.error(new Error('license name or file empty'));
            });
        }
        else {
            var listener = void 0;
            var type = void 0;
            if (license) {
                listener = this.licenseApi.createLicense(licenseName, licenseFile, [feed.feedsourceId]);
                type = 'createLicense';
            }
            else {
                listener = this.licenseApi.createMiscData(licenseName, licenseFile, [feed.feedsourceId]);
                type = 'createMiscData';
            }
            myobservable = this.createObservable(listener, type, null, feed);
        }
        return myobservable;
    };
    DatasetsEffects.prototype.createObservable = function (listener, type, onProgress, nextValue) {
        var myobservable = Observable_1.Observable.create(function (observer) {
            listener.subscribe(function (progress) {
                console.log(type + ' progress', progress);
                if (onProgress) {
                    if (!isNaN(progress)) {
                        onProgress(type + ' uploading... ' + progress + '%');
                    }
                    else {
                        onProgress(type + ' uploading... ');
                    }
                }
            }, function (err) {
                console.log(type + ' error', err);
                observer.error(err);
            }, function () {
                console.log(type + ' complete');
                observer.next(nextValue);
                observer.complete();
            });
        });
        return myobservable;
    };
    // TODO. ADD LICENSE SETTING
    DatasetsEffects.prototype.createProjectAndFeedAndSetFile = function (createFeed, onProgress) {
        var _this = this;
        return Observable_1.Observable.create(function (obs$) {
            onProgress('creating project');
            console.log('createFeed', createFeed);
            _this.projectsApi.create(createFeed.projectName).subscribe(function (project) {
                console.log('created project:', project);
                onProgress('creating feed');
                _this.feedsApi.create(createFeed, project.id).subscribe(function (feed) {
                    console.log('created feed:', feed);
                    onProgress('uploading...');
                    var allObs = [];
                    if (createFeed.retrievalMethod === 'MANUALLY_UPLOADED') {
                        allObs.push(_this.feedsApi.setFile(feed.id, createFeed.file));
                    }
                    if (createFeed.licenseFile && createFeed.licenseName) {
                        var createLicense = _this.licenseApi.createLicense(createFeed.licenseName, createFeed.licenseFile, [feed.id]);
                        allObs.push(_this.createObservable(createLicense, 'createLicense', onProgress, feed));
                    }
                    else if (createFeed.licenseId) {
                        allObs.push(_this.createObservable(_this.licenseApi.setLicense([feed.id], createFeed.licenseId), 'setLicense', onProgress, feed));
                    }
                    if (createFeed.metadataFile) {
                        var createMetadata = _this.licenseApi.createMiscData(createFeed.metadataFile.name, createFeed.metadataFile, [feed.id]);
                        allObs.push(_this.createObservable(createMetadata, 'createMetadata', onProgress, feed));
                    }
                    return (Observable_1.Observable.forkJoin(allObs).subscribe(function (data) {
                        obs$.next(feed);
                        obs$.complete();
                    }, function (error) {
                        console.log(error);
                        return obs$.error(error);
                    }, function () {
                        obs$.next(feed);
                        obs$.complete();
                    }));
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
    return DatasetsEffects;
}());
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "USER_SUBSCRIBE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "UPDATE_PROJECT$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEEDS_GET$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEEDS_GET_LOCALLY$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_CREATE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "SET_PUBLIC$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_ADD_NOTES$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "SUBSCRIBE_FEED$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "UNSUBSCRIBE_FEED$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_SET_NAME$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_SET_FILE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_DELETE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_FETCH$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "CONFIRM_DELETE_FEED$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_CHANGE_LICENSE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_UNSET_LICENSE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_CREATE_LICENSE$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_CHANGE_MISCDATA$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_UNSET_MISCDATA$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_CREATE_MISCDATA$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_DELETE_LICENSES$");
__decorate([
    effects_1.Effect()
], DatasetsEffects.prototype, "FEED_DELETE_MISCS$");
DatasetsEffects = __decorate([
    core_1.Injectable()
], DatasetsEffects);
exports.DatasetsEffects = DatasetsEffects;

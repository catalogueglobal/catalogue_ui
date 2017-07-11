//import "rxjs/Rx";
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
    ProjectsApiService,
    UserSubscribeParams,
    UsersApiService,
    FeedsApiService,
    FeedsGetParams,
    IFeed,
    FeedsGetResponse,
    ILicense,
    IFeedReference,
    ICreateFeed } from 'app/modules/common/';
import { DatasetsActionType, DatasetsActions } from './datasets.actions';
import { DatasetsState } from './datasets.reducer';

@Injectable()
export class DatasetsEffects {

    constructor(private actions$: Actions,
        private action: DatasetsActions,
        private feedsApi: FeedsApiService,
        private projectsApi: ProjectsApiService,
        private usersApi: UsersApiService,
        private store: Store<DatasetsState>) {
    }

    @Effect() USER_SUBSCRIBE$: Observable<Action> = this.actions$.ofType(DatasetsActionType.USER_SUBSCRIBE)
        .map(action => action.payload).switchMap(
        payload => {
            const userSubscribeParams: UserSubscribeParams = payload.userSubscribeParams;
            return this.usersApi.subscribe(userSubscribeParams).map(() => this.action.userSubscribeSuccess(
                userSubscribeParams)).catch(e => Observable.of(this.action.userSubscribeFail(userSubscribeParams, e)));
        }
        ).share();

    @Effect() UPDATE_PROJECT$: Observable<Action> = this.actions$.ofType(DatasetsActionType.UPDATE_PROJECT)
        .map(action => action.payload).switchMap(
        payload => {
            const projectId: string = payload.projectId;
            const updateProject: any = payload.updateProject;
            return this.projectsApi.updateProject(updateProject, projectId).map(
                project => this.action.updateProjectSuccess(project))
                .catch(e => Observable.of(this.action.updateProjectFail(projectId, updateProject, e)));
        }
        ).share();

    @Effect() FEEDS_GET$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEEDS_GET)
        .map(action => action.payload).switchMap(
        payload => {
            const feedsGetParams: FeedsGetParams = payload.feedsGetParams;
            return this.feedsApi.getList(feedsGetParams)
                .map(feeds => this.action.feedsGetSuccess(feeds))
                .catch(e => Observable.of(this.action.feedsGetFail(feedsGetParams, e)));
        }
        ).share();

    @Effect() FEEDS_GET_LOCALLY$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEEDS_GET_LOCALLY)
        .map(action => action.payload).switchMap(
        payload => {
            const feedsGetParams: FeedsGetParams = payload.feedsGetParams;
            const feeds: IFeed[] = payload.feeds;
            let feedsResponse: FeedsGetResponse = {
                feeds: feeds
            };
            return Observable.of(this.action.feedsGetSuccess(feedsResponse));
        }
        ).share();

    @Effect() FEED_CREATE$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_CREATE)
        .map(action => action.payload).switchMap(
        payload => {
            const createFeed = payload.createFeed;
            return this.createProjectAndFeedAndSetFile(createFeed, progressInfo => {
                this.store.dispatch(this.action.feedCreateProgress(createFeed, progressInfo));
            }).map(feed => this.action.feedCreateSuccess(createFeed, feed)).catch(
                e => Observable.of(this.action.feedCreateFail(createFeed, e)));
        }
        ).share();

    @Effect() SET_PUBLIC$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_SET_PUBLIC)
        .map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const isPublic = payload.isPublic;
            return this.feedsApi.setPublic(feedRef.feedsourceId, isPublic)
                .map(updatedFeed => this.action.feedSetPublicSuccess(updatedFeed))
                .catch(e => Observable.of(this.action.feedSetPublicFail(feedRef, e)));
        }
        ).share();

    @Effect() FEED_ADD_NOTES$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEEDS_ADD_NOTES)
        .map(action => action.payload).switchMap(
        payload => {
            return this.feedsApi.addNotes(payload.feedId, payload.data)
                .map(data => this.action.feedAddNotesSuccess(payload.feedId, payload.data))
                .catch(e => Observable.of(this.action.feedAddNotesFail(payload.feedId, payload.data, e)));
        }
        ).share();

    @Effect() SUBSCRIBE_FEED$: Observable<Action> = this.actions$.ofType(DatasetsActionType.SUBSCRIBE_FEED)
        .map(action => action.payload).switchMap(
        payload => {
            return this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(updatedUser => this.action.subscribeToFeedSuccess(updatedUser))
                .catch(e => Observable.of(this.action.subscribeToFeedFail(payload.userInfos, e)));
        }
        ).share();

    @Effect() UNSUBSCRIBE_FEED$: Observable<Action> = this.actions$
        .ofType(DatasetsActionType.UNSUBSCRIBE_FEED).map(action => action.payload).switchMap(
        payload => {
            return this.usersApi.updateUser(payload.user_id, payload.userInfos)
                .map(updatedUser => this.action.unsubscribeToFeedSuccess(updatedUser))
                .catch(e => Observable.of(this.action.unsubscribeToFeedFail(payload.userInfos, e)));
        }
        ).share();

    @Effect() FEED_SET_NAME$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_SET_NAME)
        .map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const name = payload.name;
            return this.feedsApi.setName(feedRef.feedsourceId, name)
                .map(updatedFeed => this.action.feedSetNameSuccess(updatedFeed))
                .catch(e => {
                    return Observable.of(this.action.feedSetNameFail(feedRef, e));
                });
        }
        ).share();

    @Effect() FEED_SET_FILE$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_SET_FILE)
        .map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const file = payload.file;
            let setFile$: Observable<any> = Observable.create(obs$ => {
                this.feedsApi.setFile(feedRef.feedsourceId, file).subscribe(progress => {
                    let progressInfo = 'uploading... ' + progress + '%';
                    this.store.dispatch(this.action.feedSetFileProgress(feedRef, progressInfo));
                }, e => obs$.error(e), () => obs$.next());
            });
            return setFile$
                // refresh
                .switchMap(() => this.feedsApi.getFeed(feedRef.feedsourceId, false))
                .map(feed => this.action.feedSetFileSuccess(feed))
                .catch(e => Observable.of(this.action.feedSetFileFail(feedRef, e)));
        }
        ).share();

    @Effect() FEED_DELETE$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_DELETE)
        .map(action => action.payload).map(
        payload => {
            const feedRefs = payload.feedRefs;
            let feedRefsFailed: IFeedReference[] = [];
            let errors: any[] = [];
            let nbSuccess = 0;
            feedRefs.forEach(feedRef => {
                console.log('deleting ' + nbSuccess + '/' + feedRefs.length, feedRef);
                this.feedsApi.delete(feedRef.feedsourceId, feedRef.versionId).subscribe(() => {
                    console.log('delete success');
                    feedRef.feedVersionCount -= 1;
                    nbSuccess++;
                }, e => {
                    console.log('delete failed', e);
                    feedRefsFailed.push(feedRef);
                    errors.push(e);
                });
            });
            if (feedRefsFailed.length === 0) {
                return this.action.feedDeleteSuccess(feedRefs);
            } else {
                return this.action.feedDeleteFail(feedRefsFailed, errors);
            }
        }
        ).share();

    @Effect() FEED_FETCH$: Observable<Action> = this.actions$.ofType(DatasetsActionType.FEED_FETCH)
        .map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            return this.feedsApi.fetch(feedRef.feedsourceId)
                // refresh
                .switchMap(() => this.feedsApi.getFeed(feedRef.feedsourceId))
                .map(feedApi => this.action.feedFetchSuccess(feedApi))
                .catch(e => {
                    return Observable.of(this.action.feedFetchFail(feedRef, e));
                });
        }
        ).share();

    @Effect() CONFIRM_DELETE_FEED$: any = this.actions$.ofType(DatasetsActionType.CONFIRM_DELETE_FEED)
        .map(action => action.payload).map(
        payload => {
            return this.action.confirmationDeleteProjectSuccess();
        }
        ).share();

    @Effect() FEED_CHANGE_LICENSE$: Observable<Action> = this.actions$.ofType
        (DatasetsActionType.FEED_CHANGE_LICENSE).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const licenseId = payload.licenseId;

            return this.feedsApi.setLicense([feedRef.feedsourceId], licenseId)
                .map(license => this.action.feedSetLicenseSuccess(license))
                .catch(e => {
                    return Observable.of(this.action.feedSetLicenseFail(feedRef, e));
                });
        }
        ).share();

    @Effect() FEED_UNSET_LICENSE$: Observable<Action> = this.actions$.ofType
        (DatasetsActionType.FEED_UNSET_LICENSE).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const licenseId = payload.licenseId;
            console.log(feedRef.feedsourceId, licenseId);

            return this.feedsApi.unsetLicense([feedRef.feedsourceId], licenseId)
                .map(license => this.action.feedSetLicenseSuccess(license))
                .catch(e => {
                    return Observable.of(this.action.feedSetLicenseFail(feedRef, e));
                });
        }
        ).share();

    @Effect() FEED_CREATE_LICENSE$: Observable<Action> = this.actions$.ofType
        (DatasetsActionType.FEED_CREATE_LICENSE).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            return this.createLicenseOrMiscDataAndSetFile(feedRef, payload.licenseName, payload.licenseFile, true)
                .map(license => this.action.feedCreateLicenseSuccess(license)).catch(
                e => Observable.of(this.action.feedCreateLicenseFail(feedRef, e)));
        }
        ).share();

    @Effect() FEED_CHANGE_MISCDATA$: Observable<Action> = this.actions$.ofType
        (DatasetsActionType.FEED_CHANGE_MISCDATA).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const licenseId = payload.licenseId;

            return this.feedsApi.setMiscData([feedRef.feedsourceId], licenseId)
                .map(license => this.action.feedSetMiscDataSuccess(license))
                .catch(e => {
                    return Observable.of(this.action.feedSetMiscDataFail(feedRef, e));
                });
        }
        ).share();

    @Effect() FEED_UNSET_MISCDATA$: Observable<Action> = this.actions$.
        ofType(DatasetsActionType.FEED_UNSET_MISCDATA).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            const licenseId = payload.licenseId;
            console.log(feedRef.feedsourceId, licenseId);

            return this.feedsApi.unsetMiscData([feedRef.feedsourceId], licenseId)
                .map(license => this.action.feedSetMiscDataSuccess(license))
                .catch(e => {
                    return Observable.of(this.action.feedSetMiscDataFail(feedRef, e));
                });
        }
        ).share();

    @Effect() FEED_CREATE_MISCDATA$: Observable<Action> = this.actions$.ofType(
        DatasetsActionType.FEED_CREATE_MISCDATA).map(action => action.payload).switchMap(
        payload => {
            const feedRef = payload.feedRef;
            return this.createLicenseOrMiscDataAndSetFile(feedRef, payload.licenseFile
                ? payload.licenseFile.name : null, payload.licenseFile, false)
                .map(license => this.action.feedCreateMiscDataSuccess(license)).catch(
                e => Observable.of(this.action.feedCreateMiscDataFail(feedRef, e)));
        }
        ).share();

    @Effect() FEED_DELETE_LICENSES$: Observable<Action> = this.actions$.
        ofType(DatasetsActionType.FEED_DELETE_LICENSES).map(action => action.payload).map(
        payload => {
            const licenses = payload.licenses;
            let failedLicenses = [];
            let errors: any[] = [];
            let nbSuccess = 0;
            let keys = Object.keys(licenses);
            keys.forEach(key => {
                console.log('deleting ' + nbSuccess + '/' + keys.length, key, licenses[key]);
                this.feedsApi.unsetLicense(licenses[key], key).subscribe(() => {
                    console.log('delete success');
                    nbSuccess++;
                }, e => {
                    console.log('delete failed', e);
                    failedLicenses.push(key);
                    errors.push(e);
                });
            });

            if (failedLicenses.length === 0) {
                return this.action.feedDeleteLicensesSuccess(licenses);
            } else {
                return this.action.feedDeleteLicensesFail(failedLicenses, errors);
            }
        }
        ).share();

    @Effect() FEED_DELETE_MISCS$: Observable<Action> = this.actions$.ofType
        (DatasetsActionType.FEED_DELETE_MISCS).map(action => action.payload).map(
        payload => {
            const miscs = payload.miscs;
            let failedMiscs = [];
            let errors: any[] = [];
            let nbSuccess = 0;
            let keys = Object.keys(miscs);
            let failedCb = function(e, key) {
                console.log('delete failed', e);
                failedMiscs.push(key);
                errors.push(e);
            };
            keys.forEach(key => {
                console.log('deleting ' + nbSuccess + '/' + keys.length, key, miscs[key]);
                // remove the miscdata from the list
                this.feedsApi.unsetMiscData(miscs[key], key).subscribe(() => {
                    // delete the miscdata file
                    this.feedsApi.deletMiscData(key).subscribe(() => {
                        console.log('delete success');
                        nbSuccess++;
                    }, e => {
                        failedCb(e, key);
                    });
                }, e => {
                    failedCb(e, key);
                });
            });

            if (failedMiscs.length === 0) {
                return this.action.feedDeleteMiscsSuccess(miscs);
            } else {
                return this.action.feedDeleteMiscsFail(failedMiscs, errors);
            }
        }
        ).share();

    private createLicenseOrMiscDataAndSetFile(feed: any, licenseName, licenseFile, license) {
        let myobservable;
        if (!licenseName || !licenseFile) {
            myobservable = Observable.create((observer: any) => {
                observer.error(new Error('license name or file empty'));
            });
        } else {
            let listener;
            let type;
            if (license) {
                listener = this.feedsApi.createLicense(licenseName, licenseFile, [feed.feedsourceId]);
                type = 'createLicense';
            } else {
                listener = this.feedsApi.createMiscData(licenseName, licenseFile, [feed.feedsourceId]);
                type = 'createMiscData';
            }
            myobservable = this.createObservable(listener, type, null, feed);
        }
        return myobservable;
    }

    private createObservable(listener, type, onProgress, nextValue) {
        let myobservable = Observable.create((observer: any) => {
            listener.subscribe(
                progress => {
                    console.log(type + ' progress', progress);
                    if (onProgress) {
                        if (!isNaN(progress)) {
                            onProgress(type + ' uploading... ' + progress + '%');
                        } else {
                            onProgress(type + ' uploading... ');
                        }
                    }
                },
                err => {
                    console.log(type + ' error', err);
                    observer.error(err);
                },
                () => {
                    console.log(type + ' complete');
                    observer.next(nextValue);
                    observer.complete();
                });
        });
        return myobservable;
    }

    // TODO. ADD LICENSE SETTING
    private createProjectAndFeedAndSetFile(createFeed: ICreateFeed, onProgress) {
        return Observable.create(obs$ => {
            onProgress('creating project');
            console.log('createFeed', createFeed);
            this.projectsApi.create(createFeed.projectName).subscribe(
                project => {
                    console.log('created project:', project);
                    onProgress('creating feed');
                    this.feedsApi.create(createFeed, project.id).subscribe(
                        feed => {
                            console.log('created feed:', feed);
                            onProgress('uploading...');
                            let allObs = [];

                            if (createFeed.retrievalMethod === 'MANUALLY_UPLOADED') {
                                allObs.push(this.feedsApi.setFile(feed.id, createFeed.file));
                            }

                            if (createFeed.licenseFile && createFeed.licenseName) {
                                let createLicense = this.feedsApi.createLicense(createFeed.licenseName,
                                    createFeed.licenseFile, [feed.id]);
                                allObs.push(this.createObservable(createLicense, 'createLicense', onProgress, feed));
                            } else if (createFeed.licenseId) {
                                allObs.push(this.createObservable(this.feedsApi.setLicense([feed.id],
                                    createFeed.licenseId), 'setLicense', onProgress, feed));
                            }
                            if (createFeed.metadataFile) {
                                let createMetadata = this.feedsApi.createMiscData(createFeed.metadataFile.name,
                                    createFeed.metadataFile, [feed.id]);
                                allObs.push(this.createObservable(createMetadata, 'createMetadata', onProgress, feed));
                            }
                            return (Observable.forkJoin(allObs).subscribe(
                                data => {
                                    obs$.next(feed);
                                    obs$.complete();
                                },
                                error => {
                                    console.log(error);
                                    return obs$.error(error);
                                },
                                () => {
                                    obs$.next(feed);
                                    obs$.complete();
                                }
                            ));
                        },
                        err => {
                            console.log('feed creation error', err);
                            obs$.error(err);
                        });
                },
                err => {
                    console.log('project creation error', err);
                    obs$.error(err);
                });
        });
    }
}

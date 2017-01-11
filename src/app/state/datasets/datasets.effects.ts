import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Effect, Actions} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {DatasetsActionType, DatasetsActions, IFeedReference} from "./datasets.actions";
import {
  FeedsApiService, FeedsGetParams, IFeedApi, IFeed,
  FeedsGetResponse
} from "../../commons/services/api/feedsApi.service";
import {DatasetsState} from "./datasets.reducer";
import {IProject, ProjectsApiService} from "../../commons/services/api/projectsApi.service";
import {UsersApiService, UserSubscribeParams} from "../../commons/services/api/usersApi.service";

export type ICreateFeed = {
  projectName: string,
  feedName: string,
  isPublic: boolean,
  file: any
}

@Injectable()
export class DatasetsEffects {

  constructor(private actions$: Actions,
              private action: DatasetsActions,
              private feedsApi: FeedsApiService,
              private projectsApi: ProjectsApiService,
              private usersApi: UsersApiService,
              private store: Store<DatasetsState>) {
  }

  @Effect() USER_SUBSCRIBE$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.USER_SUBSCRIBE)
    .map(action => action.payload)
    .switchMap(payload => {
        const userSubscribeParams: UserSubscribeParams = payload.userSubscribeParams;

        return this.usersApi.subscribe(userSubscribeParams)
          .map(() => this.action.userSubscribeSuccess(userSubscribeParams))
          .catch(e => Observable.of(this.action.userSubscribeFail(userSubscribeParams, e)))
      }
    ).share();

  
  @Effect() UPDATE_PROJECT$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.UPDATE_PROJECT)
    .map(action => action.payload)
    .switchMap(payload => {
      const projectId: string = payload.projectId;
      const updateProject: any = payload.updateProject;

      return this.projectsApi.updateProject(updateProject, projectId)
      .map(project => this.action.updateProjectSuccess(project))
      .catch(e => Observable.of(this.action.updateProjectFail(projectId, updateProject, e)))
      }
    ).share();

  @Effect() FEEDS_GET$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEEDS_GET)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedsGetParams: FeedsGetParams = payload.feedsGetParams;

        return this.feedsApi.getList(feedsGetParams)
          .map(feeds => this.action.feedsGetSuccess(feeds))
          .catch(e => Observable.of(this.action.feedsGetFail(feedsGetParams, e)))
      }
    ).share();

  @Effect() FEEDS_GET_LOCALLY$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEEDS_GET_LOCALLY)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedsGetParams: FeedsGetParams = payload.feedsGetParams;
        const feeds: IFeed[] = payload.feeds;

        let feedsResponse: FeedsGetResponse = {
          feeds: feeds
        }
        return Observable.of(this.action.feedsGetSuccess(feedsResponse))
      }
    ).share();

  @Effect() FEED_CREATE$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_CREATE)
    .map(action => action.payload)
    .switchMap(payload => {
        const createFeed = payload.createFeed;

        return this.createProjectAndFeedAndSetFile(createFeed, progressInfo => {
          this.store.dispatch(this.action.feedCreateProgress(createFeed, progressInfo))
        })
          .map(feed => this.action.feedCreateSuccess(createFeed, feed))
          .catch(e => Observable.of(this.action.feedCreateFail(createFeed, e)))
      }
    ).share();

 /* @Effect() ADD_FEED_TO_PROJECT$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.ADD_FEED_TO_PROJECT)
    .map(action => action.payload)
    .switchMap(payload => {
      const createFeed = payload.createFeed;

      return this.addFeedToProject(createFeed, progressInfo => {
        this.store.dispatch(this.action.feedCreateProgress(createFeed, progressInfo))
      })
      .map(feed => this.action.addFeedToProjectSuccess(feed))
      .catch(e => Observable.of(this.action.addFeedToProjectFail(createFeed, e)))
    }
  ).share(); */

  @Effect() SET_PUBLIC$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_SET_PUBLIC)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedRef = payload.feedRef;
        const isPublic = payload.isPublic;

        return this.feedsApi.setPublic(feedRef.feedsourceId, isPublic)
          .map(updatedFeed => this.action.feedSetPublicSuccess(updatedFeed))
          .catch(e => Observable.of(this.action.feedSetPublicFail(feedRef, e)))
      }
    ).share();

  @Effect() SUBSCRIBE_FEED$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.SUBSCRIBE_FEED)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.usersApi.updateUser(payload.user_id, payload.userInfos)
        .map(updatedUser => this.action.subscribeToFeedSuccess(updatedUser))
        .catch(e => Observable.of(this.action.subscribeToFeedFail(payload.userInfos, e)));
    }).share();

  @Effect() UNSUBSCRIBE_FEED$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.UNSUBSCRIBE_FEED)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.usersApi.updateUser(payload.user_id, payload.userInfos)
        .map(updatedUser => this.action.unsubscribeToFeedSuccess(updatedUser))
        .catch(e => Observable.of(this.action.unsubscribeToFeedFail(payload.userInfos, e)));
    }).share();

  @Effect() FEED_SET_NAME$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_SET_NAME)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedRef = payload.feedRef;
        const name = payload.name;

        return this.feedsApi.setName(feedRef.feedsourceId, name)
          .map(updatedFeed => this.action.feedSetNameSuccess(updatedFeed))
          .catch(e => {
            return Observable.of(this.action.feedSetNameFail(feedRef, e))
          })
      }
    ).share();

  @Effect() FEED_SET_FILE$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_SET_FILE)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedRef = payload.feedRef;
        const file = payload.file;

        let setFile$: Observable<any> = Observable.create(obs$ => {
          this.feedsApi.setFile(feedRef.feedsourceId, file).subscribe(progress => {
              let progressInfo = "uploading... " + progress + "%"
              this.store.dispatch(this.action.feedSetFileProgress(feedRef, progressInfo))
            },
            e => obs$.error(e),
            () => obs$.next()
          )
        })
        return setFile$
        // refresh
          .switchMap(() => this.feedsApi.get(feedRef.feedsourceId))
          .map(feed => this.action.feedSetFileSuccess(feed))
          .catch(e => Observable.of(this.action.feedSetFileFail(feedRef, e)))
      }
    ).share()

  @Effect() FEED_DELETE$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_DELETE)
    .map(action => action.payload)
    .map(payload => {
      const feedRefs = payload.feedRefs;
      let feedRefsFailed: IFeedReference[] = [];
      let errors: any[] = [];

      let nbSuccess = 0;
      feedRefs.forEach(feedRef => {
        console.log('deleting ' + nbSuccess + '/' + feedRefs.length, feedRef);
        this.feedsApi.delete(feedRef.feedsourceId).subscribe(()=> {
          console.log('delete success');
          nbSuccess++;
        }, e => {
          console.log('delete failed', e);
          feedRefsFailed.push(feedRef);
          errors.push(e);
        });
      });

      if (feedRefsFailed.length == 0) {
        return this.action.feedDeleteSuccess(feedRefs);
      } else {
        return this.action.feedDeleteFail(feedRefsFailed, errors);
      }
    }).share();


  @Effect() FEED_FETCH$: Observable<Action> = this.actions$
    .ofType(DatasetsActionType.FEED_FETCH)
    .map(action => action.payload)
    .switchMap(payload => {
        const feedRef = payload.feedRef;

        return this.feedsApi.fetch(feedRef.feedsourceId)
        // refresh
          .switchMap(() => this.feedsApi.get(feedRef.feedsourceId))
          .map(feedApi => this.action.feedFetchSuccess(feedApi))
          .catch(e => {
            return Observable.of(this.action.feedFetchFail(feedRef, e))
          })
      }
    ).share();

  @Effect() CONFIRM_DELETE_FEED$: any = this.actions$
    .ofType(DatasetsActionType.CONFIRM_DELETE_FEED)
    .map(action => action.payload)
    .map(payload => {
      return this.action.confirmationDeleteProjectSuccess();
    }).share();
     



  /*private addFeedToProject(createFeed: ICreateFeed, onProgress): Observable<IFeedApi> {
    return Observable.create(obs$ => {
      onProgress("creating feed")
      this.feedsApi.create(createFeed.feedName, createFeed.isPublic).subscribe(feed => {
        console.log("created feed:", feed); 

        onProgress("uploading...")
              let setFile$ = this.feedsApi.setFile(feed.id, createFeed.file);
              setFile$.subscribe(progress => {
                  console.log('setFile progress', progress)
                  onProgress("uploading... " + progress + "%")
                },
                err => {
                  console.log('setFile error', err);
                  obs$.error(err);
                },
                () => {
                  console.log('setFile complete')
                  obs$.next(feed);
                  obs$.complete();
                });
              return setFile$;
      },
      err => {
              console.log('feed creation error', err);
              obs$.error(err);
            });
    });
  } */

  private createProjectAndFeedAndSetFile(createFeed: ICreateFeed, onProgress): Observable<IFeedApi> {
    return Observable.create(obs$ => {

      onProgress("creating project")
      this.projectsApi.create(createFeed.projectName).subscribe(project => {
          console.log("created project:", project);

          onProgress("creating feed")
          this.feedsApi.create(createFeed.feedName, project.id, createFeed.isPublic).subscribe(feed => {
              console.log("created feed:", feed);

              onProgress("uploading...")
              let setFile$ = this.feedsApi.setFile(feed.id, createFeed.file);
              setFile$.subscribe(progress => {
                  console.log('setFile progress', progress)
                  onProgress("uploading... " + progress + "%")
                },
                err => {
                  console.log('setFile error', err);
                  obs$.error(err);
                },
                () => {
                  console.log('setFile complete')
                  obs$.next(feed);
                  obs$.complete();
                });
              return setFile$;
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
    })
  }
}

import {Injectable} from "@angular/core";
import {Action} from "@ngrx/store";
import {FeedsGetResponse, IFeedApi, FeedsGetParams, IFeed} from "../../commons/services/api/feedsApi.service";
import {IProject} from "../../commons/services/api/projectsApi.service";
import {ICreateFeed} from "./datasets.effects";
import {UserSubscribeParams} from "../../commons/services/api/usersApi.service";

export const DatasetsActionType = {

  STATUS_ERROR_MESSAGE: `STATUS_ERROR_MESSAGE`,
  STATUS_CLEAR_NOTIFY_MESSAGE: `STATUS_CLEAR_NOTIFY_MESSAGE`,

  USER_SUBSCRIBE: `USER_SUBSCRIBE`,
  USER_SUBSCRIBE_SUCCESS: `USER_SUBSCRIBE_SUCCESS`,
  USER_SUBSCRIBE_FAIL: `USER_SUBSCRIBE_FAIL`,

  FEEDS_GET: `FEEDS_GET`,
  FEEDS_GET_LOCALLY: `FEEDS_GET_LOCALLY`,
  FEEDS_GET_SUCCESS: `FEEDS_GET_SUCCESS`,
  FEEDS_GET_FAIL: `FEEDS_GET_FAIL`,

  FEED_CREATE: `FEED_CREATE`,
  FEED_CREATE_PROGRESS: `FEED_CREATE_PROGRESS`,
  FEED_CREATE_SUCCESS: `FEED_CREATE_SUCCESS`,
  FEED_CREATE_FAIL: `FEED_CREATE_FAIL`,

  FEED_SET_PUBLIC: `FEED_SET_PUBLIC`,
  FEED_SET_PUBLIC_SUCCESS: `FEED_SET_PUBLIC_SUCCESS`,
  FEED_SET_PUBLIC_FAIL: `FEED_SET_PUBLIC_FAIL`,

  FEED_SET_NAME: `FEED_SET_NAME`,
  FEED_SET_NAME_SUCCESS: `FEED_SET_NAME_SUCCESS`,
  FEED_SET_NAME_FAIL: `FEED_SET_NAME_FAIL`,

  FEED_SET_FILE: `FEED_SET_FILE`,
  FEED_SET_FILE_PROGRESS: `FEED_SET_FILE_PROGRESS`,
  FEED_SET_FILE_SUCCESS: `FEED_SET_FILE_SUCCESS`,
  FEED_SET_FILE_FAIL: `FEED_SET_FILE_FAIL`,

  FEED_DELETE: `FEED_DELETE`,
  FEED_DELETE_SUCCESS: `FEED_DELETE_SUCCESS`,
  FEED_DELETE_FAIL: `FEED_DELETE_FAIL`,

  FEED_FETCH: `FEED_FETCH`,
  FEED_FETCH_SUCCESS: `FEED_FETCH_SUCCESS`,
  FEED_FETCH_FAIL: `FEED_FETCH_FAIL`,

  GET_PUBLIC_PROJECT: `GET_PUBLIC_PROJECT`,
  GET_PRIVATE_PROJECT: `GET_PUBLIC_PROJECT`,
  GET_PUBLIC_PROJECT_SUCCESS: `GET_PUBLIC_PROJECT_SUCCESS`,
  GET_PUBLIC_PROJECT_FAIL: `GET_PUBLIC_PROJECT_FAIL`,
};

export type IFeedReference ={
  feedsourceId: string,
  feedLabel: string
}

export function toFeedReference(feed: IFeedApi): IFeedReference {
  return {
    feedsourceId: feed.id,
    feedLabel: feed.name
  }
}

@Injectable()
export class DatasetsActions {

  statusErrorMessage(errorMessage: string): Action {
    return {
      type: DatasetsActionType.STATUS_ERROR_MESSAGE,
      payload: {
        errorMessage: errorMessage
      }
    }
  }

  statusClearNotifyMessage(): Action {
    return {
      type: DatasetsActionType.STATUS_CLEAR_NOTIFY_MESSAGE
    }
  }

  //

  userSubscribe(userSubscribeParams: UserSubscribeParams): Action {
    return {
      type: DatasetsActionType.USER_SUBSCRIBE,
      payload: {
        userSubscribeParams: userSubscribeParams
      }
    }
  }

  userSubscribeSuccess(userSubscribeParams: UserSubscribeParams): Action {
    return {
      type: DatasetsActionType.USER_SUBSCRIBE_SUCCESS,
      payload: {
        userSubscribeParams: userSubscribeParams
      }
    };
  }

  userSubscribeFail(userSubscribeParams: UserSubscribeParams, error: any): Action {
    return {
      type: DatasetsActionType.USER_SUBSCRIBE_FAIL,
      payload: {
        userSubscribeParams: userSubscribeParams
      }
    }
  }

  //

  feedsGet(feedsGetParams: FeedsGetParams): Action {
    return {
      type: DatasetsActionType.FEEDS_GET,
      payload: {
        feedsGetParams: feedsGetParams
      }
    }
  }

  feedsGetLocally(feedsGetParams: FeedsGetParams, feeds: IFeed[]): Action {
    return {
      type: DatasetsActionType.FEEDS_GET_LOCALLY,
      payload: {
        feedsGetParams: feedsGetParams,
        feeds: feeds
      }
    }
  }


  publicProjectGet(projectGetParams: string) : Action {
    return {
      type: DatasetsActionType.GET_PUBLIC_PROJECT,
      payload: {
        projectGetParams: projectGetParams,
      }
    }
  }

  publicProjectGetSuccess(projectGetResponse: IProject) : Action {
    console.log("PROJECT GET SUCCESS", projectGetResponse);
    return {
      type: DatasetsActionType.GET_PUBLIC_PROJECT_SUCCESS,
      payload: {
        project: projectGetResponse
      }
    }
  }

  publicProjectGetFail(projectGetParams: string, error: any) : Action {
    return {
      type: DatasetsActionType.GET_PUBLIC_PROJECT_FAIL,
      payload: {
        projectGetParams: projectGetParams,
        error: error
      }
    };
  }

  feedsGetSuccess(feedsGetResponse: FeedsGetResponse): Action {
    return {
      type: DatasetsActionType.FEEDS_GET_SUCCESS,
      payload: {
        feedsGetResponse: feedsGetResponse
      }
    };
  }

  feedsGetFail(feedsGetParams: FeedsGetParams, error: any): Action {
    return {
      type: DatasetsActionType.FEEDS_GET_FAIL,
      payload: {
        feedsGetParams: feedsGetParams
      }
    }
  }

  //

  feedCreate(createFeed: ICreateFeed): Action {
    // use filename as default project/feed name
    let defaultName = createFeed.file.name;
    if (!createFeed.projectName || !createFeed.projectName.trim().length) {
      createFeed.projectName = defaultName;
    }
    if (!createFeed.feedName || !createFeed.feedName.trim().length) {
      createFeed.feedName = defaultName;
    }

    return {
      type: DatasetsActionType.FEED_CREATE,
      payload: {
        createFeed: createFeed
      }
    }
  }

  feedCreateProgress(createFeed: ICreateFeed, progress: string): Action {
    return {
      type: DatasetsActionType.FEED_CREATE_PROGRESS,
      payload: {
        createFeed: createFeed,
        progress: progress
      }
    };
  }

  feedCreateSuccess(createFeed: ICreateFeed, feed: IFeedApi): Action {
    return {
      type: DatasetsActionType.FEED_CREATE_SUCCESS,
      payload: {
        createFeed: createFeed,
        feed: feed
      }
    };
  }

  feedCreateFail(createFeed: ICreateFeed, error: any): Action {
    return {
      type: DatasetsActionType.FEED_CREATE_FAIL,
      payload: {
        createFeed: createFeed,
        error: error
      }
    }
  }

  //

  feedSetPublic(feedRef: IFeedReference, value: boolean): Action {
    return {
      type: DatasetsActionType.FEED_SET_PUBLIC,
      payload: {
        feedRef: feedRef,
        isPublic: value
      }
    }
  }

  feedSetPublicSuccess(feed: IFeedApi): Action {
    return {
      type: DatasetsActionType.FEED_SET_PUBLIC_SUCCESS,
      payload: {
        feed: feed
      }
    };
  }

  feedSetPublicFail(feedRef: IFeedReference, error: any): Action {
    return {
      type: DatasetsActionType.FEED_SET_PUBLIC_FAIL,
      payload: {
        feedRef: feedRef,
        error: error
      }
    }
  }

  //

  feedDelete(feedRefs: IFeedReference[]): Action {
    return {
      type: DatasetsActionType.FEED_DELETE,
      payload: {
        feedRefs: feedRefs
      }
    }
  }

  feedDeleteSuccess(feedRefs: IFeedReference[]): Action {
    return {
      type: DatasetsActionType.FEED_DELETE_SUCCESS,
      payload: {
        feedRefs: feedRefs
      }
    };
  }

  feedDeleteFail(feedRefs: IFeedReference[], errors: any[]): Action {
    return {
      type: DatasetsActionType.FEED_DELETE_FAIL,
      payload: {
        feedRefs: feedRefs
      }
    }
  }

  //

  feedSetName(feedRef: IFeedReference, name: string): Action {
    return {
      type: DatasetsActionType.FEED_SET_NAME,
      payload: {
        feedRef: feedRef,
        name: name
      }
    }
  }

  feedSetNameSuccess(feed: IFeedApi): Action {
    return {
      type: DatasetsActionType.FEED_SET_NAME_SUCCESS,
      payload: {
        feed: feed
      }
    };
  }

  feedSetNameFail(feedRef: IFeedReference, error: any): Action {
    return {
      type: DatasetsActionType.FEED_SET_NAME_FAIL,
      payload: {
        feedRef: feedRef,
        error: error
      }
    }
  }

  //

  feedSetFile(feedRef: IFeedReference, file: File): Action {
    return {
      type: DatasetsActionType.FEED_SET_FILE,
      payload: {
        feedRef: feedRef,
        file: file
      }
    }
  }

  feedSetFileProgress(feedRef: IFeedReference, progress: string): Action {
    return {
      type: DatasetsActionType.FEED_SET_FILE_PROGRESS,
      payload: {
        feedRef: feedRef,
        progress: progress
      }
    }
  }

  feedSetFileSuccess(feed: IFeedApi): Action {
    return {
      type: DatasetsActionType.FEED_SET_FILE_SUCCESS,
      payload: {
        feed: feed
      }
    };
  }

  feedSetFileFail(feedRef: IFeedReference, error: any): Action {
    return {
      type: DatasetsActionType.FEED_SET_FILE_FAIL,
      payload: {
        feedRef: feedRef,
        error: error
      }
    }
  }

  //

  feedFetch(feedRef: IFeedReference): Action {
    return {
      type: DatasetsActionType.FEED_FETCH,
      payload: {
        feedRef: feedRef
      }
    }
  }

  feedFetchSuccess(feed: IFeedApi): Action {
    return {
      type: DatasetsActionType.FEED_FETCH_SUCCESS,
      payload: {
        feed: feed
      }
    };
  }

  feedFetchFail(feedRef: IFeedReference, error: any): Action {
    return {
      type: DatasetsActionType.FEED_FETCH_FAIL,
      payload: {
        feedRef: feedRef
      }
    }
  }

  //

}

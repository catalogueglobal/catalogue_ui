import { Action }                                            from "@ngrx/store";
import { FeedsGetResponse, IFeed, IFeedApi, FeedsGetParams } from "../../commons/services/api/feedsApi.service";
import { DatasetsActionType, IFeedReference }                from "./datasets.actions";

export interface DatasetsState {
    status: {
        busyMessage?: string, busyMessageArgs?: any,
        errorMessage?: string, errorMessageArgs?: any,
        notifyMessage?: string, notifyMessageArgs?: any
    },
    feeds: IFeed[],
    feedsGetParams: FeedsGetParams
}

const initialState: DatasetsState = {
    status: {},
    feeds: null,
    feedsGetParams: {
        secure: null,
        sortOrder: null,
        bounds: null
    }
};

function updateFeeds(feeds, updatedFeed) {
    return feeds.map(feed => {
        if (feed.id == updatedFeed.id) {
            Object.assign(feed, updatedFeed); // update feed datas
            console.log('feed updated', feed);
        }
        return feed;
    });
}

function removeFeeds(feeds, feedRefs: IFeedReference[]) {
    const feedsourceIds = feedRefs.map(feedRef => feedRef.feedsourceId);
    return feeds.filter(feed => feedsourceIds.indexOf(feed.id) === -1);
}

export function datasetsReducer(state = initialState, action: Action): DatasetsState {
    const payload = action.payload;

    switch (action.type) {
    case DatasetsActionType.STATUS_ERROR_MESSAGE: {
        const errorMessage = payload.errorMessage;
        return Object.assign({}, state, {
            status: {
                errorMessage: errorMessage
            }
        });
    }
    case DatasetsActionType.STATUS_CLEAR_NOTIFY_MESSAGE: {
        let newState = Object.assign({}, state);
        delete newState.status.notifyMessage;
        return newState;
    }
    case DatasetsActionType.USER_SUBSCRIBE: {
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.USER_SUBSCRIBE"
            }
        });
    }
    case DatasetsActionType.USER_SUBSCRIBE_SUCCESS: {
        return Object.assign({}, state, {
            project: payload.project,
            status: {
                notifyMessage: "state.USER_SUBSCRIBE_SUCCESS"
            },
        });
    }
    case DatasetsActionType.USER_SUBSCRIBE_FAIL: {
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.USER_SUBSCRIBE_FAIL"
            }
        });
    }
    case DatasetsActionType.GET_PUBLIC_PROJECT: {
        return Object.assign({}, state, {
            project: payload.project
        });
    }
    case DatasetsActionType.GET_PUBLIC_PROJECT_SUCCESS: {
        return Object.assign({}, state, {
            project: payload.project
        });
    }
    case DatasetsActionType.UPDATE_PROJECT: {
        return Object.assign({}, state,{
            projectId: payload.projectId,
            updateProject: payload.updateProject
        });
    }
    case DatasetsActionType.UPDATE_PROJECT_SUCCESS: {
        return Object.assign({}, state,{
            project: payload.project
        });
    }
    case DatasetsActionType.UPDATE_PROJECT_FAIL: {
        return Object.assign({}, state, {
            projectId: payload.projectId,
            updateProject: payload.updateProject,
            error: payload.error
        });
    }
    case DatasetsActionType.FEEDS_GET:
    case DatasetsActionType.FEEDS_GET_LOCALLY: {
        const feedsGetParams: FeedsGetParams = payload.feedsGetParams;
        let messageKey = (feedsGetParams.secure ? "state.FEEDS_GET.private" : "state.FEEDS_GET.public");
        return Object.assign({}, state, {
            status: {
                busyMessage: messageKey
            },
            feedsGetParams: feedsGetParams
        });
    }
    case DatasetsActionType.FEEDS_GET_SUCCESS: {
        const response: FeedsGetResponse = payload.feedsGetResponse;
        return Object.assign({}, state, {
            status: {},
            feeds: response.feeds
        });
    }
    case DatasetsActionType.FEEDS_GET_FAIL: {
        const feedsGetParams: FeedsGetParams = payload.feedsGetParams;
        let messageKey = (feedsGetParams.secure ? "state.FEEDS_GET_FAIL.private" : "state.FEEDS_GET_FAIL.public");
        return Object.assign({}, state, {
            status: {
                errorMessage: messageKey
            }
        });
    }
    case DatasetsActionType.FEED_CREATE: {
        const createFeed = payload.createFeed;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_CREATE",
                busyMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.FEED_CREATE_PROGRESS: {
        const createFeed = payload.createFeed;
        const progress = payload.progress;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_CREATE_PROGRESS",
                busyMessageArgs: {feedName: createFeed.feedName, progress: progress}
            }
        });
    }
    case DatasetsActionType.FEED_CREATE_SUCCESS: {
        const createFeed = payload.createFeed;
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_CREATE_SUCCESS",
                notifyMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.FEED_CREATE_FAIL: {
        const createFeed = payload.createFeed;
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_CREATE_FAIL",
                errorMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.ADD_FEED_TO_PROJECT: {
        const createFeed = payload.createFeed;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.ADD_FEED_TO_PROJECT",
                busyMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS: {
        const createFeed = payload.feed;
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.ADD_FEED_TO_PROJECT_SUCCESS",
                notifyMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.ADD_FEED_TO_PROJECT_FAIL: {
        const createFeed = payload.createFeed;
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.ADD_FEED_TO_PROJECT_FAIL",
                notifyMessageArgs: {feedName: createFeed.feedName}
            }
        });
    }
    case DatasetsActionType.FEED_SET_PUBLIC: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_SET_PUBLIC",
                busyMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_SET_PUBLIC_SUCCESS: {
        const updatedFeed: IFeedApi = payload.feed;
        const updatedFeeds = updateFeeds(state.feeds, updatedFeed);
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_SET_PUBLIC_SUCCESS",
                notifyMessageArgs: {feedName: updatedFeed.name}
            },
            feeds: updatedFeeds
        });
    }
    case DatasetsActionType.FEED_SET_PUBLIC_FAIL: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_SET_PUBLIC_FAIL",
                errorMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_SET_NAME: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_SET_NAME",
                busyMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_SET_NAME_SUCCESS: {
        const updatedFeed: IFeedApi = payload.feed;
        const updatedFeeds = updateFeeds(state.feeds, updatedFeed);
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_SET_NAME_SUCCESS",
                notifyMessageArgs: {feedName: updatedFeed.name}
            },
            feeds: updatedFeeds
        });
    }
    case DatasetsActionType.FEED_SET_NAME_FAIL: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_SET_NAME_FAIL",
                errorMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_SET_FILE: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_SET_FILE",
                busyMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_SET_FILE_PROGRESS: {
        const feedRef = payload.feedRef;
        const progress = payload.progress;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_SET_FILE_PROGRESS",
                busyMessageArgs: {feedName: feedRef.feedLabel, progress: progress}
            },
        });
    }
    case DatasetsActionType.FEED_SET_FILE_SUCCESS: {
        const updatedFeed: IFeedApi = payload.feed;
        const updatedFeeds = updateFeeds(state.feeds, updatedFeed);
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_SET_FILE_SUCCESS",
                notifyMessageArgs: {feedName: updatedFeed.name}
            },
            feeds: updatedFeeds
        });
    }
    case DatasetsActionType.FEED_SET_FILE_FAIL: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_SET_FILE_FAIL",
                errorMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_DELETE: {
        const feedRefs: IFeedReference[] = payload.feedRefs;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_DELETE",
                busyMessageArgs: {countFeeds: feedRefs.length}
            },
        });
    }
    case DatasetsActionType.FEED_DELETE_SUCCESS: {
        const feedRefs: IFeedReference[] = payload.feedRefs;
        const updatedFeeds = removeFeeds(state.feeds, feedRefs);
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_DELETE_SUCCESS",
                notifyMessageArgs: {countFeeds: feedRefs.length}
            },
            feeds: updatedFeeds
        });
    }
    case DatasetsActionType.FEED_DELETE_FAIL: {
        const feedRefs: IFeedReference[] = payload.feedRefs;
        const feedLabels = feedRefs.map(feedRef => feedRef.feedLabel);
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_DELETE_FAIL",
                errorMessageArgs: {countFeeds: feedRefs.length, feedLabels: feedLabels}
            },
        });
    }
    case DatasetsActionType.SUBSCRIBE_FEED: {
        const userInfos = payload.userInfos
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.SUBSCRIBE_FEED",
                busyMessageArgs: {userInfos: userInfos}
            },
        });
    }
    case DatasetsActionType.SUBSCRIBE_FEED_SUCCESS: {
        const userInfos = payload.userInfos
        return Object.assign({}, state, {
            status: {
            },
        })
    }
    case DatasetsActionType.SUBSCRIBE_FEED_FAIL: {
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.SUBSCRIBE_FEED_FAIL",
                busyMessageArgs: "Can't subscribe to feed"
            }
        });
    }
    case DatasetsActionType.UNSUBSCRIBE_FEED: {
        const userInfos = payload.userInfos
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.UNSUBSCRIBE_FEED",
                busyMessageArgs: {userInfos: userInfos}
            },
        });
    }
    case DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS: {
        const userInfos = payload.userInfos
        return Object.assign({}, state, {
            status: {
            },
        })
    }
    case DatasetsActionType.UNSUBSCRIBE_FEED_FAIL: {
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.UNSUBSCRIBE_FEED_FAIL",
                busyMessageArgs: "Can't subscribe to feed"
            }
        });
    }
    case DatasetsActionType.FEED_FETCH: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                busyMessage: "state.FEED_FETCH",
                busyMessageArgs: {feedName: feedRef.feedLabel}
            },
        });
    }
    case DatasetsActionType.FEED_FETCH_SUCCESS: {
        const updatedFeed = payload.feed;
        const updatedFeeds = updateFeeds(state.feeds, updatedFeed);
        return Object.assign({}, state, {
            status: {
                notifyMessage: "state.FEED_FETCH_SUCCESS",
                notifyMessageArgs: {feedName: updatedFeed.name}
            },
            feeds: updatedFeeds
        });
    }
    case DatasetsActionType.FEED_FETCH_FAIL: {
        const feedRef = payload.feedRef;
        return Object.assign({}, state, {
            status: {
                errorMessage: "state.FEED_FETCH_FAIL",
                errorMessageArgs: "Feed refresh failed: <i>{{feedName}}</i>"
            },
        });
    }
    case DatasetsActionType.CONFIRM_DELETE_FEED: {
        return Object.assign({}, state, {});
    }
    case DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS: {
        return Object.assign({}, state, {});
    }
    default:
        return state;
    }
}

"use strict";
var datasets_actions_1 = require("./datasets.actions");
var initialState = {
    status: {},
    feeds: [],
    feedsGetParams: {
        secure: null,
        sortOrder: null,
        bounds: null
    }
};
function updateFeeds(feeds, updatedFeed) {
    return feeds.map(function (feed) {
        if (feed.id === updatedFeed.id) {
            Object.assign(feed, updatedFeed); // update feed datas
            console.log('feed updated', feed);
        }
        return feed;
    });
}
function removeFeeds(feeds, feedRefs) {
    var feedsourceIds = feedRefs.map(function (feedRef) { return feedRef.feedsourceId; });
    return feeds.filter(function (feed) { return feedsourceIds.indexOf(feed.id) === -1; });
}
function datasetsReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var payload = action.payload;
    switch (action.type) {
        case datasets_actions_1.DatasetsActionType.STATUS_ERROR_MESSAGE: {
            var errorMessage = payload.errorMessage;
            return Object.assign({}, state, {
                status: {
                    errorMessage: errorMessage
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.STATUS_CLEAR_NOTIFY_MESSAGE: {
            var newState = Object.assign({}, state);
            delete newState.status.notifyMessage;
            return newState;
        }
        case datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE: {
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.USER_SUBSCRIBE'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE_SUCCESS: {
            return Object.assign({}, state, {
                project: payload.project,
                status: {
                    notifyMessage: 'state.USER_SUBSCRIBE_SUCCESS'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.USER_SUBSCRIBE_FAIL: {
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.USER_SUBSCRIBE_FAIL'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.GET_PUBLIC_PROJECT: {
            return Object.assign({}, state, {
                project: payload.project
            });
        }
        case datasets_actions_1.DatasetsActionType.GET_PUBLIC_PROJECT_SUCCESS: {
            return Object.assign({}, state, {
                project: payload.project
            });
        }
        case datasets_actions_1.DatasetsActionType.UPDATE_PROJECT: {
            return Object.assign({}, state, {
                projectId: payload.projectId,
                updateProject: payload.updateProject
            });
        }
        case datasets_actions_1.DatasetsActionType.UPDATE_PROJECT_SUCCESS: {
            return Object.assign({}, state, {
                project: payload.project
            });
        }
        case datasets_actions_1.DatasetsActionType.UPDATE_PROJECT_FAIL: {
            return Object.assign({}, state, {
                projectId: payload.projectId,
                updateProject: payload.updateProject,
                error: payload.error
            });
        }
        case datasets_actions_1.DatasetsActionType.FEEDS_GET:
        case datasets_actions_1.DatasetsActionType.FEEDS_GET_LOCALLY: {
            var feedsGetParams = payload.feedsGetParams;
            var messageKey = (feedsGetParams.secure ? 'state.FEEDS_GET.private' : 'state.FEEDS_GET.public');
            return Object.assign({}, state, {
                status: {
                    busyMessage: messageKey
                },
                feedsGetParams: feedsGetParams
            });
        }
        case datasets_actions_1.DatasetsActionType.FEEDS_GET_SUCCESS: {
            var response = payload.feedsGetResponse;
            return Object.assign({}, state, {
                status: {},
                feeds: response.feeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEEDS_GET_FAIL: {
            var feedsGetParams = payload.feedsGetParams;
            var messageKey = (feedsGetParams.secure ? 'state.FEEDS_GET_FAIL.private' : 'state.FEEDS_GET_FAIL.public');
            return Object.assign({}, state, {
                status: {
                    errorMessage: messageKey
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_CREATE: {
            var createFeed = payload.createFeed;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_CREATE',
                    busyMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_CREATE_PROGRESS: {
            var createFeed = payload.createFeed;
            var progress = payload.progress;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_CREATE_PROGRESS',
                    busyMessageArgs: { feedName: createFeed.feedName, progress: progress }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_CREATE_SUCCESS: {
            var createFeed = payload.createFeed;
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_CREATE_SUCCESS',
                    notifyMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_CREATE_FAIL: {
            var createFeed = payload.createFeed;
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_CREATE_FAIL',
                    errorMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.ADD_FEED_TO_PROJECT: {
            var createFeed = payload.createFeed;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.ADD_FEED_TO_PROJECT',
                    busyMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS: {
            var createFeed = payload.feed;
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.ADD_FEED_TO_PROJECT_SUCCESS',
                    notifyMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.ADD_FEED_TO_PROJECT_FAIL: {
            var createFeed = payload.createFeed;
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.ADD_FEED_TO_PROJECT_FAIL',
                    notifyMessageArgs: { feedName: createFeed.feedName }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_PUBLIC: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_SET_PUBLIC',
                    busyMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_PUBLIC_SUCCESS: {
            var updatedFeed = payload.feed;
            var updatedFeeds = updateFeeds(state.feeds, updatedFeed);
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_SET_PUBLIC_SUCCESS',
                    notifyMessageArgs: { feedName: updatedFeed.name }
                },
                feeds: updatedFeeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_PUBLIC_FAIL: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_SET_PUBLIC_FAIL',
                    errorMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_NAME: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_SET_NAME',
                    busyMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_NAME_SUCCESS: {
            var updatedFeed = payload.feed;
            var updatedFeeds = updateFeeds(state.feeds, updatedFeed);
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_SET_NAME_SUCCESS',
                    notifyMessageArgs: { feedName: updatedFeed.name }
                },
                feeds: updatedFeeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_NAME_FAIL: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_SET_NAME_FAIL',
                    errorMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_FILE: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_SET_FILE',
                    busyMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_FILE_PROGRESS: {
            var feedRef = payload.feedRef;
            var progress = payload.progress;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_SET_FILE_PROGRESS',
                    busyMessageArgs: { feedName: feedRef.feedLabel, progress: progress }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_FILE_SUCCESS: {
            var updatedFeed = payload.feed;
            var updatedFeeds = updateFeeds(state.feeds, updatedFeed);
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_SET_FILE_SUCCESS',
                    notifyMessageArgs: { feedName: updatedFeed.name }
                },
                feeds: updatedFeeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_SET_FILE_FAIL: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_SET_FILE_FAIL',
                    errorMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_DELETE: {
            var feedRefs = payload.feedRefs;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_DELETE',
                    busyMessageArgs: { countFeeds: feedRefs.length }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_DELETE_SUCCESS: {
            var feedRefs = payload.feedRefs;
            var updatedFeeds = removeFeeds(state.feeds, feedRefs);
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_DELETE_SUCCESS',
                    notifyMessageArgs: { countFeeds: feedRefs.length }
                },
                feeds: updatedFeeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_DELETE_FAIL: {
            var feedRefs = payload.feedRefs;
            var feedLabels = feedRefs.map(function (feedRef) { return feedRef.feedLabel; });
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_DELETE_FAIL',
                    errorMessageArgs: { countFeeds: feedRefs.length, feedLabels: feedLabels }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.SUBSCRIBE_FEED: {
            var userInfos = payload.userInfos;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.SUBSCRIBE_FEED',
                    busyMessageArgs: { userInfos: userInfos }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.SUBSCRIBE_FEED_SUCCESS: {
            var userInfos = payload.userInfos;
            return Object.assign({}, state, {
                status: {}
            });
        }
        case datasets_actions_1.DatasetsActionType.SUBSCRIBE_FEED_FAIL: {
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.SUBSCRIBE_FEED_FAIL',
                    busyMessageArgs: 'Can\'t subscribe to feed'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED: {
            var userInfos = payload.userInfos;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.UNSUBSCRIBE_FEED',
                    busyMessageArgs: { userInfos: userInfos }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS: {
            var userInfos = payload.userInfos;
            return Object.assign({}, state, {
                status: {}
            });
        }
        case datasets_actions_1.DatasetsActionType.UNSUBSCRIBE_FEED_FAIL: {
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.UNSUBSCRIBE_FEED_FAIL',
                    busyMessageArgs: 'Can\'t subscribe to feed'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_FETCH: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    busyMessage: 'state.FEED_FETCH',
                    busyMessageArgs: { feedName: feedRef.feedLabel }
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_FETCH_SUCCESS: {
            var updatedFeed = payload.feed;
            var updatedFeeds = updateFeeds(state.feeds, updatedFeed);
            return Object.assign({}, state, {
                status: {
                    notifyMessage: 'state.FEED_FETCH_SUCCESS',
                    notifyMessageArgs: { feedName: updatedFeed.name }
                },
                feeds: updatedFeeds
            });
        }
        case datasets_actions_1.DatasetsActionType.FEED_FETCH_FAIL: {
            var feedRef = payload.feedRef;
            return Object.assign({}, state, {
                status: {
                    errorMessage: 'state.FEED_FETCH_FAIL',
                    errorMessageArgs: 'Feed refresh failed: <i>{{feedName}}</i>'
                }
            });
        }
        case datasets_actions_1.DatasetsActionType.CONFIRM_DELETE_FEED: {
            return Object.assign({}, state, {});
        }
        case datasets_actions_1.DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS: {
            return Object.assign({}, state, {});
        }
        default:
            return state;
    }
}
exports.datasetsReducer = datasetsReducer;

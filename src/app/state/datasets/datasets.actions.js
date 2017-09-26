"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
exports.DatasetsActionType = {
    STATUS_ERROR_MESSAGE: "STATUS_ERROR_MESSAGE",
    STATUS_CLEAR_NOTIFY_MESSAGE: "STATUS_CLEAR_NOTIFY_MESSAGE",
    USER_SUBSCRIBE: "USER_SUBSCRIBE",
    USER_SUBSCRIBE_SUCCESS: "USER_SUBSCRIBE_SUCCESS",
    USER_SUBSCRIBE_FAIL: "USER_SUBSCRIBE_FAIL",
    FEEDS_GET: "FEEDS_GET",
    FEEDS_GET_LOCALLY: "FEEDS_GET_LOCALLY",
    FEEDS_GET_SUCCESS: "FEEDS_GET_SUCCESS",
    FEEDS_GET_FAIL: "FEEDS_GET_FAIL",
    FEED_CREATE: "FEED_CREATE",
    FEED_CREATE_PROGRESS: "FEED_CREATE_PROGRESS",
    FEED_CREATE_SUCCESS: "FEED_CREATE_SUCCESS",
    FEED_CREATE_FAIL: "FEED_CREATE_FAIL",
    FEED_SET_PUBLIC: "FEED_SET_PUBLIC",
    FEED_SET_PUBLIC_SUCCESS: "FEED_SET_PUBLIC_SUCCESS",
    FEED_SET_PUBLIC_FAIL: "FEED_SET_PUBLIC_FAIL",
    FEED_SET_NAME: "FEED_SET_NAME",
    FEED_SET_NAME_SUCCESS: "FEED_SET_NAME_SUCCESS",
    FEED_SET_NAME_FAIL: "FEED_SET_NAME_FAIL",
    FEED_SET_FILE: "FEED_SET_FILE",
    FEED_SET_FILE_PROGRESS: "FEED_SET_FILE_PROGRESS",
    FEED_SET_FILE_SUCCESS: "FEED_SET_FILE_SUCCESS",
    FEED_SET_FILE_FAIL: "FEED_SET_FILE_FAIL",
    FEED_DELETE: "FEED_DELETE",
    FEED_DELETE_SUCCESS: "FEED_DELETE_SUCCESS",
    FEED_DELETE_FAIL: "FEED_DELETE_FAIL",
    FEED_FETCH: "FEED_FETCH",
    FEED_FETCH_SUCCESS: "FEED_FETCH_SUCCESS",
    FEED_FETCH_FAIL: "FEED_FETCH_FAIL",
    GET_PUBLIC_PROJECT: "GET_PUBLIC_PROJECT",
    GET_PRIVATE_PROJECT: "GET_PUBLIC_PROJECT",
    GET_PUBLIC_PROJECT_SUCCESS: "GET_PUBLIC_PROJECT_SUCCESS",
    GET_PUBLIC_PROJECT_FAIL: "GET_PUBLIC_PROJECT_FAIL",
    UPDATE_PROJECT: 'UPDATE_PROJECT',
    UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
    UPDATE_PROJECT_FAIL: 'UPDATE_PROJECT_FAIL',
    ADD_FEED_TO_PROJECT: 'ADD_FEED_TO_PROJECT',
    ADD_FEED_TO_PROJECT_SUCCESS: 'ADD_FEED_TO_PROJECT_SUCCESS',
    ADD_FEED_TO_PROJECT_FAIL: 'ADD_FEED_TO_PROJECT_FAIL',
    CONFIRM_DELETE_FEED: 'CONFIRM_DELETE_FEED',
    CONFIRM_DELETE_FEED_SUCCESS: 'CONFIRM_DELETE_FEED_SUCCESS',
    SUBSCRIBE_FEED: 'SUBSCRIBE_FEED',
    SUBSCRIBE_FEED_SUCCESS: 'SUBSCRIBE_FEED_SUCCESS',
    SUBSCRIBE_FEED_FAIL: 'SUBSCRIBE_FEED_FAIL',
    UNSUBSCRIBE_FEED: 'UNSUBSCRIBE_FEED',
    UNSUBSCRIBE_FEED_SUCCESS: 'UNSUBSCRIBE_FEED_SUCCESS',
    UNSUBSCRIBE_FEED_FAIL: 'UNSUBSCRIBE_FEED_FAIL',
    FEEDS_ADD_NOTES: 'FEEDS_ADD_NOTES',
    FEEDS_ADD_NOTES_SUCCESS: 'FEEDS_ADD_NOTES_SUCCESS',
    FEEDS_ADD_NOTES_FAIL: 'FEEDS_ADD_NOTES_FAIL',
    FEED_CHANGE_LICENSE: "FEED_CHANGE_LICENSE",
    FEED_CHANGE_LICENSE_FAIL: "FEED_CHANGE_LICENSE_FAIL",
    FEED_CHANGE_LICENSE_SUCCESS: "FEED_CHANGE_LICENSE_SUCCESS",
    FEED_UNSET_LICENSE: "FEED_UNSET_LICENSE",
    FEED_UNSET_LICENSE_FAIL: "FEED_UNSET_LICENSE_FAIL",
    FEED_UNSET_LICENSE_SUCCESS: "FEED_UNSET_LICENSE_SUCCESS",
    FEED_CREATE_LICENSE: "FEED_CREATE_LICENSE",
    FEED_CREATE_LICENSE_FAIL: "FEED_CREATE_LICENSE_FAIL",
    FEED_CREATE_LICENSE_SUCCESS: "FEED_CREATE_LICENSE_SUCCESS",
    FEED_CHANGE_MISCDATA: "FEED_CHANGE_MISCDATA",
    FEED_CHANGE_MISCDATA_FAIL: "FEED_CHANGE_MISCDATA_FAIL",
    FEED_CHANGE_MISCDATA_SUCCESS: "FEED_CHANGE_MISCDATA_SUCCESS",
    FEED_UNSET_MISCDATA: "FEED_UNSET_MISCDATA",
    FEED_UNSET_MISCDATA_FAIL: "FEED_UNSET_MISCDATA_FAIL",
    FEED_UNSET_MISCDATA_SUCCESS: "FEED_UNSET_MISCDATA_SUCCESS",
    FEED_CREATE_MISCDATA: "FEED_CREATE_MISCDATA",
    FEED_CREATE_MISCDATA_FAIL: "FEED_CREATE_MISCDATA_FAIL",
    FEED_CREATE_MISCDATA_SUCCESS: "FEED_CREATE_MISCDATA_SUCCESS",
    FEED_DELETE_LICENSES: "FEED_DELETE_LICENSES",
    FEED_DELETE_LICENSES_SUCCESS: "FEED_DELETE_LICENSES_SUCCESS",
    FEED_DELETE_LICENSES_FAIL: "FEED_DELETE_LICENSES_FAIL",
    FEED_DELETE_MISCS: "FEED_DELETE_MISCS",
    FEED_DELETE_MISCS_SUCCESS: "FEED_DELETE_MISCS_SUCCESS",
    FEED_DELETE_MISCS_FAIL: "FEED_DELETE_MISCS_FAIL"
};
function toFeedReference(feed) {
    return {
        feedsourceId: feed.id,
        feedLabel: feed.name
    };
}
exports.toFeedReference = toFeedReference;
var DatasetsActions = (function () {
    function DatasetsActions() {
    }
    DatasetsActions.prototype.statusErrorMessage = function (errorMessage) {
        return {
            type: exports.DatasetsActionType.STATUS_ERROR_MESSAGE,
            payload: {
                errorMessage: errorMessage
            }
        };
    };
    DatasetsActions.prototype.statusClearNotifyMessage = function () {
        return {
            type: exports.DatasetsActionType.STATUS_CLEAR_NOTIFY_MESSAGE
        };
    };
    DatasetsActions.prototype.userSubscribe = function (userSubscribeParams) {
        return {
            type: exports.DatasetsActionType.USER_SUBSCRIBE,
            payload: {
                userSubscribeParams: userSubscribeParams
            }
        };
    };
    DatasetsActions.prototype.userSubscribeSuccess = function (userSubscribeParams) {
        return {
            type: exports.DatasetsActionType.USER_SUBSCRIBE_SUCCESS,
            payload: {
                userSubscribeParams: userSubscribeParams
            }
        };
    };
    DatasetsActions.prototype.userSubscribeFail = function (userSubscribeParams, error) {
        return {
            type: exports.DatasetsActionType.USER_SUBSCRIBE_FAIL,
            payload: {
                userSubscribeParams: userSubscribeParams
            }
        };
    };
    DatasetsActions.prototype.feedsGet = function (feedsGetParams) {
        return {
            type: exports.DatasetsActionType.FEEDS_GET,
            payload: {
                feedsGetParams: feedsGetParams
            }
        };
    };
    DatasetsActions.prototype.feedsGetLocally = function (feedsGetParams, feeds) {
        return {
            type: exports.DatasetsActionType.FEEDS_GET_LOCALLY,
            payload: {
                feedsGetParams: feedsGetParams,
                feeds: feeds
            }
        };
    };
    DatasetsActions.prototype.publicProjectGet = function (projectGetParams) {
        return {
            type: exports.DatasetsActionType.GET_PUBLIC_PROJECT,
            payload: {
                projectGetParams: projectGetParams
            }
        };
    };
    DatasetsActions.prototype.publicProjectGetSuccess = function (projectGetResponse) {
        return {
            type: exports.DatasetsActionType.GET_PUBLIC_PROJECT_SUCCESS,
            payload: {
                project: projectGetResponse
            }
        };
    };
    DatasetsActions.prototype.publicProjectGetFail = function (projectGetParams, error) {
        return {
            type: exports.DatasetsActionType.GET_PUBLIC_PROJECT_FAIL,
            payload: {
                projectGetParams: projectGetParams,
                error: error
            }
        };
    };
    DatasetsActions.prototype.updateProject = function (projectId, projectPutParams) {
        return {
            type: exports.DatasetsActionType.UPDATE_PROJECT,
            payload: {
                projectId: projectId,
                updateProject: projectPutParams
            }
        };
    };
    DatasetsActions.prototype.updateProjectSuccess = function (projectPutResponse) {
        return {
            type: exports.DatasetsActionType.UPDATE_PROJECT_SUCCESS,
            payload: {
                project: projectPutResponse
            }
        };
    };
    DatasetsActions.prototype.updateProjectFail = function (projectId, projectPutParams, error) {
        return {
            type: exports.DatasetsActionType.UPDATE_PROJECT_FAIL,
            payload: {
                //projectId: projectId,
                updateProject: projectPutParams,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedsGetSuccess = function (feedsGetResponse) {
        return {
            type: exports.DatasetsActionType.FEEDS_GET_SUCCESS,
            payload: {
                feedsGetResponse: feedsGetResponse
            }
        };
    };
    DatasetsActions.prototype.feedsGetFail = function (feedsGetParams, error) {
        return {
            type: exports.DatasetsActionType.FEEDS_GET_FAIL,
            payload: {
                feedsGetParams: feedsGetParams
            }
        };
    };
    DatasetsActions.prototype.feedCreate = function (createFeed) {
        // use filename as default project/feed name
        var defaultName;
        switch (createFeed.retrievalMethod) {
            case 'PRODUCED_IN_HOUSE':
                defaultName = 'PRODUCED_IN_HOUSE';
                break;
            case 'MANUALLY_UPLOADED':
                defaultName = createFeed.file.name;
                break;
            default:
                defaultName = createFeed.feedName;
                break;
        }
        if (!createFeed.projectName || !createFeed.projectName.trim().length) {
            createFeed.projectName = defaultName;
        }
        if (!createFeed.feedName || !createFeed.feedName.trim().length) {
            createFeed.feedName = defaultName;
        }
        return {
            type: exports.DatasetsActionType.FEED_CREATE,
            payload: {
                createFeed: createFeed
            }
        };
    };
    DatasetsActions.prototype.feedCreateProgress = function (createFeed, progress) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_PROGRESS,
            payload: {
                createFeed: createFeed,
                progress: progress
            }
        };
    };
    DatasetsActions.prototype.feedCreateSuccess = function (createFeed, feed) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_SUCCESS,
            payload: {
                createFeed: createFeed,
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.feedCreateFail = function (createFeed, error) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_FAIL,
            payload: {
                createFeed: createFeed,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedSetPublic = function (feedRef, value) {
        return {
            type: exports.DatasetsActionType.FEED_SET_PUBLIC,
            payload: {
                feedRef: feedRef,
                isPublic: value
            }
        };
    };
    DatasetsActions.prototype.feedSetPublicSuccess = function (feed) {
        return {
            type: exports.DatasetsActionType.FEED_SET_PUBLIC_SUCCESS,
            payload: {
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.feedSetPublicFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_SET_PUBLIC_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedDelete = function (feedRefs) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE,
            payload: {
                feedRefs: feedRefs
            }
        };
    };
    DatasetsActions.prototype.feedDeleteSuccess = function (feedRefs) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_SUCCESS,
            payload: {
                feedRefs: feedRefs
            }
        };
    };
    DatasetsActions.prototype.feedDeleteFail = function (feedRefs, errors) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_FAIL,
            payload: {
                feedRefs: feedRefs
            }
        };
    };
    DatasetsActions.prototype.feedSetName = function (feedRef, name) {
        return {
            type: exports.DatasetsActionType.FEED_SET_NAME,
            payload: {
                feedRef: feedRef,
                name: name
            }
        };
    };
    DatasetsActions.prototype.feedSetNameSuccess = function (feed) {
        return {
            type: exports.DatasetsActionType.FEED_SET_NAME_SUCCESS,
            payload: {
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.feedSetNameFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_SET_NAME_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedAddNotes = function (feedId, data) {
        return {
            type: exports.DatasetsActionType.FEEDS_ADD_NOTES,
            payload: {
                feedId: feedId,
                data: data
            }
        };
    };
    DatasetsActions.prototype.feedAddNotesSuccess = function (feedId, data) {
        return {
            type: exports.DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS,
            payload: {
                feedId: feedId,
                data: data
            }
        };
    };
    DatasetsActions.prototype.feedAddNotesFail = function (feedId, data, error) {
        return {
            type: exports.DatasetsActionType.FEEDS_ADD_NOTES_FAIL,
            payload: {
                feedId: feedId,
                data: data,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedSetFile = function (feedRef, file) {
        return {
            type: exports.DatasetsActionType.FEED_SET_FILE,
            payload: {
                feedRef: feedRef,
                file: file
            }
        };
    };
    DatasetsActions.prototype.feedSetFileProgress = function (feedRef, progress) {
        return {
            type: exports.DatasetsActionType.FEED_SET_FILE_PROGRESS,
            payload: {
                feedRef: feedRef,
                progress: progress
            }
        };
    };
    DatasetsActions.prototype.feedSetFileSuccess = function (feed) {
        return {
            type: exports.DatasetsActionType.FEED_SET_FILE_SUCCESS,
            payload: {
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.feedSetFileFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_SET_FILE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedFetch = function (feedRef) {
        return {
            type: exports.DatasetsActionType.FEED_FETCH,
            payload: {
                feedRef: feedRef
            }
        };
    };
    DatasetsActions.prototype.feedFetchSuccess = function (feed) {
        return {
            type: exports.DatasetsActionType.FEED_FETCH_SUCCESS,
            payload: {
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.feedFetchFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_FETCH_FAIL,
            payload: {
                feedRef: feedRef
            }
        };
    };
    DatasetsActions.prototype.addFeedToProject = function (createFeed) {
        // use filename as default project/feed name
        var defaultName = createFeed.file.name;
        if (!createFeed.projectName || !createFeed.projectName.trim().length) {
            createFeed.projectName = defaultName;
        }
        if (!createFeed.feedName || !createFeed.feedName.trim().length) {
            createFeed.feedName = defaultName;
        }
        return {
            type: exports.DatasetsActionType.ADD_FEED_TO_PROJECT,
            payload: {
                createFeed: createFeed
            }
        };
    };
    DatasetsActions.prototype.addFeedToProjectSuccess = function (feed) {
        return {
            type: exports.DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS,
            payload: {
                feed: feed
            }
        };
    };
    DatasetsActions.prototype.addFeedToProjectFail = function (createFeed, error) {
        return {
            type: exports.DatasetsActionType.ADD_FEED_TO_PROJECT_FAIL,
            payload: {
                createFeed: createFeed,
                error: error
            }
        };
    };
    DatasetsActions.prototype.confirmationDeleteProject = function (deleteProject) {
        return {
            type: exports.DatasetsActionType.CONFIRM_DELETE_FEED,
            payload: {
                deleteProject: deleteProject
            }
        };
    };
    DatasetsActions.prototype.confirmationDeleteProjectSuccess = function () {
        return {
            type: exports.DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS
        };
    };
    DatasetsActions.prototype.subscribeToFeed = function (user_id, userInfos) {
        return {
            type: exports.DatasetsActionType.SUBSCRIBE_FEED,
            payload: {
                user_id: user_id,
                userInfos: userInfos
            }
        };
    };
    DatasetsActions.prototype.subscribeToFeedSuccess = function (userInfos) {
        return {
            type: exports.DatasetsActionType.SUBSCRIBE_FEED_SUCCESS,
            payload: {
                userInfos: userInfos
            }
        };
    };
    DatasetsActions.prototype.subscribeToFeedFail = function (userInfos, error) {
        return {
            type: exports.DatasetsActionType.SUBSCRIBE_FEED_FAIL,
            payload: {
                userInfos: userInfos,
                error: error
            }
        };
    };
    DatasetsActions.prototype.unsubscribeToFeed = function (user_id, userInfos) {
        return {
            type: exports.DatasetsActionType.UNSUBSCRIBE_FEED,
            payload: {
                user_id: user_id,
                userInfos: userInfos
            }
        };
    };
    DatasetsActions.prototype.unsubscribeToFeedSuccess = function (userInfos) {
        return {
            type: exports.DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS,
            payload: {
                userInfos: userInfos
            }
        };
    };
    DatasetsActions.prototype.unsubscribeToFeedFail = function (userInfos, error) {
        return {
            type: exports.DatasetsActionType.UNSUBSCRIBE_FEED_FAIL,
            payload: {
                userInfos: userInfos,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedSetLicense = function (feedRef, licenseId) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    };
    DatasetsActions.prototype.feedSetLicenseSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedSetLicenseFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedUnsetLicense = function (feedRef, licenseId) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    };
    DatasetsActions.prototype.feedUnsetLicenseSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedUnsetLicenseFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedCreateLicense = function (feedRef, licenseName, licenseFile) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseName: licenseName,
                licenseFile: licenseFile
            }
        };
    };
    DatasetsActions.prototype.feedCreateLicenseSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedCreateLicenseFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedSetMiscData = function (feedRef, licenseId) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    };
    DatasetsActions.prototype.feedSetMiscDataSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedSetMiscDataFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_CHANGE_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedUnsetMiscData = function (feedRef, licenseId) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    };
    DatasetsActions.prototype.feedUnsetMiscDataSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedUnsetMiscDataFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_UNSET_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedCreateMiscData = function (feedRef, licenseName, licenseFile) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseName: licenseName,
                licenseFile: licenseFile
            }
        };
    };
    DatasetsActions.prototype.feedCreateMiscDataSuccess = function (license) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    };
    DatasetsActions.prototype.feedCreateMiscDataFail = function (feedRef, error) {
        return {
            type: exports.DatasetsActionType.FEED_CREATE_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        };
    };
    DatasetsActions.prototype.feedDeleteLicenses = function (licenses) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_LICENSES,
            payload: {
                licenses: licenses
            }
        };
    };
    DatasetsActions.prototype.feedDeleteLicensesSuccess = function (licenses) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_LICENSES_SUCCESS,
            payload: {
                licenses: licenses
            }
        };
    };
    DatasetsActions.prototype.feedDeleteLicensesFail = function (licenses, errors) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_LICENSES_FAIL,
            payload: {
                licenses: licenses
            }
        };
    };
    DatasetsActions.prototype.feedDeleteMiscs = function (miscs) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_MISCS,
            payload: {
                miscs: miscs
            }
        };
    };
    DatasetsActions.prototype.feedDeleteMiscsSuccess = function (miscs) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_MISCS_SUCCESS,
            payload: {
                miscs: miscs
            }
        };
    };
    DatasetsActions.prototype.feedDeleteMiscsFail = function (miscs, errors) {
        return {
            type: exports.DatasetsActionType.FEED_DELETE_MISCS_FAIL,
            payload: {
                miscs: miscs
            }
        };
    };
    return DatasetsActions;
}());
DatasetsActions = __decorate([
    core_1.Injectable()
], DatasetsActions);
exports.DatasetsActions = DatasetsActions;

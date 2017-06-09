import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { FeedsGetResponse, IFeedApi, FeedsGetParams, IFeed, ILicense } from "app/commons/services/api/feedsApi.service";
import { IProject } from "app/commons/services/api/projectsApi.service";
import { UserSubscribeParams } from "app/commons/services/api/usersApi.service";
import { ICreateFeed } from "./datasets.effects";

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

    FEEDS_ADD_NOTES: "FEEDS_ADD_NOTES",
    FEEDS_ADD_NOTES_SUCCESS: 'FEEDS_ADD_NOTES_SUCCESS',
    FEEDS_ADD_NOTES_FAIL: 'FEEDS_ADD_NOTES_FAIL',

    FEED_CHANGE_LICENSE: `FEED_CHANGE_LICENSE`,
    FEED_CHANGE_LICENSE_FAIL: `FEED_CHANGE_LICENSE_FAIL`,
    FEED_CHANGE_LICENSE_SUCCESS: `FEED_CHANGE_LICENSE_SUCCESS`,

    FEED_UNSET_LICENSE: `FEED_UNSET_LICENSE`,
    FEED_UNSET_LICENSE_FAIL: `FEED_UNSET_LICENSE_FAIL`,
    FEED_UNSET_LICENSE_SUCCESS: `FEED_UNSET_LICENSE_SUCCESS`,

    FEED_CREATE_LICENSE: `FEED_CREATE_LICENSE`,
    FEED_CREATE_LICENSE_FAIL: `FEED_CREATE_LICENSE_FAIL`,
    FEED_CREATE_LICENSE_SUCCESS: `FEED_CREATE_LICENSE_SUCCESS`,

    FEED_CHANGE_MISCDATA: `FEED_CHANGE_MISCDATA`,
    FEED_CHANGE_MISCDATA_FAIL: `FEED_CHANGE_MISCDATA_FAIL`,
    FEED_CHANGE_MISCDATA_SUCCESS: `FEED_CHANGE_MISCDATA_SUCCESS`,

    FEED_UNSET_MISCDATA: `FEED_UNSET_MISCDATA`,
    FEED_UNSET_MISCDATA_FAIL: `FEED_UNSET_MISCDATA_FAIL`,
    FEED_UNSET_MISCDATA_SUCCESS: `FEED_UNSET_MISCDATA_SUCCESS`,

    FEED_CREATE_MISCDATA: `FEED_CREATE_MISCDATA`,
    FEED_CREATE_MISCDATA_FAIL: `FEED_CREATE_MISCDATA_FAIL`,
    FEED_CREATE_MISCDATA_SUCCESS: `FEED_CREATE_MISCDATA_SUCCESS`,

    FEED_DELETE_LICENSES: `FEED_DELETE_LICENSES`,
    FEED_DELETE_LICENSES_SUCCESS: `FEED_DELETE_LICENSES_SUCCESS`,
    FEED_DELETE_LICENSES_FAIL: `FEED_DELETE_LICENSES_FAIL`,

    FEED_DELETE_MISCS: `FEED_DELETE_MISCS`,
    FEED_DELETE_MISCS_SUCCESS: `FEED_DELETE_MISCS_SUCCESS`,
    FEED_DELETE_MISCS_FAIL: `FEED_DELETE_MISCS_FAIL`,

};

export type IFeedReference = {
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

    publicProjectGet(projectGetParams: string): Action {
        return {
            type: DatasetsActionType.GET_PUBLIC_PROJECT,
            payload: {
                projectGetParams: projectGetParams,
            }
        }
    }

    publicProjectGetSuccess(projectGetResponse: IProject): Action {
        return {
            type: DatasetsActionType.GET_PUBLIC_PROJECT_SUCCESS,
            payload: {
                project: projectGetResponse
            }
        }
    }

    publicProjectGetFail(projectGetParams: string, error: any): Action {
        return {
            type: DatasetsActionType.GET_PUBLIC_PROJECT_FAIL,
            payload: {
                projectGetParams: projectGetParams,
                error: error
            }
        };
    }

    updateProject(projectId: string, projectPutParams: any): Action {
        return {
            type: DatasetsActionType.UPDATE_PROJECT,
            payload: {
                projectId: projectId,
                updateProject: projectPutParams
            }
        }
    }

    updateProjectSuccess(projectPutResponse: IProject): Action {
        return {
            type: DatasetsActionType.UPDATE_PROJECT_SUCCESS,
            payload: {
                project: projectPutResponse
            }
        }
    }

    updateProjectFail(projectId: string, projectPutParams: any, error: any): Action {
        return {
            type: DatasetsActionType.UPDATE_PROJECT_FAIL,
            payload: {
                //projectId: projectId,
                updateProject: projectPutParams,
                error: error
            }
        }
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

    feedCreate(createFeed: ICreateFeed): Action {
        // use filename as default project/feed name
        let defaultName;
        switch(createFeed.retrievalMethod){
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

    feedAddNotes(feedId: string, data: any): Action {
        return {
            type: DatasetsActionType.FEEDS_ADD_NOTES,
            payload: {
                feedId: feedId,
                data: data
            }
        }
    }

    feedAddNotesSuccess(feedId: string, data: any): Action {
        return {
            type: DatasetsActionType.FEEDS_ADD_NOTES_SUCCESS,
            payload: {
                feedId: feedId,
                data: data
            }
        }
    }

    feedAddNotesFail(feedId: string, data: any, error: any): Action {
        return {
            type: DatasetsActionType.FEEDS_ADD_NOTES_FAIL,
            payload: {
                feedId: feedId,
                data: data,
                error: error
            }
        }
    }

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

    addFeedToProject(createFeed: ICreateFeed): Action {
        // use filename as default project/feed name
        let defaultName = createFeed.file.name;
        if (!createFeed.projectName || !createFeed.projectName.trim().length) {
            createFeed.projectName = defaultName;
        }
        if (!createFeed.feedName || !createFeed.feedName.trim().length) {
            createFeed.feedName = defaultName;
        }
        return {
            type: DatasetsActionType.ADD_FEED_TO_PROJECT,
            payload: {
                createFeed: createFeed
            }
        }
    }

    addFeedToProjectSuccess(feed: IFeedApi): Action {
        return {
            type: DatasetsActionType.ADD_FEED_TO_PROJECT_SUCCESS,
            payload: {
                feed: feed
            }
        }
    }

    addFeedToProjectFail(createFeed: ICreateFeed, error: any): Action {
        return {
            type: DatasetsActionType.ADD_FEED_TO_PROJECT_FAIL,
            payload: {
                createFeed: createFeed,
                error: error
            }
        }
    }

    confirmationDeleteProject(deleteProject: boolean): Action {
        return {
            type: DatasetsActionType.CONFIRM_DELETE_FEED,
            payload: {
                deleteProject: deleteProject
            }
        }
    }

    confirmationDeleteProjectSuccess(): Action {
        return {
            type: DatasetsActionType.CONFIRM_DELETE_FEED_SUCCESS
        }
    }

    subscribeToFeed(user_id, userInfos: Object): Action {
        return {
            type: DatasetsActionType.SUBSCRIBE_FEED,
            payload: {
                user_id: user_id,
                userInfos: userInfos
            }
        }
    }

    subscribeToFeedSuccess(userInfos: Object): Action {
        return {
            type: DatasetsActionType.SUBSCRIBE_FEED_SUCCESS,
            payload: {
                userInfos: userInfos
            }
        }
    }

    subscribeToFeedFail(userInfos: Object, error: any): Action {
        return {
            type: DatasetsActionType.SUBSCRIBE_FEED_FAIL,
            payload: {
                userInfos: userInfos,
                error: error
            }
        }
    }

    unsubscribeToFeed(user_id, userInfos: Object): Action {
        return {
            type: DatasetsActionType.UNSUBSCRIBE_FEED,
            payload: {
                user_id: user_id,
                userInfos: userInfos
            }
        }
    }

    unsubscribeToFeedSuccess(userInfos: Object): Action {
        return {
            type: DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS,
            payload: {
                userInfos: userInfos
            }
        }
    }

    unsubscribeToFeedFail(userInfos: Object, error: any): Action {
        return {
            type: DatasetsActionType.UNSUBSCRIBE_FEED_FAIL,
            payload: {
                userInfos: userInfos,
                error: error
            }
        }
    }

    feedSetLicense(feedRef: IFeedReference, licenseId: string): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    }

    feedSetLicenseSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedSetLicenseFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }

    feedUnsetLicense(feedRef: IFeedReference, licenseId: string): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    }

    feedUnsetLicenseSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedUnsetLicenseFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }

    feedCreateLicense(feedRef: IFeedReference, licenseName: string, licenseFile: any): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_LICENSE,
            payload: {
                feedRef: feedRef,
                licenseName: licenseName,
                licenseFile: licenseFile
            }
        };
    }

    feedCreateLicenseSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_LICENSE_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedCreateLicenseFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_LICENSE_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }


    feedSetMiscData(feedRef: IFeedReference, licenseId: string): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    }

    feedSetMiscDataSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedSetMiscDataFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_CHANGE_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }

    feedUnsetMiscData(feedRef: IFeedReference, licenseId: string): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseId: licenseId
            }
        };
    }

    feedUnsetMiscDataSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedUnsetMiscDataFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_UNSET_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }

    feedCreateMiscData(feedRef: IFeedReference, licenseName: string, licenseFile: any): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_MISCDATA,
            payload: {
                feedRef: feedRef,
                licenseName: licenseName,
                licenseFile: licenseFile
            }
        };
    }

    feedCreateMiscDataSuccess(license: ILicense): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_MISCDATA_SUCCESS,
            payload: {
                license: license
            }
        };
    }

    feedCreateMiscDataFail(feedRef: IFeedReference, error: any): Action {
        return {
            type: DatasetsActionType.FEED_CREATE_MISCDATA_FAIL,
            payload: {
                feedRef: feedRef,
                error: error
            }
        }
    }

    feedDeleteLicenses(licenses: any): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_LICENSES,
            payload: {
                licenses: licenses
            }
        }
    }

    feedDeleteLicensesSuccess(licenses: any): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_LICENSES_SUCCESS,
            payload: {
                licenses: licenses
            }
        };
    }

    feedDeleteLicensesFail(licenses: any, errors: any[]): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_LICENSES_FAIL,
            payload: {
                licenses: licenses
            }
        }
    }

    feedDeleteMiscs(miscs: any): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_MISCS,
            payload: {
                miscs: miscs
            }
        }
    }

    feedDeleteMiscsSuccess(miscs: any): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_MISCS_SUCCESS,
            payload: {
                miscs: miscs
            }
        };
    }

    feedDeleteMiscsFail(miscs: any, errors: any[]): Action {
        return {
            type: DatasetsActionType.FEED_DELETE_MISCS_FAIL,
            payload: {
                miscs: miscs
            }
        }
    }
}

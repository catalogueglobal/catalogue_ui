import { EventEmitter } from '@angular/core';
import * as leaflet   from 'leaflet';

export type SortOrder = {
    sort: string,
    order: string
};

export type InlineEditEvent<T> = {
    confirm$: EventEmitter<any>,
    value: T
};

export type IFeedRow = IFeed & {
    checked
};

export enum FEED_RETRIEVAL_METHOD {
    FETCHED_AUTOMATICALLY = <any> 'FETCHED_AUTOMATICALLY',
    PRODUCED_IN_HOUSE = <any> 'PRODUCED_IN_HOUSE',
    MANUALLY_UPLOADED = <any> 'MANUALLY_UPLOADED'
}

export type IFeedApi = {
    id: string,
    projectId: string,
    regions: string[],
    name: string,
    url: string,
    isPublic: boolean,
    retrievalMethod: FEED_RETRIEVAL_METHOD,
    lastUpdated: number,
    latestVersionId: string,
    latestValidation: {
        bounds: IBounds
    }
};

export type ILicense = {
    id: string,
    name: string,
    originalFileName: string,
    feedIds: string[]
};

export type IFeed = IFeedApi & {
    region: string,
    state: string,
    country: string
};

export type IBounds = {
    north: number,
    east: number,
    south: number,
    west: number
};

export type FeedsGetResponse = {
    feeds: IFeed[]
};

export type FeedsGetParams = {
    secure: boolean,
    sortOrder: SortOrder,
    bounds: IBounds
};

export type IProject = {
    id: string,
    name: string,
    defaultLocationLat: number,
    defaultLocationLon: number,
    feedSources: IFeedApi[]
};

export type UserSubscribeParams = {
    NAME: string,
    EMAIL: string,
    COMPANY: string,
    TYPE: string
};

export type Session = {
    user: any,
    token: string
};

export type AutocompleteItem = {
    position: leaflet.LatLngExpression,
    type: string,
};

export type IFeedReference = {
    feedsourceId: string,
    versionId?: string,
    feedVersionCount?: number,
    feedLabel: string
};

export type ICreateFeed = {
    projectName: string,
    feedName: string,
    isPublic: boolean,
    file: any,
    feedUrl: any,
    licenseName: string,
    licenseId: string;
    metadataFile: any,
    licenseFile: any,
    feedDesc: any,
    autoFetchFeeds: boolean,
    retrievalMethod: string
};

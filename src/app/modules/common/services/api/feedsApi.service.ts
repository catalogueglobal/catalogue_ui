import { Injectable }                   from '@angular/core';
import { Http }                         from '@angular/http';
import { AuthHttp, AuthConfig }         from 'angular2-jwt';
import { Observable }                   from 'rxjs/Rx';
import { Configuration }                from '../configuration';
import { UtilsService } from '../utils.service';

import {
    SortOrder,
    IFeedApi,
    IFeed,
    IBounds,
    FeedsGetResponse,
    FeedsGetParams,
    IProject
} from 'app/modules/common';
import { UploadService }                from '../upload.service';
import { AbstractApiService }           from './abstractApi.service';
import { LocalFiltersService }          from './localFilters.service';
import { ProjectsApiService } from './projectsApi.service';

@Injectable()
export class FeedsApiService extends AbstractApiService {
    private ROOT_URL: string;
    private FEED_URL: string;
    private FEED_VERSION_URL: string;
    private FEED_DOWNLOAD_URL: string;
    private FEED_NOTES: string;
    private FEED_STOPS_URL: string;

    constructor(
        protected http: Http,
        protected authHttp: AuthHttp,
        protected authConfig: AuthConfig,
        protected config: Configuration,
        protected projectsApiService: ProjectsApiService,
        protected uploadService: UploadService,
        protected localFilters: LocalFiltersService,
        private utilsService: UtilsService) {
        super(http, authHttp, authConfig, config);
        this.ROOT_URL = this.config.ROOT_API + '/api/manager/public';
        this.FEED_URL = this.config.ROOT_API + '/api/manager/public/feedsource';
        this.FEED_VERSION_URL = this.config.ROOT_API + '/api/manager/public/feedversion';
        this.FEED_DOWNLOAD_URL = this.config.ROOT_API + '/api/manager/downloadfeed';
        this.FEED_NOTES = this.config.ROOT_API + '/api/manager/public/note?type=FEED_SOURCE&objectId=';
        this.FEED_STOPS_URL = this.config.ROOT_API + '/api/manager/public/stop';
    }

    public create(createFeed: any, projectId: string): Observable<IFeedApi> {
        let data: any = {
            name: createFeed.feedName,
            projectId: projectId,
            isPublic: createFeed.isPublic,
            comments: createFeed.feedDesc,
            retrievalMethod: createFeed.retrievalMethod || 'MANUALLY_UPLOADED'
        };
        if (createFeed.retrievalMethod === 'FETCHED_AUTOMATICALLY') {
            data.autoFetchHour = 0;
            data.autoFetchMinute = 0;
            data.autoFetchFeeds = createFeed.autoFetchFeeds;
        }
        data = JSON.stringify(data);
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_URL), data).map(response => response.json());
    }

    public setPublic(feedSourceId: string, value: boolean): Observable<IFeedApi> {
        return this.authHttp.put(this.utilsService.getSecureUrl(this.FEED_URL) + '/' +
            feedSourceId, JSON.stringify({ isPublic: value }))
            .map(response => response.json());
    }

    public setName(feedSourceId: string, value: string): Observable<IFeedApi> {
        return this.authHttp.put(this.utilsService.getSecureUrl(this.FEED_URL) + '/'
            + feedSourceId, JSON.stringify({ name: value }))
            .map(response => response.json());
    }

    public setFile(feedSourceId: string, file: File): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) +
            '?feedSourceId=' + feedSourceId + '&lastModified=' + file.lastModifiedDate.getTime(),
            formData, this.computeAuthHeaders());
    }

    public delete(feedSourceId: string, versionId?: string): Observable<any> {
        if (versionId) {
            return this.authHttp.delete(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) + '/' + versionId);
        }
        return this.authHttp.delete(this.utilsService.getSecureUrl(this.FEED_URL) + '/' + feedSourceId);
    }

    public getDownloadUrl(feed: IFeedApi, versionId: string, isPublic: boolean): Observable<string> {
        if (feed.url && !versionId) {
            // direct download from the source
            return Observable.of(feed.url);
        }
        let url;
        let callback;
        if (isPublic) {
            url = this.FEED_VERSION_URL;
            callback = this.http;
        } else {
            url = this.utilsService.getSecureUrl(this.FEED_VERSION_URL);
            callback = this.authHttp;
        }
        // download with a token
        return callback.get(url + '/' + (versionId ? versionId : feed.latestVersionId) +
            '/downloadtoken', { headers: this.utilsService.getHeader() })
            .map(response => response.json())
            .map(result => this.FEED_DOWNLOAD_URL + '/' + result.id);
    }

    public fetch(feedSourceId: string): Observable<any> {
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_URL) + '/' + feedSourceId + '/fetch', '',
            { headers: this.utilsService.getHeader() })
            .map(response => response.json());
    }

    public getFeed(feedSourceId: string, getPublic?: boolean): Promise<any> {
        return getPublic ? this.http.get(this.FEED_URL + '/' + feedSourceId, { headers: this.utilsService.getHeader() })
            .map(response => response.json()).toPromise() :
            this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_URL) + '/' +
                feedSourceId, { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
    }

    public getNotes(feedSourceId: string, isPublic?: boolean): Promise<any> {
        if (isPublic) {
            return this.http.get(this.FEED_NOTES + feedSourceId).map(response => response.json()).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_NOTES) + feedSourceId)
            .map(response => response.json()).toPromise();
    }

    public addNotes(feedSourceId: string, note: string): Observable<any> {
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_NOTES) + feedSourceId, note)
            .map(response => response.json());
    }

    public getList(params: FeedsGetParams) {
        let projects;
        if (params.secure) {
            projects = this.projectsApiService.getSecureList(params.bounds, params.sortOrder);
        }
        else {
            projects = this.projectsApiService.getPublicList(params.bounds, params.sortOrder);
        }
        let observableRes = Observable.create(obs => {
            projects.subscribe(
                data => {
                    if (!data || data.length === 0) {
                        obs.next([]);
                        obs.complete();
                    } else {
                        this.adaptFeedsResponse(projects, params.secure, params.bounds, params.sortOrder).subscribe(
                            response => {
                                obs.next(response);
                                obs.complete();
                            });
                    }
                },
            );
        });
        return observableRes;
    }

    protected adaptFeedsResponse(projectsObservable: Observable<IProject[]>, retrieveSecureFeeds: boolean,
        bounds: IBounds, sortOrder: SortOrder): Observable<FeedsGetResponse> {
        return projectsObservable.flatMap(project => project)
            .map(p => this.feedsFromProject(p, retrieveSecureFeeds))
            .mergeAll()
            .flatMap(feeds => feeds)
            .toArray()
            .map(feedArray => {
                if (bounds) {
                    feedArray = this.localFilters.filterFeedsInArea(feedArray, bounds);
                }
                if (sortOrder) {
                    feedArray = this.localFilters.sortFeeds(feedArray, sortOrder);
                }
                return {
                    feeds: feedArray
                };
            });
    }

    feedsFromProject(project: IProject, retrieveSecureFeeds: boolean): Observable<IFeed[]> {
        let projectFeeds: Observable<IFeedApi[]>;
        if (retrieveSecureFeeds) {
            projectFeeds = this.getSecureFeeds(project.id);
        }
        else {
            projectFeeds = Observable.from([project.feedSources || []]);
        }
        return projectFeeds.flatMap(f => f).map(feedApi => this.adaptFeed(project, feedApi)).toArray();
    }

    adaptFeed(project: IProject, feedApi: IFeedApi): IFeed {
        // compute region, state & country
        let regionStateCountryData = this.utilsService.computeRegionStateCountryData(project.name, feedApi.regions);
        return Object.assign({}, feedApi, regionStateCountryData);
    }

    getSecureFeeds(projectId: string): Observable<IFeedApi[]> {
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_URL) + '?projectId=' + projectId,
            { headers: this.utilsService.getHeader() })
            .map(response => response.json());
    }

    public getFeedVersions(feedSourceId: string, isPublic: boolean): Promise<any> {
        if (isPublic) {
            return this.http.get(this.FEED_VERSION_URL + '?feedSourceId=' + feedSourceId,
                { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
        } else {
            return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) +
                '?feedSourceId=' + feedSourceId, { headers: this.utilsService.getHeader() })
                .map(response => response.json()).toPromise();
        }
    }

    public getStops(feedId: string, feedVersion: string, isPublic: boolean): Promise<any> {
        if (isPublic) {
            return this.http.get(this.FEED_STOPS_URL + '?feedId=' + feedId,
                { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_STOPS_URL) + '?feedId='
            + feedId, { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
    }

    public getRoutes(feedId: string, feedVersion: string, isPublic: boolean): Promise<any> {
        if (isPublic) {
            return this.http.get(this.ROOT_URL + '/route?feedId=' + feedId,
                { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.ROOT_URL) + '/route?feedId='
            + feedId, { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
    }

    public getRouteTripPattern(feedId: string, feedVersion: string, routeId: string, isPublic: boolean): Promise<any> {
        if (isPublic) {
            return this.http.get(this.ROOT_URL + '/trippattern?feedId=' + feedId + '&routeId='
                + routeId, { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.ROOT_URL) + '/trippattern?feedId=' +
            feedId + '&routeId=' + routeId, { headers: this.utilsService.getHeader() }).map(response =>
                response.json()).toPromise();
    }

    public getFeedByVersion(versionId: string, isPublic?: boolean): Promise<any> {
        let url;
        if (isPublic) {
            return this.http.get(this.FEED_VERSION_URL + '/' + versionId, { headers: this.utilsService.getHeader() })
                .map(response => response.json()).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) + '/' + versionId,
            { headers: this.utilsService.getHeader() }).map(response => response.json()).toPromise();
    }
}

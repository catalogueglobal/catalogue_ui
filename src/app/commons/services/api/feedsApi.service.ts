import { Injectable }                   from "@angular/core";
import { Http, Headers }                         from "@angular/http";
import { AuthHttp, AuthConfig }         from "angular2-jwt";
import { Observable }                   from "rxjs/Rx";
import { Configuration }                from "app/commons/configuration";
import { SortOrder }                    from "app/commons/directives/sort-link/sort-link.component";
import { UploadService }                from "app/commons/services/upload.service";
import { AbstractApiService }           from "./abstractApi.service";
import { LocalFiltersService }          from "./localFilters.service";
import { ProjectsApiService, IProject } from "./projectsApi.service";

export enum FEED_RETRIEVAL_METHOD {
    FETCHED_AUTOMATICALLY = <any>'FETCHED_AUTOMATICALLY',
    PRODUCED_IN_HOUSE = <any>'PRODUCED_IN_HOUSE',
    MANUALLY_UPLOADED = <any>'MANUALLY_UPLOADED'
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
}

export type ILicense = {
    id: string,
    name: string,
    originalFileName: string,
    feedIds: string[]
}

export type IFeed = IFeedApi & {
    region: string,
    state: string,
    country: string
}

export type IBounds = {
    north: number,
    east: number,
    south: number,
    west: number
}

export type FeedsGetResponse = {
    feeds: IFeed[]
}

export type FeedsGetParams = {
    secure: boolean,
    sortOrder: SortOrder,
    bounds: IBounds
}


@Injectable()
export class FeedsApiService extends AbstractApiService {
    private FEED_PUBLIC_URL: string;
    private FEED_SECURE_URL: string;
    private FEED_PUBLIC_VERSION_URL: string;
    private FEED_SECURE_VERSION_URL: string;
    private FEED_DOWNLOAD_URL: string;
    private FEED_NOTES: string;
    public FEED_LICENSE: string;
    public FEED_MISC_DATA: string;
    private FEED_STOPS_URL:string;
    private SECURE_URL: string;

    constructor(
        protected http: Http,
        protected authHttp: AuthHttp,
        protected authConfig: AuthConfig,
        protected config: Configuration,
        protected projectsApiService: ProjectsApiService,
        protected uploadService: UploadService,
        protected localFilters: LocalFiltersService)
    {
        super(http, authHttp, authConfig, config);
        this.SECURE_URL = this.config.ROOT_API + '/api/manager/secure';
        this.FEED_PUBLIC_URL = this.config.ROOT_API + "/api/manager/public/feedsource";
        this.FEED_SECURE_URL = this.config.ROOT_API + "/api/manager/secure/feedsource";
        this.FEED_PUBLIC_VERSION_URL = this.config.ROOT_API + "/api/manager/public/feedversion";
        this.FEED_SECURE_VERSION_URL = this.config.ROOT_API + "/api/manager/secure/feedversion";
        this.FEED_DOWNLOAD_URL = this.config.ROOT_API + "/api/manager/downloadfeed";
        this.FEED_NOTES = this.config.ROOT_API + "/api/manager/secure/note?type=FEED_SOURCE&objectId="
        this.FEED_LICENSE = this.config.LICENSE_API + "/api/metadata/" + this.config.LICENSE_API_VERSION + "/secure/license";
        this.FEED_MISC_DATA = this.config.LICENSE_API + "/api/metadata/" + this.config.LICENSE_API_VERSION + "/secure/miscdata";
        this.FEED_STOPS_URL = this.config.ROOT_API + '/api/manager/secure/stop';
    }

    public create(name: string, projectId: string, isPublic: boolean): Observable<IFeedApi> {
        let data = JSON.stringify({
            name: name,
            projectId: projectId,
            isPublic: isPublic
        });
        return this.authHttp.post(this.FEED_SECURE_URL, data).map(response => response.json());
    }

    public setPublic(feedSourceId: string, value: boolean): Observable<IFeedApi> {
        return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({isPublic: value}))
            .map(response=>response.json());
    }

    public setName(feedSourceId: string, value: string): Observable<IFeedApi> {
        return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({name: value}))
            .map(response=>response.json());
    }

    public setFile(feedSourceId: string, file: File): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        return this.uploadService.upload(this.FEED_SECURE_VERSION_URL + "?feedSourceId=" + feedSourceId+"&lastModified="+file.lastModifiedDate.getTime(), formData, this.computeAuthHeaders());
    }

    public delete(feedSourceId: string): Observable<any> {
        return this.authHttp.delete(this.FEED_SECURE_URL + "/" + feedSourceId);
    }

    public getDownloadUrl(feed: IFeedApi, versionId: string): Observable<string> {
        if (feed.url && !versionId) {
            // direct download from the source
            return Observable.of(feed.url);
        }
        // download with a token
        return this.http.get(this.FEED_PUBLIC_VERSION_URL + '/' + (versionId ? versionId : feed.latestVersionId) + '/downloadtoken')
            .map(response => response.json())
            .map(result => this.FEED_DOWNLOAD_URL + '/' + result.id)
    }

    public fetch(feedSourceId: string): Observable<any> {
        return this.authHttp.post(this.FEED_SECURE_URL + '/' + feedSourceId + '/fetch', "")
            .map(response => response.json())
    }

    public getPublic(feedSourceId: string): Promise<any> {
        return this.http.get(this.FEED_PUBLIC_URL + '/' + feedSourceId).map(response => response.json()).toPromise();
    }

    public get(feedSourceId: string): Observable<IFeedApi> {
        return this.authHttp.get(this.FEED_SECURE_URL + '/' + feedSourceId)
            .map(response => response.json())
    }

    public getNotes(feedSourceId: string): Promise<any>{
        return this.authHttp.get(this.FEED_NOTES + feedSourceId).map(response => response.json()).toPromise();
    }

    public addNotes(feedSourceId: string, note: string): Observable<any>{
        return this.authHttp.post(this.FEED_NOTES + feedSourceId, note).map(response => response.json())
    }

    public getLicenses() : Promise<any> {
        return this.http.get(this.FEED_LICENSE).map(response => response.json()).toPromise();
    }

    public getMiscDatas() : Promise<any> {
        return this.http.get(this.FEED_MISC_DATA).map(response => response.json()).toPromise();
    }

    public createLicense(name: string, file: File, feedIds: string[]) : Observable<ILicense> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_LICENSE + '?name=' + name + '&feeds=' + feedIds, formData, this.computeAuthHeaders());
    }

    public createMiscData(name: string, file: File, feedIds: string[]) : Observable<ILicense> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_MISC_DATA + '?name=' + name + '&feeds=' + feedIds, formData, this.computeAuthHeaders());
    }

    private getMultipartHeader(){
      let myHeader = new Headers();
      myHeader.append('Content-Type', 'multipart/form-data');
      return myHeader;
    }

    public setLicense(feedIds: string[], licenseId: string): Observable<ILicense>{
        let params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_LICENSE + '/' + licenseId + params , null, { headers: this.getMultipartHeader() }).map(response => response.json());
    }

    public unsetLicense(feedIds: string[], licenseId: string): Observable<ILicense>{
        let params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_LICENSE + "/" + licenseId + params, null, { headers: this.getMultipartHeader() }).map(response => response.json());
    }

    public setMiscData(feedIds: string[], licenseId: string): Observable<ILicense>{
        let params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_MISC_DATA + "/" + licenseId + params , null, { headers: this.getMultipartHeader() }).map(response => response.json());
    }

    public unsetMiscData(feedIds: string[], licenseId: string): Observable<ILicense>{
        let params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_MISC_DATA + "/" + licenseId + params, null, { headers: this.getMultipartHeader() }).map(response => response.json());
    }

    public deletMiscData(licenseId: string): Observable<ILicense>{
        return this.authHttp.delete(this.FEED_MISC_DATA + "/" + licenseId).map(response => response.json());
    }

    public getList(params: FeedsGetParams): Observable<FeedsGetResponse> {
        let projects;
        if (params.secure) {
            projects = this.projectsApiService.getSecureList(params.bounds, params.sortOrder);
            console.log("GET LIST", projects);
        }
        else {
            projects = this.projectsApiService.getPublicList(params.bounds, params.sortOrder);
        }
        return this.adaptFeedsResponse(projects, params.secure, params.bounds, params.sortOrder);
    }

    protected adaptFeedsResponse(projectsObservable: Observable<IProject[]>, retrieveSecureFeeds: boolean, bounds: IBounds, sortOrder: SortOrder): Observable<FeedsGetResponse> {
        return projectsObservable.flatMap(project => project)
            .map(p => this.feedsFromProject(p, retrieveSecureFeeds))
            .mergeAll()
            .flatMap(feeds => feeds)
            .toArray()
            .map(feedArray => {
                if (bounds) {
                    feedArray = this.localFilters.filterFeedsInArea(feedArray, bounds)
                }
                if (sortOrder) {
                    feedArray = this.localFilters.sortFeeds(feedArray, sortOrder)
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
        let regionStateCountryData = this.computeRegionStateCountryData(project.name, feedApi.regions);
        return Object.assign({}, feedApi, regionStateCountryData);
    }

    computeRegionStateCountryData(projectName: string, feedRegions: any[]): any {
        let region = "", state = "", country = "";
        if (feedRegions && feedRegions[0]) {
            let splitDatas = projectName.split(',');
            // indice n-1=country, n-2=state, n-3=region
            country = splitDatas.shift();
            if (splitDatas.length > 0) {
                state = country;
                country = splitDatas.shift();
            }
            if (splitDatas.length > 0) {
                region = state;
                state = country;
                country = splitDatas.shift();
            }
        }
        return {
            region: region,
            state: state,
            country: country
        };
    }

    getSecureFeeds(projectId: string): Observable<IFeedApi[]> {
        return this.authHttp.get(this.FEED_SECURE_URL + "?projectId=" + projectId)
            .map(response => response.json());
    }

    public getFeedVersions(feedSourceId: string, isPublic: boolean) : Promise<any> {
        if (isPublic){
          return this.http.get(this.FEED_PUBLIC_VERSION_URL + '?feedSourceId=' + feedSourceId).map(response => response.json()).toPromise();
        }else{
            return this.authHttp.get(this.FEED_SECURE_VERSION_URL + '?feedSourceId=' + feedSourceId).map(response => response.json()).toPromise();
        }
    }

    public getStops(feedId:string):Promise<any>{
      return this.authHttp.get(this.FEED_STOPS_URL + '?feedId=' + feedId).map(response => response.json()).toPromise();
    }

    public getStop(feedId:string, stopId:string):Promise<any>{
      return this.authHttp.get(this.FEED_STOPS_URL + '/' + stopId + '?feedId=' + feedId).map(response => response.json()).toPromise();
    }

    public getRoutes(feedId:string):Promise<any>{
      var url = this.SECURE_URL + '/route'
      return this.authHttp.get(url + '?feedId=' + feedId).map(response => response.json()).toPromise();
    }

    public getRouteTripPattern(feedId:string, routeId: string):Promise<any>{
      var url = this.SECURE_URL + '/trippattern'
      return this.authHttp.get(url + '?feedId=' + feedId + '&routeId=' + routeId).map(response => response.json()).toPromise();
    }


}

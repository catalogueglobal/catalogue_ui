import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Configuration} from "../../configuration";
import {AbstractApiService} from "./abstractApi.service";
import {ProjectsApiService, IProject} from "./projectsApi.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {UploadService} from "../upload.service";
import {SortOrder} from "../../directives/sort-link/sort-link.component";
import {LocalFiltersService} from "./localFilters.service";

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

  constructor(protected http: Http, protected authHttp: AuthHttp, protected authConfig: AuthConfig, protected config: Configuration, protected projectsApiService: ProjectsApiService, protected uploadService: UploadService, protected localFilters: LocalFiltersService) {
    super(http, authHttp, authConfig, config);
    this.FEED_PUBLIC_URL = this.config.ROOT_API + "/api/manager/public/feedsource";
    this.FEED_SECURE_URL = this.config.ROOT_API + "/api/manager/secure/feedsource";
    this.FEED_PUBLIC_VERSION_URL = this.config.ROOT_API + "/api/manager/public/feedversion";
    this.FEED_SECURE_VERSION_URL = this.config.ROOT_API + "/api/manager/secure/feedversion";
    this.FEED_DOWNLOAD_URL = this.config.ROOT_API + "/api/manager/downloadfeed";
    this.FEED_NOTES = this.config.ROOT_API + "/api/manager/secure/note?type=FEED_SOURCE&objectId="
  }

  public create(name: string, projectId: string, isPublic: boolean): Observable<IFeedApi> {
    let data = JSON.stringify({
      name: name,
      projectId: projectId,
      isPublic: isPublic
    });
    return this.authHttp.post(this.FEED_SECURE_URL, data)
      .map <IFeedApi>(response => response.json());
  }

  public setPublic(feedSourceId: string, value: boolean): Observable<IFeedApi> {
    return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({isPublic: value}))
      .map<IFeedApi>(response=>response.json());
  }

  public setName(feedSourceId: string, value: string): Observable<IFeedApi> {
    return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({name: value}))
      .map<IFeedApi>(response=>response.json());
  }

  public setFile(feedSourceId: string, file: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);

    return this.uploadService.upload(this.FEED_SECURE_VERSION_URL + "?feedSourceId=" + feedSourceId, formData, this.computeAuthHeaders());
  }

  public delete(feedSourceId: string): Observable<any> {
    return this.authHttp.delete(this.FEED_SECURE_URL + "/" + feedSourceId);
  }

  public getDownloadUrl(feed: IFeedApi): Observable<string> {
    if (feed.url) {
      // direct download from the source
      return Observable.of(feed.url);
    }

    // download with a token
    return this.http.get(this.FEED_PUBLIC_VERSION_URL + '/' + feed.latestVersionId + '/downloadtoken')
      .map(response => response.json())
      .map(result => this.FEED_DOWNLOAD_URL + '/' + result.id)
  }

  public fetch(feedSourceId: string): Observable<any> {
    return this.authHttp.post(this.FEED_SECURE_URL + '/' + feedSourceId + '/fetch', "")
      .map(response => response.json())
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
      .map <IFeedApi[]>(response => response.json());
  }

}

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

export type UserSubscribeParams = {
  NAME: string,
  EMAIL: string,
  COMPANY: string,
  TYPE: string
}


@Injectable()
export class UsersApiService extends AbstractApiService {
  private USER_SUBSCRIBE_URL: string;

  constructor(protected http: Http, protected authHttp: AuthHttp, protected authConfig: AuthConfig, protected config: Configuration, protected projectsApiService: ProjectsApiService, protected uploadService: UploadService, protected localFilters: LocalFiltersService) {
    super(http, authHttp, authConfig, config);
    this.USER_SUBSCRIBE_URL = this.config.USER_SUBSCRIBE_URL
  }

  public subscribe(subscribeParams: UserSubscribeParams): Observable<any> {
    let data = JSON.stringify({
      NAME: subscribeParams.NAME,
      EMAIL: subscribeParams.EMAIL,
      COMPANY: subscribeParams.COMPANY,
      TYPE: subscribeParams.TYPE,

      // values from wordpress
      _mc4wp_form_element_id: 'mc4wp-form-1',
      _mc4wp_form_id: '103',
      _mc4wp_honeypot:'',
      _mc4wp_timestamp: Date.now()
    });
    return this.http.post(this.USER_SUBSCRIBE_URL, data);
  }
}

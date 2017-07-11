import { Injectable }           from '@angular/core';
import { Http }                 from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Observable }           from 'rxjs/Rx';
import { Configuration }        from '../configuration';
import {
    SortOrder,
    IFeedApi,
    IBounds,
    IProject
} from 'app/modules/common';
import { AbstractApiService }   from './abstractApi.service';

@Injectable()
export class ProjectsApiService extends AbstractApiService {
    private PROJECT_SECURE_URL: string;
    private PROJECT_PUBLIC_URL: string;

    constructor(
        protected http: Http,
        protected authHttp: AuthHttp,
        protected authConfig: AuthConfig,
        protected config: Configuration) {
        super(http, authHttp, authConfig, config);
        this.PROJECT_SECURE_URL = this.config.ROOT_API + '/api/manager/secure/project';
        this.PROJECT_PUBLIC_URL = this.config.ROOT_API + '/api/manager/public/project';
    }

    public create(name: string): Observable<IProject> {
        let params = JSON.stringify({
            name: name
        });
        return this.authHttp.post(this.PROJECT_SECURE_URL, params).map(response => response.json());
    }

    public delete(projectId: string): Observable<any> {
        return this.authHttp.delete(this.PROJECT_SECURE_URL + '/' + projectId);
    }

    public getPublicList(bounds: IBounds, sortOrder: SortOrder): Observable<IProject[]> {
        return this.http.get(this.PROJECT_PUBLIC_URL + '?' + this.sortQuery(sortOrder) + '&' + this.boundsQuery(bounds))
            .map(response => response.json());
    }

    public getSecureList(bounds: IBounds, sortOrder: SortOrder): Observable<IProject[]> {
        return this.authHttp.get(this.PROJECT_SECURE_URL + '?' + this.sortQuery(sortOrder) +
            '&' + this.boundsQuery(bounds)).map(response => response.json());
    }

    public getPublicProject(projectId: string): Promise<IProject> {
        return this.http.get(this.PROJECT_PUBLIC_URL + '/' + projectId).map(response => response.json()).toPromise();
    }

    public getAllSecureProject(): Observable<IProject[]> {
        return this.authHttp.get(this.PROJECT_SECURE_URL).map(response => response.json());
    }

    public getPrivateProject(projectId: string): Promise<IProject> {
        return this.authHttp.get(this.PROJECT_SECURE_URL + '/' + projectId)
            .map(response => response.json()).toPromise();
    }

    public updateProject(project: JSON, projectId: string): Observable<IProject> {
        return this.authHttp.put(this.PROJECT_SECURE_URL + '/' + projectId, JSON.stringify(project))
            .map(response => response.json());
    }

    private sortQuery(sortOrder: SortOrder) {
        if (!sortOrder) {
            return '';
        }
        return 'sort=' + sortOrder.sort + '&order=' + sortOrder.order;
    }

    private boundsQuery(bounds: IBounds) {
        if (!bounds) {
            return '';
        }
        return 'north=' + bounds.north + '&south=' + bounds.south + '&east=' + bounds.east + '&west=' + bounds.west;
    }
}

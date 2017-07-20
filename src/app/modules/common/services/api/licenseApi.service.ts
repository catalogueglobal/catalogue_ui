import { Injectable }                   from '@angular/core';
import { Http }                         from '@angular/http';
import { AuthHttp, AuthConfig }         from 'angular2-jwt';
import { Observable }                   from 'rxjs/Rx';
import { Configuration }                from '../configuration';
import { UtilsService } from '../utils.service';
import { ILicense } from 'app/modules/common';
import { UploadService }                from '../upload.service';
import { AbstractApiService }           from './abstractApi.service';

@Injectable()
export class LicenseApiService extends AbstractApiService {
    public FEED_LICENSE: string;
    public FEED_MISC_DATA: string;

    constructor(
        protected http: Http,
        protected authHttp: AuthHttp,
        protected authConfig: AuthConfig,
        protected config: Configuration,
        protected uploadService: UploadService,
        private utilsService: UtilsService) {
        super(http, authHttp, authConfig, config);
        this.FEED_LICENSE = this.config.LICENSE_API +
            '/api/metadata/' + this.config.LICENSE_API_VERSION + '/secure/license';
        this.FEED_MISC_DATA = this.config.LICENSE_API + '/api/metadata/' +
            this.config.LICENSE_API_VERSION + '/secure/miscdata';
    }

    public getLicenses(): Promise<any> {
        return this.http.get(this.FEED_LICENSE, { headers: this.utilsService.getHeader() })
            .map(response => response.json()).toPromise();
    }

    public getMiscDatas(): Promise<any> {
        return this.http.get(this.FEED_MISC_DATA, { headers: this.utilsService.getHeader() })
            .map(response => response.json()).toPromise();
    }

    public createLicense(name: string, file: File, feedIds: string[]): Observable<ILicense> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_LICENSE + '?name=' + name + '&feeds=' +
            feedIds, formData, this.computeAuthHeaders());
    }

    public createMiscData(name: string, file: File, feedIds: string[]): Observable<ILicense> {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.FEED_MISC_DATA + '?name=' + name +
            '&feeds=' + feedIds, formData, this.computeAuthHeaders());
    }

    public setLicense(feedIds: string[], licenseId: string): Observable<ILicense> {
        let params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_LICENSE + '/' + licenseId + params, null,
            { headers: this.utilsService.getHeader(true) }).map(response => response.json());
    }

    public unsetLicense(feedIds: string[], licenseId: string): Observable<ILicense> {
        let params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_LICENSE + '/' + licenseId + params, null,
            { headers: this.utilsService.getHeader(true) }).map(response => response.json());
    }

    public setMiscData(feedIds: string[], licenseId: string): Observable<ILicense> {
        let params = '?feeds=' + feedIds.toString();
        return this.authHttp.put(this.FEED_MISC_DATA + '/' + licenseId + params, null,
            { headers: this.utilsService.getHeader(true) }).map(response => response.json());
    }

    public unsetMiscData(feedIds: string[], licenseId: string): Observable<ILicense> {
        let params = '?feeds=' + feedIds.toString() + '&action=remove';
        return this.authHttp.put(this.FEED_MISC_DATA + '/' + licenseId + params, null,
            { headers: this.utilsService.getHeader(true) }).map(response => response.json());
    }

    public deletMiscData(licenseId: string): Observable<ILicense> {
        return this.authHttp.delete(this.FEED_MISC_DATA + '/' + licenseId).map(response => response.json());
    }
}

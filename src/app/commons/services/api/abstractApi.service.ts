import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Configuration} from "../../configuration";
import {AuthHttp, AuthConfig} from "angular2-jwt";
//import {Map} from "@angular/core/src/facade/collection";

@Injectable()
export abstract class AbstractApiService {

    constructor(
	protected http: Http,
	protected authHttp: AuthHttp,
	protected authConfig: AuthConfig,
	protected config: Configuration)
    {
    }
    
    protected computeAuthHeaders(): Map<string,string> {
	let headers: Map<string,string> = new Map<string,string>();
	headers.set(this.authConfig.headerName,
		    this.authConfig.headerPrefix + this.authConfig.tokenGetter());
	console.log("computeAuthHeaders", headers, this.authConfig);
	return headers;
    }
}

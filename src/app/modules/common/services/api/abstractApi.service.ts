import { Injectable }           from "@angular/core";
import { Http }                 from "@angular/http";
import { AuthHttp, AuthConfig } from "angular2-jwt";
import { Configuration }        from "../configuration";

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
	    headers.set(this.authConfig.getConfig().headerName, this.authConfig.getConfig().headerPrefix + this.authConfig.getConfig().tokenGetter());
	    //console.log("computeAuthHeaders", headers, this.authConfig);
	    return headers;
    }

    protected computeDefaultHeaders(): Map<string,string> {
		let headers: Map<string,string> = new Map<string,string>();
		return headers;
	}
}

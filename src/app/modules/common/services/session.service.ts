import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt/angular2-jwt';
import { LocalStorage }    from 'ng2-webstorage';
import { Configuration }   from 'app/modules/common/';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export type Session = {
    user: any,
    token: string
};

const SESSION = 'SESSION';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class SessionService {
    public userId: string;
    public tokenId: string;

    private lock: any;
    userProfile: any;
    tokenName = 'id_token';
    userIdTokenName = 'Catalogue.userId';
    public loggedIn$ = new BehaviorSubject(false);

    constructor(private config: Configuration) {
        let options = {
            theme: {
                logo: 'images/logo-horizontal-blanc.png',
                primaryColor: '#dea627',
                authButtons: {
                    connectionName: {
                        primaryColor: '#dea627'
                    }
                }
            },
            languageDictionary: {
                title: 'Catalogue'
            },
            auth: {
                redirect: false,
                responseType: 'token',
                params: {
                    scope: 'openid'
                }
            },
            autoclose: true
        };

        this.lock = new Auth0Lock(this.config.AUTH_ID, this.config.AUTH_DOMAIN, options);
        if (this.loggedIn) {
            this.setProfile();
        }
        this.authenticate();
    }

    private authenticate() {
        this.lock.on('authenticated', (authResult) => {
            localStorage.setItem(this.tokenName, authResult.idToken);
            this.setProfile();
            this.loggedIn$.next(this.loggedIn);
            console.log('authenticated');
        });
    }

    public get loggedIn(): boolean {
        return tokenNotExpired(null, localStorage.getItem(this.tokenName));
    }

    public login() {
        this.lock.show();
        return false;
    }

    // configured as HttpAuth tokenGetter
    public _tokenGetter() {
        if (!this.loggedIn) {
            return null;
        }
        return localStorage.getItem(this.tokenName);
    }

    public setProfile() {
        if (!this.loggedIn) {
            this.userProfile = null;
        } else {
            this.userProfile = null;
            this.lock.getProfile(localStorage.getItem(this.tokenName), (error, profile) => {
                if (error) {
                    this.userProfile = null;
                    return;
                }
                localStorage.setItem(this.userIdTokenName, profile.user_id);
                this.userId = localStorage.getItem(this.userIdTokenName);
                this.tokenId = localStorage.getItem(this.tokenName);
                this.userProfile = profile;
            });
        }
    }

    public logout(): void {
        this.userProfile = null;
        localStorage.removeItem(this.tokenName);
        localStorage.removeItem(this.userIdTokenName);
    }
}

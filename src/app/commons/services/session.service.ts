import {Injectable} from "@angular/core";
import {LocalStorage, SessionStorageService} from "ng2-webstorage";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";
import {Configuration} from "../configuration";
import {Observable} from "rxjs/Rx";

export type Session = {
  user:any,
  token:string
}

const SESSION = "SESSION";

// Avoid name not found warnings
declare var  Auth0Lock:any;

@Injectable()
export class SessionService {
  @LocalStorage() session:Session;
  private lock:any;

  constructor(private config:Configuration) {
    var options = {
        theme: {
          primaryColor: 'red',
          authButtons: {
            connectionName: {
              primaryColor: 'green'
            }
          }
        } 
    }
    this.lock = new Auth0Lock(this.config.AUTH_ID, this.config.AUTH_DOMAIN, options);
  }

  // configured as HttpAuth tokenGetter
  public _tokenGetter() {
    if (!this.session) {
      console.log("_tokenGetter: null");
      return null;
    }
    return this.session.token;
  }

  public get loggedIn():boolean {
    this.checkTokenNotExpired();
    return this.session ? true : false;
  }

  public login() {
    let that = this;
    this.showLogin().subscribe(
      session => {
        that.session = session;
        console.log("login success", that.session);
      },
      (err) => {
        console.log('login error', err);
      }
    );
    return false;
  }

  private checkTokenNotExpired() {
    if (this.session && !tokenNotExpired(null, this.session.token)) {
      console.log('token expired => logout');
      this.logout();
    }
  }

  private showLogin():Observable<Session> {
    return Observable.create(observer => {
      // Show the Auth0 Lock widget
      this.lock.show({}, (err, profile, token) => {
        if (err) {
          observer.error(err);
          return;
        }

        let session = {
          user: profile,
          token: token
        };
        observer.next(session);
      });
    })
  }

  public logout():void {
    this.session = null;
  }

}

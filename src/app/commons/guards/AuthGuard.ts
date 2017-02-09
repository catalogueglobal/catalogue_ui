import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService }      from "../services/session.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private sessionService: SessionService,
        private router: Router)
    {
    }

    canActivate() {
        if (!this.sessionService.loggedIn) {
            console.log("AuthGuard: no session, route denied");
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}

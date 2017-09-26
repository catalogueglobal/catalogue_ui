"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var angular2_jwt_1 = require("angular2-jwt/angular2-jwt");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
/*import {
    Configuration,
    Session
} from 'app/modules/common/';
*/
var SESSION = 'SESSION';
var SessionService = (function () {
    function SessionService(config) {
        this.config = config;
        this.tokenName = 'id_token';
        this.userIdTokenName = 'Catalogue.userId';
        this.loggedIn$ = new BehaviorSubject_1.BehaviorSubject(false);
        var options = {
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
    SessionService.prototype.authenticate = function () {
        var _this = this;
        this.lock.on('authenticated', function (authResult) {
            localStorage.setItem(_this.tokenName, authResult.idToken);
            _this.setProfile();
            _this.loggedIn$.next(_this.loggedIn);
            console.log('authenticated');
        });
    };
    Object.defineProperty(SessionService.prototype, "loggedIn", {
        get: function () {
            return angular2_jwt_1.tokenNotExpired(null, localStorage.getItem(this.tokenName));
        },
        enumerable: true,
        configurable: true
    });
    SessionService.prototype.login = function () {
        this.lock.show();
        return false;
    };
    // configured as HttpAuth tokenGetter
    SessionService.prototype._tokenGetter = function () {
        if (!this.loggedIn) {
            return null;
        }
        return localStorage.getItem(this.tokenName);
    };
    SessionService.prototype.setProfile = function () {
        var _this = this;
        if (!this.loggedIn) {
            this.userProfile = null;
        }
        else {
            this.userProfile = null;
            this.lock.getProfile(localStorage.getItem(this.tokenName), function (error, profile) {
                if (error) {
                    _this.userProfile = null;
                    return;
                }
                localStorage.setItem(_this.userIdTokenName, profile.user_id);
                _this.userId = localStorage.getItem(_this.userIdTokenName);
                _this.tokenId = localStorage.getItem(_this.tokenName);
                _this.userProfile = profile;
            });
        }
    };
    SessionService.prototype.logout = function () {
        this.userProfile = null;
        localStorage.removeItem(this.tokenName);
        localStorage.removeItem(this.userIdTokenName);
    };
    return SessionService;
}());
SessionService = __decorate([
    core_1.Injectable()
], SessionService);
exports.SessionService = SessionService;

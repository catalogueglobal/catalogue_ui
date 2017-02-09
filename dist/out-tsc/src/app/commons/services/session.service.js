var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { tokenNotExpired } from "angular2-jwt/angular2-jwt";
import { LocalStorage } from "ng2-webstorage";
import { Observable } from "rxjs/Rx";
import { Configuration } from "../configuration";
var SESSION = "SESSION";
export var SessionService = (function () {
    function SessionService(config) {
        this.config = config;
        var options = {
            theme: {
                primaryColor: 'blue',
                authButtons: {
                    connectionName: {
                        primaryColor: 'green'
                    }
                }
            },
            languageDictionary: {
                title: "Catalogue"
            }
        };
        this.lock = new Auth0Lock(this.config.AUTH_ID, this.config.AUTH_DOMAIN, options);
    }
    // configured as HttpAuth tokenGetter
    SessionService.prototype._tokenGetter = function () {
        if (!this.session) {
            console.log("_tokenGetter: null");
            return null;
        }
        return this.session.token;
    };
    Object.defineProperty(SessionService.prototype, "loggedIn", {
        get: function () {
            this.checkTokenNotExpired();
            return this.session ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    SessionService.prototype.login = function () {
        var that = this;
        this.showLogin().subscribe(function (session) {
            that.session = session;
            console.log("login success", that.session);
        }, function (err) {
            console.log('login error', err);
        });
        return false;
    };
    SessionService.prototype.checkTokenNotExpired = function () {
        if (this.session && !tokenNotExpired(null, this.session.token)) {
            console.log('token expired => logout');
            this.logout();
        }
    };
    SessionService.prototype.showLogin = function () {
        var _this = this;
        return Observable.create(function (observer) {
            // Show the Auth0 Lock widget
            _this.lock.show({}, function (err, profile, token) {
                if (err) {
                    observer.error(err);
                    return;
                }
                var session = {
                    user: profile,
                    token: token
                };
                observer.next(session);
            });
        });
    };
    SessionService.prototype.logout = function () {
        this.session = null;
    };
    __decorate([
        LocalStorage(), 
        __metadata('design:type', Object)
    ], SessionService.prototype, "session", void 0);
    SessionService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Configuration])
    ], SessionService);
    return SessionService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/session.service.js.map
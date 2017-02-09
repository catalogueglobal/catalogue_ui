var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from "../services/session.service";
export var AuthGuard = (function () {
    function AuthGuard(sessionService, router) {
        this.sessionService = sessionService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        if (!this.sessionService.loggedIn) {
            console.log("AuthGuard: no session, route denied");
            this.router.navigate(['']);
            return false;
        }
        return true;
    };
    AuthGuard = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [SessionService, Router])
    ], AuthGuard);
    return AuthGuard;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/guards/AuthGuard.js.map
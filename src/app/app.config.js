"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AppConfig = AppConfig_1 = (function () {
    function AppConfig(data) {
        this.data = data;
    }
    AppConfig.loadInstance = function (jsonFile) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType('application/json');
            xobj.open('GET', jsonFile, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState === 4) {
                    if (xobj.status === 200) {
                        _this.cache[jsonFile] = new AppConfig_1(JSON.parse(xobj.responseText));
                        resolve();
                    }
                    else {
                        reject("Could not load file '" + jsonFile + "': " + xobj.status);
                    }
                }
            };
            xobj.send(null);
        });
    };
    AppConfig.getInstance = function (jsonFile) {
        if (jsonFile in this.cache) {
            return this.cache[jsonFile];
        }
        throw "Could not find config '" + jsonFile + "', did you load it?";
    };
    AppConfig.prototype.get = function (key) {
        if (this.data === null) {
            return null;
        }
        if (key in this.data) {
            return this.data[key];
        }
        return null;
    };
    return AppConfig;
}());
AppConfig.cache = {};
AppConfig = AppConfig_1 = __decorate([
    core_1.Injectable()
], AppConfig);
exports.AppConfig = AppConfig;
var AppConfig_1;

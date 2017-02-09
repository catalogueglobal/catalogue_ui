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
import { Observable } from 'rxjs/Rx';
export var UploadService = (function () {
    function UploadService() {
    }
    UploadService.prototype.upload = function (url, formData, headers) {
        return Observable.create(function (observer) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange =
                function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status == 302 || xhr.status == 304) {
                            //observer.next(JSON.parse(xhr.response));&
                            observer.complete();
                        }
                        else {
                            observer.error(xhr.response);
                        }
                    }
                };
            xhr.upload.onprogress =
                function (event) {
                    var progress = Math.round(event.loaded / event.total * 100);
                    observer.next(progress);
                };
            xhr.open('POST', url, true);
            if (headers) {
                headers.forEach(function (value, name) {
                    xhr.setRequestHeader(name, value);
                });
            }
            xhr.send(formData);
        });
    };
    UploadService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], UploadService);
    return UploadService;
}());
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/upload.service.js.map
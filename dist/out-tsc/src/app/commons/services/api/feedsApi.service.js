var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { Http } from "@angular/http";
import { AuthHttp, AuthConfig } from "angular2-jwt";
import { Observable } from "rxjs/Rx";
import { Configuration } from "../../configuration";
import { UploadService } from "../upload.service";
import { AbstractApiService } from "./abstractApi.service";
import { LocalFiltersService } from "./localFilters.service";
import { ProjectsApiService } from "./projectsApi.service";
export var FEED_RETRIEVAL_METHOD;
(function (FEED_RETRIEVAL_METHOD) {
    FEED_RETRIEVAL_METHOD[FEED_RETRIEVAL_METHOD["FETCHED_AUTOMATICALLY"] = 'FETCHED_AUTOMATICALLY'] = "FETCHED_AUTOMATICALLY";
    FEED_RETRIEVAL_METHOD[FEED_RETRIEVAL_METHOD["PRODUCED_IN_HOUSE"] = 'PRODUCED_IN_HOUSE'] = "PRODUCED_IN_HOUSE";
    FEED_RETRIEVAL_METHOD[FEED_RETRIEVAL_METHOD["MANUALLY_UPLOADED"] = 'MANUALLY_UPLOADED'] = "MANUALLY_UPLOADED";
})(FEED_RETRIEVAL_METHOD || (FEED_RETRIEVAL_METHOD = {}));
export var FeedsApiService = (function (_super) {
    __extends(FeedsApiService, _super);
    function FeedsApiService(http, authHttp, authConfig, config, projectsApiService, uploadService, localFilters) {
        _super.call(this, http, authHttp, authConfig, config);
        this.http = http;
        this.authHttp = authHttp;
        this.authConfig = authConfig;
        this.config = config;
        this.projectsApiService = projectsApiService;
        this.uploadService = uploadService;
        this.localFilters = localFilters;
        this.FEED_PUBLIC_URL = this.config.ROOT_API + "/api/manager/public/feedsource";
        this.FEED_SECURE_URL = this.config.ROOT_API + "/api/manager/secure/feedsource";
        this.FEED_PUBLIC_VERSION_URL = this.config.ROOT_API + "/api/manager/public/feedversion";
        this.FEED_SECURE_VERSION_URL = this.config.ROOT_API + "/api/manager/secure/feedversion";
        this.FEED_DOWNLOAD_URL = this.config.ROOT_API + "/api/manager/downloadfeed";
        this.FEED_NOTES = this.config.ROOT_API + "/api/manager/secure/note?type=FEED_SOURCE&objectId=";
        this.FEED_LICENSE = this.config.LICENSE_API + "/api/metadata/" + this.config.LICENSE_API_VERSION + "/secure/license";
    }
    FeedsApiService.prototype.create = function (name, projectId, isPublic) {
        var data = JSON.stringify({
            name: name,
            projectId: projectId,
            isPublic: isPublic
        });
        return this.authHttp.post(this.FEED_SECURE_URL, data).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setPublic = function (feedSourceId, value) {
        return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({ isPublic: value }))
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setName = function (feedSourceId, value) {
        return this.authHttp.put(this.FEED_SECURE_URL + "/" + feedSourceId, JSON.stringify({ name: value }))
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setFile = function (feedSourceId, file) {
        var formData = new FormData();
        formData.append("file", file, file.name);
        return this.uploadService.upload(this.FEED_SECURE_VERSION_URL + "?feedSourceId=" + feedSourceId, formData, this.computeAuthHeaders());
    };
    FeedsApiService.prototype.delete = function (feedSourceId) {
        return this.authHttp.delete(this.FEED_SECURE_URL + "/" + feedSourceId);
    };
    FeedsApiService.prototype.getDownloadUrl = function (feed) {
        var _this = this;
        if (feed.url) {
            // direct download from the source
            return Observable.of(feed.url);
        }
        // download with a token
        return this.http.get(this.FEED_PUBLIC_VERSION_URL + '/' + feed.latestVersionId + '/downloadtoken')
            .map(function (response) { return response.json(); })
            .map(function (result) { return _this.FEED_DOWNLOAD_URL + '/' + result.id; });
    };
    FeedsApiService.prototype.fetch = function (feedSourceId) {
        return this.authHttp.post(this.FEED_SECURE_URL + '/' + feedSourceId + '/fetch', "")
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getPublic = function (feedSourceId) {
        return this.http.get(this.FEED_PUBLIC_URL + '/' + feedSourceId).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.get = function (feedSourceId) {
        return this.authHttp.get(this.FEED_SECURE_URL + '/' + feedSourceId)
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getNotes = function (feedSourceId) {
        return this.authHttp.get(this.FEED_NOTES + feedSourceId).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.addNotes = function (feedSourceId, note) {
        return this.authHttp.post(this.FEED_NOTES + feedSourceId, note).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getLicenses = function () {
        return this.authHttp.get(this.FEED_LICENSE).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.createLicense = function (name, text, feedIds) {
        var data = JSON.stringify({
            name: name,
            text: text,
            feedIds: feedIds
        });
        return this.authHttp.post(this.FEED_LICENSE, data).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setLicense = function (feedIds, licenseId) {
        var data = JSON.stringify({
            feedIds: feedIds
        });
        return this.authHttp.put(this.FEED_LICENSE + "/" + licenseId, data).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.unsetLicense = function (feedIds, licenseId) {
        var data = JSON.stringify({
            action: "remove",
            feedIds: feedIds
        });
        return this.authHttp.put(this.FEED_LICENSE + "/" + licenseId, data).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getList = function (params) {
        var projects;
        if (params.secure) {
            projects = this.projectsApiService.getSecureList(params.bounds, params.sortOrder);
            console.log("GET LIST", projects);
        }
        else {
            projects = this.projectsApiService.getPublicList(params.bounds, params.sortOrder);
        }
        return this.adaptFeedsResponse(projects, params.secure, params.bounds, params.sortOrder);
    };
    FeedsApiService.prototype.adaptFeedsResponse = function (projectsObservable, retrieveSecureFeeds, bounds, sortOrder) {
        var _this = this;
        return projectsObservable.flatMap(function (project) { return project; })
            .map(function (p) { return _this.feedsFromProject(p, retrieveSecureFeeds); })
            .mergeAll()
            .flatMap(function (feeds) { return feeds; })
            .toArray()
            .map(function (feedArray) {
            if (bounds) {
                feedArray = _this.localFilters.filterFeedsInArea(feedArray, bounds);
            }
            if (sortOrder) {
                feedArray = _this.localFilters.sortFeeds(feedArray, sortOrder);
            }
            return {
                feeds: feedArray
            };
        });
    };
    FeedsApiService.prototype.feedsFromProject = function (project, retrieveSecureFeeds) {
        var _this = this;
        var projectFeeds;
        if (retrieveSecureFeeds) {
            projectFeeds = this.getSecureFeeds(project.id);
        }
        else {
            projectFeeds = Observable.from([project.feedSources || []]);
        }
        return projectFeeds.flatMap(function (f) { return f; }).map(function (feedApi) { return _this.adaptFeed(project, feedApi); }).toArray();
    };
    FeedsApiService.prototype.adaptFeed = function (project, feedApi) {
        // compute region, state & country
        var regionStateCountryData = this.computeRegionStateCountryData(project.name, feedApi.regions);
        return Object.assign({}, feedApi, regionStateCountryData);
    };
    FeedsApiService.prototype.computeRegionStateCountryData = function (projectName, feedRegions) {
        var region = "", state = "", country = "";
        if (feedRegions && feedRegions[0]) {
            var splitDatas = projectName.split(',');
            // indice n-1=country, n-2=state, n-3=region
            country = splitDatas.shift();
            if (splitDatas.length > 0) {
                state = country;
                country = splitDatas.shift();
            }
            if (splitDatas.length > 0) {
                region = state;
                state = country;
                country = splitDatas.shift();
            }
        }
        return {
            region: region,
            state: state,
            country: country
        };
    };
    FeedsApiService.prototype.getSecureFeeds = function (projectId) {
        return this.authHttp.get(this.FEED_SECURE_URL + "?projectId=" + projectId)
            .map(function (response) { return response.json(); });
    };
    FeedsApiService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, AuthHttp, AuthConfig, Configuration, ProjectsApiService, UploadService, LocalFiltersService])
    ], FeedsApiService);
    return FeedsApiService;
}(AbstractApiService));
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/feedsApi.service.js.map
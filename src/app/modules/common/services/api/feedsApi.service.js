"use strict";
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
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var abstractApi_service_1 = require("./abstractApi.service");
var FeedsApiService = (function (_super) {
    __extends(FeedsApiService, _super);
    function FeedsApiService(http, authHttp, authConfig, config, projectsApiService, uploadService, localFilters, utilsService) {
        var _this = _super.call(this, http, authHttp, authConfig, config) || this;
        _this.http = http;
        _this.authHttp = authHttp;
        _this.authConfig = authConfig;
        _this.config = config;
        _this.projectsApiService = projectsApiService;
        _this.uploadService = uploadService;
        _this.localFilters = localFilters;
        _this.utilsService = utilsService;
        _this.ROOT_URL = _this.config.ROOT_API + '/api/manager/public';
        _this.FEED_URL = _this.config.ROOT_API + '/api/manager/public/feedsource';
        _this.FEED_VERSION_URL = _this.config.ROOT_API + '/api/manager/public/feedversion';
        _this.FEED_DOWNLOAD_URL = _this.config.ROOT_API + '/api/manager/downloadfeed';
        _this.FEED_NOTES = _this.config.ROOT_API + '/api/manager/public/note?type=FEED_SOURCE&objectId=';
        _this.FEED_STOPS_URL = _this.config.ROOT_API + '/api/manager/public/stop';
        return _this;
    }
    FeedsApiService.prototype.create = function (createFeed, projectId) {
        var data = {
            name: createFeed.feedName,
            projectId: projectId,
            isPublic: createFeed.isPublic,
            comments: createFeed.feedDesc,
            retrievalMethod: createFeed.retrievalMethod || 'MANUALLY_UPLOADED'
        };
        if (createFeed.retrievalMethod === 'FETCHED_AUTOMATICALLY') {
            data.autoFetchHour = 0;
            data.autoFetchMinute = 0;
            data.autoFetchFeeds = createFeed.autoFetchFeeds;
        }
        data = JSON.stringify(data);
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_URL), data).map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setPublic = function (feedSourceId, value) {
        return this.authHttp.put(this.utilsService.getSecureUrl(this.FEED_URL) + '/' +
            feedSourceId, JSON.stringify({ isPublic: value }))
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setName = function (feedSourceId, value) {
        return this.authHttp.put(this.utilsService.getSecureUrl(this.FEED_URL) + '/'
            + feedSourceId, JSON.stringify({ name: value }))
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.setFile = function (feedSourceId, file) {
        var formData = new FormData();
        formData.append('file', file, file.name);
        return this.uploadService.upload(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) +
            '?feedSourceId=' + feedSourceId + '&lastModified=' + file.lastModifiedDate.getTime(), formData, this.computeAuthHeaders());
    };
    FeedsApiService.prototype["delete"] = function (feedSourceId, versionId) {
        if (versionId) {
            return this.authHttp["delete"](this.utilsService.getSecureUrl(this.FEED_VERSION_URL) + '/' + versionId);
        }
        return this.authHttp["delete"](this.utilsService.getSecureUrl(this.FEED_URL) + '/' + feedSourceId);
    };
    FeedsApiService.prototype.getDownloadUrl = function (feed, versionId, isPublic) {
        var _this = this;
        if (feed.url && !versionId) {
            // direct download from the source
            return Rx_1.Observable.of(feed.url);
        }
        var url;
        var callback;
        if (isPublic) {
            url = this.FEED_VERSION_URL;
            callback = this.http;
        }
        else {
            url = this.utilsService.getSecureUrl(this.FEED_VERSION_URL);
            callback = this.authHttp;
        }
        // download with a token
        return callback.get(url + '/' + (versionId ? versionId : feed.latestVersionId) +
            '/downloadtoken', { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); })
            .map(function (result) { return _this.FEED_DOWNLOAD_URL + '/' + result.id; });
    };
    FeedsApiService.prototype.fetch = function (feedSourceId) {
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_URL) + '/' + feedSourceId + '/fetch', '', { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getFeed = function (feedSourceId, getPublic) {
        return getPublic ? this.http.get(this.FEED_URL + '/' + feedSourceId, { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); }).toPromise() :
            this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_URL) + '/' +
                feedSourceId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.getNotes = function (feedSourceId, isPublic) {
        if (isPublic) {
            return this.http.get(this.FEED_NOTES + feedSourceId).map(function (response) { return response.json(); }).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_NOTES) + feedSourceId)
            .map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.addNotes = function (feedSourceId, note) {
        return this.authHttp.post(this.utilsService.getSecureUrl(this.FEED_NOTES) + feedSourceId, note)
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getList = function (params) {
        var _this = this;
        var projects;
        if (params.secure) {
            projects = this.projectsApiService.getSecureList(params.bounds, params.sortOrder);
        }
        else {
            projects = this.projectsApiService.getPublicList(params.bounds, params.sortOrder);
        }
        var observableRes = Rx_1.Observable.create(function (obs) {
            projects.subscribe(function (data) {
                if (!data || data.length === 0) {
                    obs.next([]);
                    obs.complete();
                }
                else {
                    _this.adaptFeedsResponse(projects, params.secure, params.bounds, params.sortOrder).subscribe(function (response) {
                        obs.next(response);
                        obs.complete();
                    });
                }
            });
        });
        return observableRes;
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
            projectFeeds = Rx_1.Observable.from([project.feedSources || []]);
        }
        return projectFeeds.flatMap(function (f) { return f; }).map(function (feedApi) { return _this.adaptFeed(project, feedApi); }).toArray();
    };
    FeedsApiService.prototype.adaptFeed = function (project, feedApi) {
        // compute region, state & country
        var regionStateCountryData = this.utilsService.computeRegionStateCountryData(project.name, feedApi.regions);
        return Object.assign({}, feedApi, regionStateCountryData);
    };
    FeedsApiService.prototype.getSecureFeeds = function (projectId) {
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_URL) + '?projectId=' + projectId, { headers: this.utilsService.getHeader() })
            .map(function (response) { return response.json(); });
    };
    FeedsApiService.prototype.getFeedVersions = function (feedSourceId, isPublic) {
        if (isPublic) {
            return this.http.get(this.FEED_VERSION_URL + '?feedSourceId=' + feedSourceId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
        }
        else {
            return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) +
                '?feedSourceId=' + feedSourceId, { headers: this.utilsService.getHeader() })
                .map(function (response) { return response.json(); }).toPromise();
        }
    };
    FeedsApiService.prototype.getStops = function (feedId, feedVersion, isPublic) {
        if (isPublic) {
            return this.http.get(this.FEED_STOPS_URL + '?feedId=' + feedId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_STOPS_URL) + '?feedId='
            + feedId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.getRoutes = function (feedId, feedVersion, isPublic) {
        if (isPublic) {
            return this.http.get(this.ROOT_URL + '/route?feedId=' + feedId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.ROOT_URL) + '/route?feedId='
            + feedId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
    };
    FeedsApiService.prototype.getRouteTripPattern = function (feedId, feedVersion, routeId, isPublic) {
        if (isPublic) {
            return this.http.get(this.ROOT_URL + '/trippattern?feedId=' + feedId + '&routeId='
                + routeId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.ROOT_URL) + '/trippattern?feedId=' +
            feedId + '&routeId=' + routeId, { headers: this.utilsService.getHeader() }).map(function (response) {
            return response.json();
        }).toPromise();
    };
    FeedsApiService.prototype.getFeedByVersion = function (versionId, isPublic) {
        var url;
        if (isPublic) {
            return this.http.get(this.FEED_VERSION_URL + '/' + versionId, { headers: this.utilsService.getHeader() })
                .map(function (response) { return response.json(); }).toPromise();
        }
        return this.authHttp.get(this.utilsService.getSecureUrl(this.FEED_VERSION_URL) + '/' + versionId, { headers: this.utilsService.getHeader() }).map(function (response) { return response.json(); }).toPromise();
    };
    return FeedsApiService;
}(abstractApi_service_1.AbstractApiService));
FeedsApiService = __decorate([
    core_1.Injectable()
], FeedsApiService);
exports.FeedsApiService = FeedsApiService;

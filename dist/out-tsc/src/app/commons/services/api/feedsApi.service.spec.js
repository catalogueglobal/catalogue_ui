/* tslint:disable:no-unused-variable */
import { provide } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { FeedsApiService } from "./feedsApi.service";
import { Configuration } from "../../configuration";
import { ProjectsApiService } from "./projectsApi.service";
import { Http, BaseRequestOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { TranslateService } from "ng2-translate/ng2-translate";
describe('Service: FeedsApi', function () {
    // provide our implementations or mocks to the dependency injector
    beforeEach(function () { return [
        addProviders([
            BaseRequestOptions,
            TranslateService,
            MockBackend,
            Configuration,
            ProjectsApiService,
            provide(Http, {
                useFactory: function (backend, defaultOptions) {
                    return new Http(backend, defaultOptions);
                },
                deps: [MockBackend, BaseRequestOptions]
            }),
            FeedsApiService
        ])
    ]; });
    it('should computeRegionStateCountryData', async(inject([FeedsApiService], function (component) {
        expect(component.computeRegionStateCountryData("France", []))
            .toEqual({ region: '', state: '', country: '' });
        expect(component.computeRegionStateCountryData("IDF,France", []))
            .toEqual({ region: '', state: '', country: '' });
        expect(component.computeRegionStateCountryData("Paris,IDF,France", []))
            .toEqual({ region: '', state: '', country: '' });
        expect(component.computeRegionStateCountryData("France", [1]))
            .toEqual({ region: '', state: '', country: 'France' });
        expect(component.computeRegionStateCountryData("IDF,France", [1]))
            .toEqual({ region: '', state: 'IDF', country: 'France' });
        expect(component.computeRegionStateCountryData("Paris,IDF,France", [1]))
            .toEqual({ region: 'Paris', state: 'IDF', country: 'France' });
    })));
});
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/commons/services/api/feedsApi.service.spec.js.map
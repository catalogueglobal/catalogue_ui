import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/';
import { AppConfig } from 'app/app.config';
import { environment } from 'environments/environment';

export const laodConfig = () => {
    AppConfig.loadInstance('./environment.json')
        .then(() => {
            let data = AppConfig.getInstance('./environment.json').data;
            if (Object.keys(data).length > 0) {
                Object.assign(environment, data);
            }
            if (environment.production) {
                enableProdMode();
            }
            platformBrowserDynamic().bootstrapModule(AppModule);
        })
        .catch(() => {
            if (environment.production) {
                enableProdMode();
            }
            platformBrowserDynamic().bootstrapModule(AppModule);
        });
};

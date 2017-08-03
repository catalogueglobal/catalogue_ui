import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/';
import { laodConfig } from './load';

laodConfig();
let hackThis = false;
if (hackThis) {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

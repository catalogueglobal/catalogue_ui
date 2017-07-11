import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/';
import { laodConfig } from './load';

laodConfig();
let hackThis = true;
if (hackThis) {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

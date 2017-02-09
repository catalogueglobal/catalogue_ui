import { DatasetsComponent } from "./modules/datasets/datasets.component";
import { FeedsComponent } from "./modules/feeds/feeds.component";
import { MyDatasetsComponent } from "./modules/my-datasets/my-datasets.component";
import { RouterModule } from '@angular/router';
import { AuthGuard } from "./commons/guards/AuthGuard";
var routes = [
    { path: '', redirectTo: '/datasets', pathMatch: 'full' },
    { path: 'datasets', component: DatasetsComponent },
    { path: 'feeds/:id', component: FeedsComponent },
    { path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuard] },
    { path: '**', component: DatasetsComponent } // When page not found redirect to home // TODO. Create a PageNotFoundComponent and map this wildcard route to it.
];
// - Updated Export
export var routing = RouterModule.forRoot(routes);
//# sourceMappingURL=/Users/zbouziane/tmp/catalogue_ui/src/src/app/app.routes.js.map
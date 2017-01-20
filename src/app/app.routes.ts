import {DatasetsComponent} from "./modules/datasets/datasets.component";
import {MyDatasetsComponent} from "./modules/my-datasets/my-datasets.component";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./commons/guards/AuthGuard";

const routes: Routes = [
  {path: '', redirectTo: '/datasets', pathMatch: 'full'},
  {path: 'datasets', component: DatasetsComponent},
  {path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuard]},
  {path: '**', component: DatasetsComponent} // When page not found redirect to home // TODO. Create a PageNotFoundComponent and map this wildcard route to it.
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);

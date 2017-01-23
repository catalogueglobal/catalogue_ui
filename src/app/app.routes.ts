import {HomeComponent} from "./modules/home/home.component";
import {DatasetsComponent} from "./modules/datasets/datasets.component";
import {FeedsComponent} from "./modules/feeds/feeds.component";
import {MyDatasetsComponent} from "./modules/my-datasets/my-datasets.component";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./commons/guards/AuthGuard";

const routes: Routes = [
  {path: '', redirectTo: '/datasets', pathMatch: 'full'},
  {path: 'datasets', component: DatasetsComponent},
  {path: 'feeds/:id', component: FeedsComponent},
  {path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuard]},
  {path: '**', component: DatasetsComponent} // When page not found redirect to home
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);

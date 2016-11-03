import {HomeComponent} from "./modules/home/home.component";
import {DatasetsComponent} from "./modules/datasets/datasets.component";
import {MyDatasetsComponent} from "./modules/my-datasets/my-datasets.component";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./commons/guards/AuthGuard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'datasets', component: DatasetsComponent},
  {path: 'my-datasets', component: MyDatasetsComponent, canActivate: [AuthGuard]},
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);

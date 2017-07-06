import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }            from "./modules/common/";
import { ExplorePage }    from "./pages/explore/explore.page";
import { FeedPage }       from "./pages/feed/feed.page";
import { ManagmentPage }  from "./pages/managment/managment.page";

const routes: Routes = [
    {path: '', redirectTo: '/datasets', pathMatch: 'full'},
    {path: 'datasets', component: ExplorePage},
    {path: 'feeds/:id', component: FeedPage},
    {path: 'feeds/:id/:public', component: FeedPage},
    {path: 'my-datasets', component: ManagmentPage, canActivate: [AuthGuard]},
    {path: '**', component: ExplorePage} // When page not found redirect to home // TODO. Create a PageNotFoundComponent and map this wildcard route to it.
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);

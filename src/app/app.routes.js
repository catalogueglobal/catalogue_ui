"use strict";
var router_1 = require("@angular/router");
var _1 = require("./modules/common/");
var explore_page_1 = require("./pages/explore/explore.page");
var feed_page_1 = require("./pages/feed/feed.page");
var managment_page_1 = require("./pages/managment/managment.page");
var routes = [
    { path: '', redirectTo: '/datasets', pathMatch: 'full' },
    { path: 'datasets', component: explore_page_1.ExplorePage },
    { path: 'feeds/:id', component: feed_page_1.FeedPage },
    { path: 'feeds/:id/:public', component: feed_page_1.FeedPage },
    { path: 'my-datasets', component: managment_page_1.ManagmentPage, canActivate: [_1.AuthGuard] },
    // When page not found redirect to home // TODO. Create a PageNotFoundComponent and map this wildcard route to it.
    { path: '**', component: explore_page_1.ExplorePage }
];
// - Updated Export
exports.routing = router_1.RouterModule.forRoot(routes);

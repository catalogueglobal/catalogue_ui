// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    rootApi: "http://catalogue.tdvdigitalfactory.ovh", //"http://178.33.231.17:4001", //rootApi: "https://gtfs-manager-dev.conveyal.com",
    institutionalUrl: "http://www.catalogue.global",
    authId: "URvcRYyeNMGRFJLRQW9Kp62DHAv7YGBH",
    authDomain: "cataloguetest.eu.auth0.com",
    licenseApi: "http://catalogue.tdvdigitalfactory.ovh:4102",
    licenseApiVersion: "1.0"
};

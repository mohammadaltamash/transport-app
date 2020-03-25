// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  REST_SERVICE_URL: 'https://transport-app-rest.herokuapp.com/transportapp',
  // REST_SERVICE_URL: 'http://localhost:8080/transportapp',
  // https://account.smartystreets.com/#keys
  SS_AUTH_ID: '47f66a5f-f9f4-be57-fad2-8aa1c1a6c4ad',
  SS_AUTH_TOKEN: 'aIw6eGhZorEhYLQnQySb',
  US_ADDRESS_VALIDATOR_URL: 'https://us-street.api.smartystreets.com/street-address',
  US_ZIP_VALIDATOR_URL: 'https://us-zipcode.api.smartystreets.com/lookup',

  NEW_ORDER: 'NEW',
  ASSIGNED_ORDER: 'ASSIGNED',
  ACCEPTED_ORDER: 'ACCEPTED',

  USER_DRIVER: 'DRIVER'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

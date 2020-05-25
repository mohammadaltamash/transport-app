export const environment = {
  production: true,

  REST_SERVICE_URL: 'https://transport-app-rest.herokuapp.com/transportapp',
  MESSAGE_SERVICE_URL: 'https://transport-app-rest.herokuapp.com/transportapp/ws',

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

export class Constants {
  static DAYS_TO_PAY: string[] = [
    'Immediately',
    '2 Bus. Days (Quick Pay)',
    '5 Bus. Dys',
    '10 Bus. Days',
    '15 Bus. Days',
    '30 Bus. Days'
  ];

  static PAYMENT_TERM_BEGINS: string[] = [
    'Pickup',
    'Delivery',
    'Receiving a uShip code',
    'Receiving a signed BOL'
  ];

  static OFFER_REASON: string[] = [
    'Not applicable',
    'Carrier pay is low',
    'Pick-up dates don\'t work for me',
    'Delivery dates don\'t work for me',
    'Do not agree with the payment terms',
    'Other'
  ];

  static OFFER_VALIDITY: string[] = ['1 hr', '4 hrs', '12 hrs', '24 hrs'];

  static ORDERS_PER_PAGE = 7;

  static INACTIVITY_INTERVAL = 15 * 60;
  static INACTIVITY_TIMEOUT_INTERVAL = 5;

  static getSortName(displayName: string) {
    if (displayName === 'First Available Date') {
      return '';
    } else if (displayName === 'Carrier Pay') {
      return 'carrierPay';
    } else if (displayName === '$/mile') {
      return 'perMile';
    } else if (displayName === 'Post Date') {
      return 'createdAt';
    } else if (displayName === 'Distance') {
      return 'distance';
    } else if (displayName === 'trailerCondition') {
      return 'vehicleInoperable';
    } else if (displayName === 'vehicleType') {
      return 'vehicleAutoType';
    } else if (displayName === 'carrierPay') {
      return 'carrierPay';
    } else if (displayName === 'perMilePerCarMin') {
      return 'perMile';
    } else {
      return '';
    }
  }
}

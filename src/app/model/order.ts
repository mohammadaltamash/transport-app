export interface Order {

    id: number;
    brokerOrderId: string;                                          // Broker Order ID              required
    enclosedTrailer: boolean;                                       // Enclosed trailer
    m22Inspection: boolean;                                         // M-22 inspection

    // Pickup Contact & Location
    pickupContactName: string;                                      // Contact name
    pickupCompanyName: string;                                      // Company name
    pickupAddress: string;                                          // Pickup address               required
    pickupZip: string;                                              // Pickup zip                    required
    pickupLatitude: number;
    pickupLongitude: number;

    // Map<String, String> pickupPhones;                            // Phone 1 (can be multiple)    required
    pickupPhones: {};
    pickupSignatureNotRequired: boolean;                            // Signature not required
//    @NotEmpty(message = "pickupDates is required")
    pickupDates: {begin: '', end: ''};                                                // Pickup dates                 required
    pickupDatesRestrictions: string;                                // Pickup dates restrictions

    // Delivery Contact & Location
    deliveryContactName: string;                                    // Contact name
    deliveryCompanyName: string;                                    // Company name
//    @NotEmpty(message = "deliveryAddress is required")
    deliveryAddress: string;                                        // Delivery address             required
//    @NotEmpty(message = "deliveryZip is required")
    deliveryZip: string;                                            // Zip                          required
    deliveryLatitude: number;
    deliveryLongitude: number;
    /*Phone 1 (can be multiple) required,
    Phone 1 notes optional*/
//    @NotEmpty(message = "deliveryPhones is required")
    deliveryPhones: {};                                             // Phone 1 (can be multiple)    required
    deliverySignatureNotRequired: boolean;                          // Signature not required
    deliveryDates: {begin: '', end: ''};                                              // Delivery dates               required
    deliveryDatesRestrictions: string;                              // Delivery dates restrictions

    // Add New Vehicle
    vehicleYear: number;                                    // Year
//    @NotEmpty(message = "vehicleMake is required")
    vehicleMake: string;                                            // Make                         required
    vehicleModel: string;                                           // Model
    vehicleAutoType: string;                                        // Autotype             default: Sedan
    vehicleColor: string;                                           // Color
    vehicleVIN: string;                                             // VIN
    vehicleLOTNumber: string;                                       // LOT number
    vehicleBuyerId: string;                                         // Buyer ID
    vehicleInoperable: boolean;                                     // Inoperable

    // Dispatch Information
    dispatchInstructions: string;                                   // Dispatch Instructions

    // Pricing Information
//    @NotNull(message = "carrierPay is required")
    carrierPay: number;                                             // Carrier pay                  required
    amountOnPickup: number;                                         // Amount on pickup
    paymentOnPickupMethod: string;                                  // Payment on pickup method
    amountOnDelivery: number;                                       // Amount on delivery
    paymentOnDeliveryMethod: string;                                // Payment on delivery method
    ////////////////////////////////////
    paymentTermBusinessDays: string;
    paymentMethod: string;
    paymentTermBegins: string;
    paymentNotes: string;
    ////////////////////////////////////
    // Shipper Information
    brokerContactName: string;                                      // Broker contact name
//    @NotEmpty(message = "brokerCompanyName is required")
    brokerCompanyName: string;                                      // Broker company name          required
//    @NotEmpty(message = "brokerAddress is required")
    brokerAddress: string;                                          // Broker address               required
//    @NotEmpty(message = "brokerZip is required")
    brokerZip: string;                                              // Zip                          required
    brokerLatitude: number;
    brokerLongitude: number;

    /*Phone 1 (can be multiple) required,
    Phone 1 notes optional*/
//    @NotEmpty(message = "shipperPhones is required")
    shipperPhones: {};                                            // Phone 1 (can be multiple)    required
//    @Email(message = "BROKER_EMAIL is invalid")
//    @NotEmpty(message = "brokerEmail is required")
    brokerEmail: string;                                            // Broker email                 required

    orderStatus: string;
    orderCategory: string;
    orderDriver: string;
}

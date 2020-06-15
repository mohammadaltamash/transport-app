import { Order } from './order';
import { User } from './user';

export class OrderCarrier {
    id: number;
    order: Order;
    carrier: User;
    status: string;
    carrierPay: number;
    daysToPay: string;
    paymentTermBegins: string;
    committedPickupDate: Date;
    committedDeliveryDate: Date;
    offerReason: string;
    offerValidity: string;
    termsAndConditions: string;
}

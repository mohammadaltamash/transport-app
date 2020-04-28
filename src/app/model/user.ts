import { OrderCarrier } from './order-carrier';
import { Order } from './order';

export interface User {

    id: number;
    userName: string;
    password: string;
    resetToken: string;
    jwtToken: string;
    fullName: string;
    companyName: string;
    address: string;
    zip: string;
    latitude: number;
    longitude: number;
    phones: [];
    email: string;
    type: string;
    // orders: [];

    createdOrders: [number];
    bookingRequestOrders: [OrderCarrier]; // As carrier
    assignedOrdersAsCarrier: [Order]; // As carrier
    assignedOrdersAsDriver: [Order];

    createdAt: Date;
    updatedAt: Date;
}

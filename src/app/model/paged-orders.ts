import { Order } from './order';

export interface PagedOrders {
    totalItems: number;
    orders: Order[];
}

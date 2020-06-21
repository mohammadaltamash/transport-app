import { User } from './user';

export interface Company {
  id: number;
  contactName: string;
  companyName: string;
  address: string;
  addressState: string;
  zip: string;
  latitude: number;
  longitude: number;
  phones: {};
  companyEmail: string;

  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

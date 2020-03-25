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
}

export interface AuditResponse {

    id: number;
    revision: number;
    userName: string;
    fullName: string;
    operation: string;
    timestamp: number;
    changedProperties: {
        propertyName: '',
        formattedPropertyName: '',
        value: {},
        previousValue: {}
    };
}

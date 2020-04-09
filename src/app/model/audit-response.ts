export interface AuditResponse {

    revision: number;
    userName: string;
    fullName: string;
    operation: string;
    timestamp: number;
    changedProperties: {
        propertyName: '',
        formattedPropertyName: '',
        value: '',
        previousValue: ''
    };
}

export type PropertyValue = string;
export type UnikProperties = UnikProperty[];
export type UnikProperty = { [_: string]: PropertyValue };
export type Unik = {
    id: string;
    ownerId: string;
    transactions: {
        first: {
            id: string;
        };
        last: {
            id: string;
        };
    };
    defaultExplicitValue?: string;
    explicitValues?: string;
    type?: string;
};

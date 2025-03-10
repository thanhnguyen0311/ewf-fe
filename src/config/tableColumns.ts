export const ordersTableColumns = [
    'Invoice',
    'Type',
    'Customer',
    'Price',
    'Order Date',
    'Ship Date',
    'Status',
    'Payment',
    'Action'
];


export const productsInventoryTableColumns = [
    '',
    'Product SKU',
    'Current Stock',
    'In Production',
    'In Transit',
    'Ordered',
    'Pending Orders',
    'Predictions',
    'Status'
];


export const componentsInventoryTableColumns = [
    'SKU',
    'Type',
    'Customer',
    'Price',
    'Order Date',
    'Ship Date',
    'Status',
    'Payment',
    'Action'
];


export type ComponentInventoryRowData = {
    make: string;
    model: string;
    price: number;
    electric: boolean;
};

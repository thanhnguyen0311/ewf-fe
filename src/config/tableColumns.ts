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

export const usersTableColumns = [
    "#",
    'First Name',
    'Last Name',
    'Email',
    'Role',
    'Create Date',
    'Last seen',
    'Status',
    'Active',
    ''
];

export const componentsProductContainerTableColumns = [
    '',
    'SKU',
    'Finish',
    'Inventory'
]

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

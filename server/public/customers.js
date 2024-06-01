import {getQuery} from './js/api.js';
import {fillTable} from './js/helpers.js';

const tableId = 'customersTable';

getQuery('/customers')
    .then((customers) => {
        fillTable(tableId, customers.data);
    })
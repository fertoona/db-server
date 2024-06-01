import {getQuery} from './js/api.js';
import {fillTable, handleFormSubmit} from './js/helpers.js';

const tableId = 'customersTable';
const formId = 'customersForm';

handleFormSubmit(formId, '/customers', tableId, 'customers');

getQuery('/customers')
    .then((customers) => {
        fillTable(tableId, customers.data, 'customers');
    })
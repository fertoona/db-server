import {getQuery} from '../../js/api.js';
import {fillTable, handleFormSubmit} from '../../js/helpers.js';

const tableId = 'callsTable';
const formId = 'callsForm';

handleFormSubmit(formId, '/calls', tableId);

getQuery('/calls')
    .then((calls) => {
        fillTable(tableId, calls.data, 'calls');
    })


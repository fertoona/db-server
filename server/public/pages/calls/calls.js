import {getQuery} from '../../js/api.js';
import {fillTable} from '../../js/helpers.js';

const tableId = 'callsTable';

getQuery('/calls')
    .then((calls) => {
        fillTable(tableId, calls.data);
    })


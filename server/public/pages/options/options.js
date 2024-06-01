import {getQuery} from '../../js/api.js';
import {fillTable} from '../../js/helpers.js';

const tableId = 'optionsTable';

getQuery('/options')
    .then((options) => {
        fillTable(tableId, options.data);
    })


import {getQuery} from '../../js/api.js';
import {fillTable} from '../../js/helpers.js';

const tableId = 'tariffsTable';

getQuery('/tariffs')
    .then((tariffs) => {
        fillTable(tableId, tariffs.data);
    })


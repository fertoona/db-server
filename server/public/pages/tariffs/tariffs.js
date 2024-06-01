import {getQuery} from '../../js/api.js';
import {fillTable, handleFormSubmit} from '../../js/helpers.js';

const tableId = 'tariffsTable';
const formId = 'tariffsForm';

handleFormSubmit(formId, '/tariffs', tableId, 'tariffs');

getQuery('/tariffs')
    .then((tariffs) => {
        fillTable(tableId, tariffs.data, 'tariffs');
    })


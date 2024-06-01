import {getQuery} from '../../js/api.js';
import {fillTable, handleFormSubmit} from '../../js/helpers.js';

const tableId = 'optionsTable';
const formId = 'optionsForm';

handleFormSubmit(formId, '/options', tableId, 'options');

getQuery('/options')
    .then((options) => {
        fillTable(tableId, options.data, 'options');
    })


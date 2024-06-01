import {deleteMutation, getQuery, postMutation} from './api.js';

function createTableRow(cellAttribute, data) {
    const row = document.createElement('tr');

    data.forEach((value) => {
        const cell = document.createElement(cellAttribute);
        cell.innerText = value;

        row.appendChild(cell);
    });

    return row;
}

function createDeleteButton(url, id, tableId, dbTable) {
    const button = document.createElement('button');

    button.type = 'button';
    button.innerText = 'X';
    button.className = 'page__button page__button_delete';
    button.onclick = async () => {
        const status = await deleteMutation(url, id)

        if (!status) {
            return;
        }

        const collection = await getQuery(url);

        if (collection) {
            fillTable(tableId, collection.data, dbTable);
        }
    }

    return button;
}

export function fillTable(tableId, data, dbTable) {
    if (!data || data.length === 0) {
        return;
    }

    const table = document.getElementById(tableId);

    if (!table) {
        return;
    }

    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');

    if (!tableHead || !tableBody) {
        return;
    }

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const headerValues = Object.keys(data[0]);

    const headerRow = createTableRow('td', [...headerValues, 'actions']);

    tableHead.appendChild(headerRow);

    data.forEach((model) => {
        const modelValues = Object.values(model);

        const bodyRow = createTableRow('td', modelValues);

        const path = `/${dbTable}`;

        const deleteButton = createDeleteButton(path, model.id, tableId, dbTable);

        bodyRow.appendChild(deleteButton);

        tableBody.appendChild(bodyRow);
    });
}

export function handleFormSubmit(formId, url, tableId, dbTable) {
    const form = document.getElementById(formId);

    if (form) {
        form.onsubmit = async (event) => {
            event.preventDefault();

            const inputs = form.querySelectorAll('input');

            if (!inputs) {
                return;
            }

            const data = {};

            inputs.forEach((input) => {
                const value = isNaN(Number(input.value)) ? input.value : Number(input.value);

                Object.assign(data, {[input.name]: value});
            });

            if (!data) {
                return;
            }

            const status = await postMutation(url, data);

            if (!status) {
                return;
            }

            form.reset();

            const collection = await getQuery(url);

            if (collection) {
                fillTable(tableId, collection.data, dbTable);
            }
        };
    }
}
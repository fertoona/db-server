function createTableRow(cellAttribute, data) {
    const row = document.createElement('tr');

    data.forEach((value) => {
        const cell = document.createElement(cellAttribute);
        cell.innerText = value;

        row.appendChild(cell);
    });

    return row;
}

export function fillTable(tableId, data) {
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

    const headerRow = createTableRow('td', headerValues);

    tableHead.appendChild(headerRow);

    data.forEach((model) => {
        const modelValues = Object.values(model);

        const bodyRow = createTableRow('td', modelValues);

        tableBody.appendChild(bodyRow);
    });
}
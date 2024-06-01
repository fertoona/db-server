const apiUrl = 'http://localhost:8080/api';

function baseUrl(path) {
    return apiUrl + path;
}

function baseUrlWithParams(path, params) {
    const queryParams = new URLSearchParams(params);

    return `${baseUrl(path)}?${queryParams}`;
}

export async function getQuery(path, params) {
    const url = params ? baseUrlWithParams(path, params) : baseUrl(path);

    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'},
        method: 'GET',
    });

    if (response.ok) {
        return await response.json();
    }

    return false;
}

export async function postMutation(path, body) {
    const response = await fetch(baseUrl(path), {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.ok) {
        return await response.json();
    }

    return false;
}

export async function deleteMutation(path, id) {
    const response = await fetch(baseUrlWithParams(path, {id}), {
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
    });

    if (response.ok) {
        return await response.json();
    }

    return false;
}

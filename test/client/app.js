async function getUsers() {
    const response = await fetch('/api/users');
    return response.json();
}

async function createUser(data) {
    const response = await fetch('/api/users', { method: 'POST' });
    return response.json();
}


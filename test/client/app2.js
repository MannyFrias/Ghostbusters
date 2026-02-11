async function getUsers() {
    const response = await fetch('/api/users');
    return response.json();
}

async function createUser(data) {
    const response = await fetch('/api/users', { method: 'POST' });
    return response.json();
}

async function getGhostRoute() {
    const response = await fetch('/api/ghost');
    return response.json();
}
async function getGhostRoute2() {
    const response = await fetch('/api/ghost');
    return response.json();
}
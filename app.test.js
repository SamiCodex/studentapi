const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

let app;
let server;
let baseUrl;

const startServer = async () => {
  delete require.cache[require.resolve('./app')];
  app = require('./app');
  server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
};

const stopServer = async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
};

test.beforeEach(async () => {
  await startServer();
});

test.afterEach(async () => {
  await stopServer();
});

test('GET / returns API info', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.match(text, /Student API in Express/i);
});

test('GET /api/students returns all students', async () => {
  const response = await fetch(`${baseUrl}/api/students`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(Array.isArray(data), true);
  assert.equal(data.length, 5);
});

test('GET /api/students?major=IT filters by major', async () => {
  const response = await fetch(`${baseUrl}/api/students?major=IT`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.map((s) => s.name), ['Alice', 'Cherry']);
});

test('GET /api/students/:id returns a student by id', async () => {
  const response = await fetch(`${baseUrl}/api/students/1`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.name, 'Alice');
});

test('POST /api/students creates a new student', async () => {
  const response = await fetch(`${baseUrl}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Frank', major: 'CS' }),
  });

  assert.equal(response.status, 201);
  const data = await response.json();
  assert.equal(data.name, 'Frank');
  assert.equal(data.major, 'CS');
  assert.ok(data.id);
});

test('PUT /api/students/:id updates a student', async () => {
  const response = await fetch(`${baseUrl}/api/students/2`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Boon Updated', major: 'AI' }),
  });

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.name, 'Boon Updated');
  assert.equal(data.major, 'AI');
});

test('DELETE /api/students/:id removes a student', async () => {
  const response = await fetch(`${baseUrl}/api/students/5`, {
    method: 'DELETE',
  });

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.message, 'Student deleted successfully');

  const checkResponse = await fetch(`${baseUrl}/api/students/5`);
  assert.equal(checkResponse.status, 404);
});

// testSetup.js
import request from 'supertest';
import { app, startServer, closeServer } from '../server.js';  // Ensure this path is correct


global.beforeAll(async () => {
  await startServer();  // Start server before all tests
  global.api = request(app);  // Initialize supertest with a reference to app
});

global.afterAll(async () => {
  await closeServer();  // Close server after all tests
});

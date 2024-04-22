import request from 'supertest';
import { app, startServer, closeServer } from '../server.js';  


global.beforeAll(async () => {
  await startServer();  
  global.api = request(app);  
});

global.afterAll(async () => {
  await closeServer();  
});

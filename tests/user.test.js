import request from 'supertest';
import { startServer, closeServer } from '../server';


let api;

beforeAll(async () => {
    await startServer();
    api = request(app);
});

afterAll(() => {
    if (server) {
        server.close();
    }
});

// user.test.js
describe('User Authentication', () => {
  const api = request(app);

  it('should register a user', async () => {
      const res = await api.post('/api/users/register').send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
  });

  it('should login the user', async () => {
      const res = await api.post('/api/users/login').send({
          email: 'john.doe@example.com',
          password: 'password123'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
  });
});
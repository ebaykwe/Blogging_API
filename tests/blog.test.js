import request from 'supertest';
import { app } from '../app'; // Make sure app is properly exported
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

describe('Blog Management', () => {
  // Example user credentials used for testing
  const userCredentials = {
    email: 'john.doe@example.com',
    password: 'password123'
  };
  
  let token; // To store token for authenticated requests

  // Login before running blog tests
  beforeAll(async () => {
    await api.post('/api/users/register').send({
      ...userCredentials,
      firstName: 'John',
      lastName: 'Doe'
    });

    const res = await api.post('/api/users/login').send(userCredentials);
    token = res.body.token; // Save the token for blog operation tests
  });

  it('should create a blog', async () => {
    const blogData = {
      title: 'New Blog',
      description: 'Blog description',
      body: 'Blog body',
      tags: ['tag1', 'tag2']
    };

    const res = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  }, 30000);

  it('should get all published blogs', async () => {
    const res = await api.get('/api/blogs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 30000);
});

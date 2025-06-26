import request from 'supertest';
import app from './server.js';

// Replace these with valid test credentials and data from your database
const TEST_USER = { username: 't', password: 'testpassword' };
let token;
let conversationId;

describe('API Endpoint Integration Tests', () => {
  // Login and get token
  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(TEST_USER);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  // Create a conversation before running message/chat tests
  it('should create a conversation', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Conversation' });
    console.log('Create conversation:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    conversationId = res.body.conversation_id || res.body._id || res.body.id;
    expect(conversationId).toBeDefined();
  });

  // Update user preferences
  it('should update user preferences', async () => {
    const res = await request(app)
      .put('/api/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ theme: 'dark', last_active_conversation: conversationId });
    console.log('Update preferences:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  // Add a message to a conversation
  it('should add a message to a conversation', async () => {
    const res = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello, world!', role: 'user' });
    console.log('Add message:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  // Test chat endpoint (SSE streaming)
  it('should stream chat response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello AI!', conversationId });
    console.log('Chat response headers:', res.headers);
    expect(res.statusCode).toBe(200);
    // Optionally check for SSE headers or partial response
    expect(res.headers['content-type']).toContain('text/event-stream');
  });
});

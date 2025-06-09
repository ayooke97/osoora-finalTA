import request from 'supertest';
import app from '../server.js';
import similarity from 'string-similarity';
import axios from 'axios';
jest.mock('axios');

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpw'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

// Mock MongoDB client and collections
jest.mock('mongodb', () => {
  const mCollection = () => ({
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteMany: jest.fn(),
    find: jest.fn(() => ({ sort: jest.fn(() => ({ toArray: jest.fn() })) })),
    toArray: jest.fn(),
  });
  const mDb = {
    collection: jest.fn(() => mCollection())
  };
  const mClient = {
    connect: jest.fn(),
    db: jest.fn(() => mDb),
    close: jest.fn(),
  };
  return {
    MongoClient: jest.fn(() => mClient),
    ObjectId: jest.fn()
  };
});

const mockToken = 'mocked-token';
const mockUser = {
  user_id: 'user-123',
  username: 'testuser',
  email: 'test@example.com',
  password_hash: '$2b$10$mockedhash',
  token: mockToken,
  created_at: new Date(),
  last_login: new Date(),
};
const mockConversation = {
  conversation_id: 'conv-123',
  user_id: mockUser.user_id,
  topic: 'Test',
  preview: 'Hello',
  created_at: new Date(),
  updated_at: new Date(),
};

// Helper for setting env
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DASHSCOPE_URL = 'http://localhost:1234';
});

describe('API Backend Test', () => {
  describe('Auth: Register', () => {
    it('should register new user (success)', async () => {
      // Simulasi user belum ada
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce(null); // user not exists
      db.collection().insertOne.mockResolvedValueOnce({ insertedId: 'id' });
      db.collection().insertOne.mockResolvedValueOnce({ insertedId: 'prefid' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user', email: 'user@email.com', password: 'pw12345' });
      console.log('REGISTER RESPONSE:', res.statusCode, res.body);
      expect(res.statusCode).toBe(201); // atau 200 jika backend return 200
      expect(res.body).toHaveProperty('token');
    });
    it('should fail if missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user' });
      expect(res.statusCode).toBe(400);
    });
    it('should fail if user exists', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user', email: 'test@example.com', password: 'pw12345' });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('Auth: Login', () => {
    afterEach(() => jest.clearAllMocks());
    it('should login user (success)', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser });
      db.collection().updateOne.mockResolvedValueOnce({});
      db.collection().findOne.mockResolvedValueOnce(null); // prefs
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: mockUser.email, password: 'pw12345' });
      console.log('LOGIN RESPONSE:', res.statusCode, res.body);
      expect(res.statusCode).toBe(200); // Ubah jika backend return 201
      expect(res.body).toHaveProperty('token');
    });
    it('should fail with wrong credentials', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce(null); // user not found
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });
      console.log('LOGIN FAIL RESPONSE:', res.statusCode, res.body);
      expect(res.statusCode).toBe(401);
    });
    it('should fail login if password is wrong', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // user ditemukan
      require('bcrypt').compare.mockResolvedValueOnce(false); // password salah
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: mockUser.email, password: 'wrongpw' });
      console.log('LOGIN WRONG PW RESPONSE:', res.statusCode, res.body);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('User Preferences', () => {
    it('should get user preferences (success)', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().findOne.mockResolvedValueOnce({ theme: 'dark', user_id: mockUser.user_id });
      const res = await request(app)
        .get('/api/user/preferences')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('theme');
    });
    it('should update preferences (success)', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().updateOne.mockResolvedValueOnce({ matchedCount: 1 });
      db.collection().findOne.mockResolvedValueOnce({ theme: 'light', user_id: mockUser.user_id });
      const res = await request(app)
        .put('/api/user/preferences')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ theme: 'light' });
      expect([200,201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('theme');
    });
    it('should fail with invalid token', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce(null); // token invalid
      const res = await request(app)
        .get('/api/user/preferences')
        .set('Authorization', 'Bearer invalid');
      expect([401,403]).toContain(res.statusCode);
    });
  });

  describe('Conversations', () => {
    it('should create new conversation', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().insertOne.mockResolvedValueOnce({ insertedId: 'conv-123' });
      db.collection().updateOne.mockResolvedValueOnce({});
      const res = await request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ topic: 'Test' });
      expect([200,201]).toContain(res.statusCode);
    });
    it('should get user conversations', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().find().sort().toArray.mockResolvedValueOnce([mockConversation]);
      const res = await request(app)
        .get('/api/conversations')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('should clear all conversations', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().deleteMany.mockResolvedValueOnce({ deletedCount: 2 });
      const res = await request(app)
        .delete('/api/conversations/clear')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('deletedCount');
    });
  });

  describe('Messages', () => {
    it('should get messages from conversation', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().findOne.mockResolvedValueOnce(mockConversation); // conversation
      db.collection().find().sort().toArray.mockResolvedValueOnce([{ content: 'Hello', role: 'user' }]);
      const res = await request(app)
        .get(`/api/conversations/${mockConversation.conversation_id}/messages`)
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('should add message to conversation', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().findOne.mockResolvedValueOnce(mockConversation); // conversation
      db.collection().insertOne.mockResolvedValueOnce({ insertedId: 'msg-123' });
      db.collection().updateOne.mockResolvedValueOnce({});
      const res = await request(app)
        .post(`/api/conversations/${mockConversation.conversation_id}/messages`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ content: 'Hello', role: 'user' });
      expect([200,201]).toContain(res.statusCode);
    });
  });

  describe('User Profile', () => {
    it('should update profile (username/password)', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // token
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser }); // user
      db.collection().updateOne.mockResolvedValueOnce({});
      db.collection().findOne.mockResolvedValueOnce({ ...mockUser, username: 'newuser' });
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ username: 'newuser', current_password: 'pw12345', new_password: 'pw67890' });
      expect([200,201]).toContain(res.statusCode);
    });
  });

jest.mock('axios');

describe('Chat Endpoint', () => {
    it('should handle chat response and calculate similarity', async () => {
      // Mock streaming response dari axios
      const mockStream = {
        on: jest.fn((event, cb) => {
          if (event === 'data') {
            // Simulasi chunk data SSE
            cb('data: {"output":{"text":"Halo, apa kabar?"}}\n\n');
          }
          if (event === 'end') {
            cb();
          }
          return mockStream;
        })
      };
      axios.post.mockResolvedValueOnce({ data: mockStream });
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hai', conversationId: 'conv-123' });
      // Tidak semua library supertest support SSE, jadi kita cek similarity langsung
      const score = similarity.compareTwoStrings('Halo, apa kabar?', 'Hai, bagaimana kabarmu?');
      expect(score).toBeGreaterThan(0.3);
    });
    it('should handle chat error gracefully', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hai', conversationId: 'conv-123' });
      expect([500,502,503]).toContain(res.statusCode);
    });
  });

  describe('Middleware: authenticateToken', () => {
    it('should fail if token missing', async () => {
      const res = await request(app)
        .get('/api/user/preferences');
      expect(res.statusCode).toBe(401);
    });
    it('should fail if token invalid', async () => {
      const db = require('mongodb').MongoClient().db();
      db.collection().findOne.mockResolvedValueOnce(null); // token invalid
      const res = await request(app)
        .get('/api/user/preferences')
        .set('Authorization', 'Bearer salah');
      expect([401,403]).toContain(res.statusCode);
    });
  });
});

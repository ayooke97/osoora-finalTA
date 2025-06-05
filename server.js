import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5101;

// MongoDB Atlas connection
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const clusterUrl = process.env.MONGODB_CLUSTER_URL;
const dbName = process.env.MONGODB_DATABASE || 'osoora_db';
const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;
let db;

// Connect to MongoDB Atlas
async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB Atlas successfully - Database: ${dbName}`);
    return client;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    throw error;
  }
}

// Enable CORS with specific configuration for custom domain
const allowedOrigins = [
  'http://localhost:5101',
  'https://localhost:5101',
  'http://baktipm.com',
  'https://baktipm.com',
  'http://baktipm.com:5101',
  'https://baktipm.com:5101',
  process.env.ALLOW_ORIGIN // From .env file
].filter(Boolean); // Remove any undefined/null values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`Allowed origins:`, allowedOrigins);
      console.log(`Request origin:`, origin);
      return callback(null, true); // Allow all origins in production for now
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('.'));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to verify user token (simple version for demo)
const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  
  try {
    // Find user with this token
    const user = await db.collection('users').findOne({ token });
    
    if (!user) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    
    // Add user to request object
    req.user = {
      id: user.user_id,
      email: user.email,
      username: user.username
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or username already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user document
    const userId = uuidv4();
    const token = uuidv4(); // Simple token for demo
    
    const newUser = {
      user_id: userId,
      username,
      email,
      password_hash: passwordHash,
      token,
      created_at: new Date(),
      last_login: new Date()
    };
    
    // Insert user
    await db.collection('users').insertOne(newUser);
    
    // Create default user preferences
    const preferenceId = uuidv4();
    const userPreferences = {
      preference_id: preferenceId,
      user_id: userId,
      theme: 'system',
      last_active_conversation: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await db.collection('user_preferences').insertOne(userPreferences);
    
    // Return success with token
    return res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        username,
        email,
        user_id: userId
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate new token
    const token = uuidv4();
    
    // Update user's token and last login
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { 
          token, 
          last_login: new Date() 
        } 
      }
    );
    
    // Get user preferences
    const preferences = await db.collection('user_preferences').findOne({ user_id: user.user_id });
    
    // Return success with token and user data
    return res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        preferences: preferences || { theme: 'system' }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// User preferences API
app.get('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user preferences
    const preferences = await db.collection('user_preferences').findOne({ user_id: userId });
    
    if (!preferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    return res.status(200).json(preferences);
    
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, last_active_conversation } = req.body;
    
    // Update fields that are provided
    const updateFields = {};
    if (theme !== undefined) updateFields.theme = theme;
    if (last_active_conversation !== undefined) updateFields.last_active_conversation = last_active_conversation;
    updateFields.updated_at = new Date();
    
    // Find and update preferences
    const result = await db.collection('user_preferences').updateOne(
      { user_id: userId },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      // Create preferences if they don't exist
      const preferenceId = uuidv4();
      const newPreferences = {
        preference_id: preferenceId,
        user_id: userId,
        theme: theme || 'system',
        last_active_conversation: last_active_conversation || null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      await db.collection('user_preferences').insertOne(newPreferences);
      return res.status(201).json(newPreferences);
    }
    
    // Get updated preferences
    const updatedPreferences = await db.collection('user_preferences').findOne({ user_id: userId });
    return res.status(200).json(updatedPreferences);
    
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Conversations and messages APIs
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user conversations
    const conversations = await db.collection('conversations')
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .toArray();
    
    return res.status(200).json(conversations);
    
  } catch (error) {
    console.error('Error getting conversations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user preferences
app.get('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user preferences from database
    const preferences = await db.collection('user_preferences').findOne({ user_id: userId });
    
    // If no preferences exist yet, return default values
    if (!preferences) {
      return res.status(200).json({
        theme: 'system',
        last_active_conversation: null,
        user_id: userId
      });
    }
    
    return res.status(200).json(preferences);
    
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, preview } = req.body;
    
    // Create conversation
    const conversationId = uuidv4();
    const newConversation = {
      conversation_id: conversationId,
      user_id: userId,
      topic: topic || 'New Conversation',
      preview: preview || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await db.collection('conversations').insertOne(newConversation);
    
    // Update user preferences with last active conversation
    await db.collection('user_preferences').updateOne(
      { user_id: userId },
      { 
        $set: { 
          last_active_conversation: conversationId,
          updated_at: new Date()
        } 
      },
      { upsert: true }
    );
    
    return res.status(201).json(newConversation);
    
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    
    // Check if conversation belongs to user
    const conversation = await db.collection('conversations').findOne({
      conversation_id: conversationId,
      user_id: userId
    });
    
    if (!conversation) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }
    
    // Get messages
    const messages = await db.collection('messages')
      .find({ conversation_id: conversationId })
      .sort({ timestamp: 1 })
      .toArray();
    
    return res.status(200).json(messages);
    
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete all conversations for a user
app.delete('/api/conversations/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`Deleting all conversations for user: ${userId}`);
    
    // Delete all conversations that belong to this user
    const deleteResult = await db.collection('conversations').deleteMany({
      user_id: userId
    });
    
    console.log('Delete result:', deleteResult);
    
    // Return the result including how many conversations were deleted
    return res.status(200).json({
      message: 'All conversations deleted successfully',
      deletedCount: deleteResult.deletedCount
    });
    
  } catch (error) {
    console.error('Error deleting conversations:', error);
    return res.status(500).json({ error: 'Failed to delete conversations' });
  }
});

app.post('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content, role } = req.body;
    
    // Check if conversation exists and belongs to user
    const conversation = await db.collection('conversations').findOne({
      conversation_id: conversationId,
      user_id: userId
    });
    
    if (!conversation) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }
    
    // Create message
    const messageId = uuidv4();
    const newMessage = {
      message_id: messageId,
      conversation_id: conversationId,
      content,
      timestamp: new Date(),
      role: role || 'user'
    };
    
    await db.collection('messages').insertOne(newMessage);
    
    // Update conversation preview and timestamp
    await db.collection('conversations').updateOne(
      { conversation_id: conversationId },
      { 
        $set: { 
          preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          updated_at: new Date()
        } 
      }
    );
    
    return res.status(201).json(newMessage);
    
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile update API
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, current_password, new_password } = req.body;
    
    // Get user
    const user = await db.collection('users').findOne({ user_id: userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update fields
    const updateFields = {};
    
    // Update username if provided
    if (username && username !== user.username) {
      // Check if username already exists
      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser && existingUser.user_id !== userId) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      updateFields.username = username;
    }
    
    // Update password if provided
    if (current_password && new_password) {
      // Verify current password
      const validPassword = await bcrypt.compare(current_password, user.password_hash);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateFields.password_hash = await bcrypt.hash(new_password, salt);
    }
    
    // Only update if there are changes
    if (Object.keys(updateFields).length > 0) {
      await db.collection('users').updateOne(
        { user_id: userId },
        { $set: updateFields }
      );
    }
    
    // Get updated user (exclude password hash)
    const updatedUser = await db.collection('users').findOne(
      { user_id: userId },
      { projection: { password_hash: 0, token: 0 } }
    );
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy endpoint
app.post('/api/chat', async (req, res) => {
    try {
        let { message, conversationId } = req.body;
        
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // If no conversationId is provided, create a new conversation
        if (!conversationId) {
            try {
                const newConversationId = uuidv4();
                const userId = req.headers['user-id'] || 'anonymous'; // Get user ID from headers or use anonymous
                
                const newConversation = {
                    conversation_id: newConversationId,
                    user_id: userId,
                    title: message.substring(0, 30) + '...', // Create a title from the first message
                    created_at: new Date(),
                    updated_at: new Date(),
                    messages: [],
                    message: message.substring(0, 100), // Required field based on schema
                    preview: message.substring(0, 100), // For conversation preview
                    dashscope_session_id: null // Will be updated later
                };
                
                await db.collection('conversations').insertOne(newConversation);
                console.log(`Created new conversation with ID: ${newConversationId}`);
                conversationId = newConversationId;
            } catch (dbError) {
                console.error('Error creating new conversation:', dbError);
                // Continue without conversationId if we can't create one
            }
        }

        // Validate the Dashscope URL
        const dashscopeUrl = process.env.DASHSCOPE_URL;
        if (!dashscopeUrl || !dashscopeUrl.startsWith('http')) {
            throw new Error(`Invalid Dashscope URL: ${dashscopeUrl}`);
        }

        // Validate API key
        const apiKey = process.env.DASHSCOPE_API_KEY;
        if (!apiKey) {
            throw new Error('Missing Dashscope API key');
        }
        
        // console.log('Making request to Dashscope API at:', dashscopeUrl);

        // Format the prompt to request Markdown responses
        const formattedPrompt = `Please format your response using Markdown with proper headings, lists, code blocks, and other formatting where appropriate. Here's the user's message:\n\n${message}`;

        // Debug conversation info
        console.log('Request received with:', { 
            hasMessage: Boolean(message), 
            conversationId: conversationId || 'none',
            bodyKeys: Object.keys(req.body)
        });

        let existingSessionId = null;
        
        // Check if we already have a session_id for this conversation
        if (conversationId) {
            try {
                // Find the conversation in MongoDB
                const conversation = await db.collection('conversations').findOne({ conversation_id: conversationId });
                if (conversation && conversation.dashscope_session_id) {
                    existingSessionId = conversation.dashscope_session_id;
                    console.log(`Found existing session ID: ${existingSessionId} for conversation: ${conversationId}`);
                }
            } catch (dbError) {
                console.error('Error retrieving session ID from conversation:', dbError);
            }
        }
        
        // Prepare request configuration
        const axiosConfig = {
            method: 'post',
            url: dashscopeUrl,
            data: {
                input: {
                    prompt: formattedPrompt,
                    // Include session_id directly if this is an ongoing conversation
                    ...(existingSessionId && { session_id: existingSessionId })
                },
                parameters: {},
                // If we have an existing session_id, use it. Otherwise, use conversationId as fallback
                debug: existingSessionId ? { session_id: existingSessionId } : 
                       conversationId ? { session_id: conversationId } : {}
            },
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable',
                'Accept': 'text/event-stream'
            },
            responseType: 'stream',
            timeout: 60000, // 60 second timeout
            validateStatus: status => status < 500 // Don't throw for 4xx errors
        };
        
        const response = await axios(axiosConfig);

        let buffer = '';
        let lastProcessedText = '';

        // Pipe the response stream to the client
        response.data.on('data', (chunk) => {
            try {
                buffer += chunk.toString();
                
                // Process complete events
                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
                    const event = buffer.slice(0, newlineIndex);
                    buffer = buffer.slice(newlineIndex + 2);

                    // Parse the event
                    const lines = event.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            const jsonStr = line.slice(5).trim();
                            if (jsonStr && jsonStr !== '[DONE]') {
                                try {
                                    const jsonData = JSON.parse(jsonStr);
                                    if (jsonData.output?.text) {
                                        const currentText = jsonData.output.text;
                                        // Only send the new words
                                        if (currentText.startsWith(lastProcessedText) && currentText !== lastProcessedText) {
                                            const newText = currentText.slice(lastProcessedText.length);
                                            const formattedData = {
                                                choices: [{
                                                    message: {
                                                        content: newText
                                                    }
                                                }]
                                            };
                                            res.write(`data: ${JSON.stringify(formattedData)}\n\n`);
                                            lastProcessedText = currentText;
                                        } else if (currentText !== lastProcessedText) {
                                            // If there's a mismatch, send the full text
                                            const formattedData = {
                                                choices: [{
                                                    message: {
                                                        content: currentText
                                                    }
                                                }]
                                            };
                                            res.write(`data: ${JSON.stringify(formattedData)}\n\n`);
                                            lastProcessedText = currentText;
                                        }
                                        
                                    }
                                    const sessionId = jsonData.output.session_id;
                                    console.log('DEBUG - Session Data:', { 
                                        sessionId,
                                        conversationId,
                                        willUpdate: Boolean(conversationId && sessionId),
                                        timestamp: new Date().toISOString()
                                    });
                                    
                                    // Store the session ID in MongoDB if we have a conversationId and sessionId
                                    if (conversationId && sessionId) {
                                        (async () => {
                                            try {
                                                // First check if the conversation exists
                                                console.log(`Checking if conversation ${conversationId} exists in MongoDB...`);
                                                const conversation = await db.collection('conversations').findOne({ conversation_id: conversationId });
                                                console.log('Conversation found:', Boolean(conversation));
                                                
                                                // If conversation doesn't exist, create it first
                                                if (!conversation) {
                                                    console.log(`Conversation with ID ${conversationId} doesn't exist in MongoDB. Creating it first...`);
                                                    const userId = req.headers['user-id'] || 'anonymous';
                                                    
                                                    // Use only the fields that the MongoDB schema expects using snake_case consistently
                                                    const newConversation = {
                                                        conversation_id: conversationId,
                                                        user_id: userId,
                                                        title: 'Chat session',
                                                        created_at: new Date(),
                                                        updated_at: new Date(),
                                                        messages: [],
                                                        message: 'Chat session started', // Required field based on error
                                                        dashscope_session_id: null // Will be updated later
                                                    };
                                                    
                                                    await db.collection('conversations').insertOne(newConversation);
                                                    console.log(`Created new conversation with ID: ${conversationId}`);
                                                }
                                                
                                                // Now update with session ID and message content - using snake_case field names consistently
                                                const updateResult = await db.collection('conversations').updateOne(
                                                    { conversation_id: conversationId },
                                                    { 
                                                        $set: { 
                                                            dashscope_session_id: sessionId, 
                                                            updated_at: new Date(),
                                                            // Store preview and response consistently using snake_case
                                                            preview: message,
                                                            preview_response: lastProcessedText
                                                        },
                                                        // Add messages to the array
                                                        $push: {
                                                            messages: [
                                                                {
                                                                    role: 'user',
                                                                    content: message,
                                                                    timestamp: new Date()
                                                                },
                                                                {
                                                                    role: 'assistant',
                                                                    content: lastProcessedText,
                                                                    timestamp: new Date()
                                                                }
                                                            ]
                                                        }
                                                    }
                                                );
                                                console.log('MongoDB update result:', {
                                                    matchedCount: updateResult.matchedCount,
                                                    modifiedCount: updateResult.modifiedCount,
                                                    conversation_id: conversationId,
                                                    session_id: sessionId
                                                });
                                            } catch (dbError) {
                                                console.error('Error updating conversation with session ID:', dbError);
                                            }
                                        })();
                                    }

                                    // Store the message in MongoDB
                                    

                                } catch (e) {
                                    console.error('Error parsing JSON:', e);
                                }
                            }
                        }
                    }
                }
              } catch (e) {
                console.error('Error processing chunk:', e);
              }
            });
            
            response.data.on('end', () => {
              res.write('data: [DONE]\n\n');
              res.end();
        });

        response.data.on('error', (error) => {
            console.error('Stream Error:', error);
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        });

    } catch (error) {
        // Provide detailed error logging
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message.includes('Invalid URL')) {
            console.error(`Proxy Error: ${error.message}`);
            console.error('Check your DASHSCOPE_URL environment variable:', process.env.DASHSCOPE_URL);
        } else if (error.response) {
            console.error(`Dashscope API Error (${error.response.status}):`, error.message);
            console.error('Response data:', error.response.data);
        } else {
            console.error('Unexpected error in proxy endpoint:', error.message);
            console.error('Error details:', error);
        }
        
        // Keep the connection alive if possible
        try {
            // Format the error as a choice message to match expected client format
            const errorData = {
                error: true,
                message: `Error: ${error.message}`,
                details: error.response?.data || error.stack
            };
            const formattedError = {
                choices: [{
                    message: {
                        content: JSON.stringify(errorData)
                    }
                }]
            };
            
            // Write the SSE format with proper newlines
            res.write(`data: ${JSON.stringify(formattedError)}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
        } catch (e) {
            // Fallback to regular error response if SSE fails
            res.status(500).json({
                error: 'Error communicating with Dashscope API',
                message: error.message,
                details: error.response?.data || error.stack
            });
        }
    }
});

// Start the server with MongoDB connection
async function startServer() {
    let mongoClient;
    try {
        // Validate Dashscope URL format before starting
        const url = process.env.DASHSCOPE_URL;
        if (!url) {
            console.error('ERROR: DASHSCOPE_URL is not set in environment variables');
            process.exit(1);
        }
        
        try {
            // Test if it's a valid URL by creating a URL object
            new URL(url);
        } catch (error) {
            console.error('ERROR: Invalid DASHSCOPE_URL in environment variables:', url);
            console.error('Server startup aborted due to invalid Dashscope URL');
            process.exit(1);
        }
        
        mongoClient = await connectToMongoDB();
        
        const server = app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            server.close();
            
            if (mongoClient) {
                await mongoClient.close();
            }
            
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        if (mongoClient) await mongoClient.close();
        process.exit(1);
    }
}

startServer();

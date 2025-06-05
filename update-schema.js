// Script to update MongoDB schema validation for conversations collection
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function updateMongoDBSchema() {
  // Get MongoDB connection details from environment variables
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const clusterUrl = process.env.MONGODB_CLUSTER_URL;
  const dbName = process.env.MONGODB_DATABASE || 'osoora_db';
  const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log(`Connected to MongoDB Atlas successfully - Database: ${dbName}`);
    
    const db = client.db(dbName);
    
    // First check the current validation schema
    const collections = await db.listCollections({ name: 'conversations' }).toArray();
    console.log('Current collection info:', JSON.stringify(collections, null, 2));
    
    // Create more flexible schema validation
    const newValidationSchema = {
      $jsonSchema: {
        bsonType: "object",
        title: "Conversation Schema Validation",
        required: ["conversationId"], // Only require the conversation ID
        properties: {
          // Support both camelCase and snake_case field names
          conversationId: { bsonType: "string" },
          conversation_id: { bsonType: "string" },
          userId: { bsonType: "string" },
          user_id: { bsonType: "string" },
          title: { bsonType: "string" },
          createdAt: { bsonType: ["date", "null"] },
          created_at: { bsonType: ["date", "null"] },
          lastUpdated: { bsonType: ["date", "null"] },
          last_updated: { bsonType: ["date", "null"] },
          messages: { bsonType: "array" },
          message: { bsonType: ["string", "null"] }, // Allow message field to be null
          dashscopeSessionId: { bsonType: ["string", "null"] },
          dashscope_session_id: { bsonType: ["string", "null"] }
        },
        additionalProperties: true // Allow additional fields not in schema
      }
    };

    // Update the collection with the new schema
    console.log('Updating conversations collection schema...');
    await db.command({
      collMod: 'conversations',
      validator: newValidationSchema,
      validationLevel: 'moderate', // 'strict' | 'moderate' | 'off'
      validationAction: 'warn' // 'error' | 'warn'
    });
    
    console.log('Schema updated successfully!');
    
    // Verify the new schema
    const updatedCollections = await db.listCollections({ name: 'conversations' }).toArray();
    console.log('Updated collection info:', JSON.stringify(updatedCollections, null, 2));
    
  } catch (error) {
    console.error('Error updating MongoDB schema:', error);
  } finally {
    // Close the connection
    if (client) await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
updateMongoDBSchema().catch(console.error);

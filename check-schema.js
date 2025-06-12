// Script to check MongoDB collection schema
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkMongoDBSchema() {
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
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in the database:');
    console.log(collections.map(c => c.name).join(', '));
    
    // For each collection, get a sample document and print its structure
    for (const collection of collections) {
      console.log(`\n=== Collection: ${collection.name} ===`);
      
      // Check if there's a validation schema
      console.log('Validation schema:');
      try {
        const options = await db.command({ listCollections: 1, filter: { name: collection.name } });
        const validationInfo = options.cursor.firstBatch[0].options;
        console.log(JSON.stringify(validationInfo, null, 2));
      } catch (e) {
        console.log('No validation schema defined');
      }
      
      // Get a sample document
      const sample = await db.collection(collection.name).findOne();
      console.log('\nSample document structure:');
      if (sample) {
        console.log(JSON.stringify(Object.keys(sample).reduce((acc, key) => {
          // Show field names and their types but not actual values
          acc[key] = typeof sample[key] === 'object' && sample[key] !== null ? 
                    (Array.isArray(sample[key]) ? 'Array' : 'Object') : 
                    typeof sample[key];
          return acc;
        }, {}), null, 2));
      } else {
        console.log('No documents found in this collection');
      }
    }
    
  } catch (error) {
    console.error('Error checking MongoDB schema:', error);
  } finally {
    // Close the connection
    if (client) await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the function
checkMongoDBSchema().catch(console.error);

// Test script to check if user preferences can be created
const { v4: uuidv4 } = require('uuid');

async function testPreferencesCreation() {
    console.log('Testing user preferences creation...');
    
    // Simple test document
    const testPreferences = {
        preference_id: uuidv4(),
        user_id: uuidv4(),
        theme: 'system',
        last_active_conversation: null,
        created_at: new Date(),
        updated_at: new Date()
    };
    
    console.log('Test document structure:', testPreferences);
    console.log('All fields have values:', Object.keys(testPreferences).every(key => testPreferences[key] !== undefined));
}

testPreferencesCreation();

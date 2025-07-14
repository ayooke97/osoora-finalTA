// Now update with session ID and message content - using snake_case field names consistently
const updateResult = await db.collection('conversations').updateOne(
    { conversation_id: conversationId },
    { 
        $set: { 
            dashscope_session_id: sessionId, 
            updated_at: new Date()
        },
        $push: {
            messages: {
                $each: [
                    {
                        role: 'user',
                        content: typeof message === 'object' ? JSON.stringify(message) : message,
                        timestamp: new Date()
                    },
                    {
                        role: 'assistant',
                        content: typeof lastProcessedText === 'object' ? JSON.stringify(lastProcessedText) : lastProcessedText,
                        timestamp: new Date()
                    }
                ]
            }
        }
    }
);

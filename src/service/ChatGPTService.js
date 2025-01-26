const db = require("./db"); // Correctly import the database connection

class ChatGPTService {
    /**
     * Save a chat message to the database.
     * @param {number} userId - The ID of the user.
     * @param {string} messageContent - The user's message.
     * @param {string} responseContent - The AI's response.
     */
    async saveChatMessage(userId, messageContent, responseContent) {
        try {
            const query = `
                INSERT INTO chat_messages (user_id, message_content, response_content, created_at)
                VALUES (?, ?, ?, NOW())
            `;
            const values = [userId, messageContent, responseContent];
            await db.execute(query, values);
            return { success: true, message: "Message saved successfully." };
        } catch (error) {
            console.error("Error saving chat message:", error.message);
            throw new Error("Failed to save chat message.");
        }
    }

    /**
     * Fetch chat messages for a specific user.
     * @param {number} userId - The ID of the user.
     */
    async getChatMessages(userId) {
        try {
            const query = `
                SELECT id, message_content, response_content, created_at
                FROM chat_messages
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;
            const [rows] = await db.execute(query, [userId]); // Extract rows from the result
            return rows;
        } catch (error) {
            console.error("Error fetching chat messages:", error.message);
            throw new Error("Failed to fetch chat messages.");
        }
    }
}

module.exports = new ChatGPTService();
